import { UIPanel } from "../UIPanel";
import { UIManager } from "../UIManager";
import { WeaponConfig, WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";
import { PlayerWeaponData } from "client/game/DataManager/WeaponDataManager";
import { DataManager } from "client/game/DataManager/DataManager";
import { KnitClient } from "@rbxts/knit";
import { MessageManager } from "client/game/MessageManager/MessageManager";
import { Messages } from "client/game/MessageManager/MessageDefine";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { UIWeaponInfoPanel } from "./UIWeaponInfoPanel";

type ToolCache = {
    assetId: number
    tool: Tool | undefined
}

export class UIWeaponPanel extends UIPanel
{
    public static Name = "UIWeaponPanel"

    private ui?: ScreenGui = undefined;
    private weaponProto?: Frame = undefined

    private btnQuit?: TextButton
    private boxWeapon?: ScrollingFrame
    private itemWeapons: [weapon: PlayerWeaponData, uiEle: Frame][] = []

    private weapons: PlayerWeaponData[] = []
    private equippedWeapon: PlayerWeaponData | undefined = undefined
    private toolCache: ToolCache[] = []

    private unBindHandle: (() => void)[] = []
    private openWeaponInfoPanel: ((data: PlayerWeaponData) => void) | undefined = undefined

    public OnShow(depth: number, ...params: unknown[]): void
    {
        this.Init(depth)
    }

    public OnClose(): void
    {
        this.ui?.Destroy()
    }

    private Init(depth: number)
    {
        this.ui = UIPanel.LoadUIPanel(UIWeaponPanel.Name)
        this.ui.DisplayOrder = depth
        this.weaponProto = UIPanel.LoadUIElements("WeaponProto")

        let elements = this.ui.GetDescendants()
        this.btnQuit = elements.find(ele => ele.Name === "BtnQuit") as TextButton
        this.boxWeapon = elements.find(ele => ele.Name === "BoxWeapon") as ScrollingFrame
        this.RenderWeapons()
    }

    // private Init()
    // {
    //     let elements = UIWeaponPanel.ui.GetDescendants()
    //     this.btnQuit = elements.find(ele => ele.Name === "BtnQuit") as TextButton
    //     this.boxWeapon = elements.find(ele => ele.Name === "BoxWeapon") as ScrollingFrame
    //     this.RenderWeapons()

    //     let conn = this.btnQuit?.MouseButton1Down.Connect(() =>
    //     {
    //         UIManager.GetInstance().Close(UIWeaponPanel)
    //         conn?.Disconnect()
    //     })
    // }

    public BindEvent()
    {
        let conn = this.btnQuit?.MouseButton1Down.Connect(() =>
        {
            UIManager.GetInstance().Close(UIWeaponPanel)
        })
        this.unBindHandle.push(() => conn?.Disconnect())

        this.openWeaponInfoPanel = data =>
        {
            UIManager.GetInstance().Open(UIWeaponInfoPanel, data)
        }
    }

    public UnBindEvent()
    {
        this.unBindHandle.forEach(h => h())
        this.openWeaponInfoPanel = undefined
    }

    private CreateWeaponItem(weaponData: PlayerWeaponData, isEquipped: boolean = false)
    {
        let config = WeaponConfigCollection.GetConfigById(weaponData.Id)

        let weapon = this.weaponProto!.Clone()
        let viewportFrame = weapon.GetDescendants().find(ele => ele.Name === "ViewportFrame") as ViewportFrame
        let textIsEquipped = weapon.GetDescendants().find(ele => ele.Name === "TextIsEquipped") as TextLabel
        let btnWeapon = weapon.GetDescendants().find(ele => ele.Name === "BtnWeapon") as ImageButton
        let camera = new Instance("Camera")

        textIsEquipped.Visible = isEquipped
        viewportFrame.CurrentCamera = camera
        camera.Parent = viewportFrame
        camera.CFrame = new CFrame(new Vector3(0, 2, 6)).mul(CFrame.Angles(0, 0, 45))
        btnWeapon.MouseButton1Click.Connect(() =>
        {
            if (this.openWeaponInfoPanel)
            {
                this.openWeaponInfoPanel(weaponData)
            }
        })

        task.spawn(() =>
        {
            let toolCache = Players.LocalPlayer.WaitForChild("Cache").FindFirstChild(tostring(config.assetId)) as Tool
            if (!toolCache)
            {
                KnitClient.GetService("LoadAssetsService").LoadAsset.Fire(config.assetId)
            }

            while (this.ui?.IsDescendantOf(Players.LocalPlayer) && wait())
            {
                toolCache = Players.LocalPlayer.WaitForChild("Cache").FindFirstChild(tostring(config.assetId)) as Tool
                if (toolCache)
                {
                    let tool = toolCache.Clone()
                    tool.Parent = viewportFrame
                    break
                }
            }
        })

        return weapon
    }

    private RenderWeapons()
    {
        let weapons = DataManager.GetInstance().GetAllWeapons()
        let equippedWeapon = DataManager.GetInstance().GetEquippedWeapon()
        weapons.forEach(weapon =>
        {
            let weaponConfig = WeaponConfigCollection.GetConfigById(weapon.Id)
            let uiEle = this.CreateWeaponItem(weapon, weapon.Guid === equippedWeapon)
            this.itemWeapons.push([weapon, uiEle])
            uiEle.Parent = this.boxWeapon
        })

        MessageManager.GetInstance().Subscribe(Messages.AddWeapon, data =>
        {
            let weapon = data as PlayerWeaponData

            let weaponConfig = WeaponConfigCollection.GetConfigById(weapon.Id)
            let uiEle = this.CreateWeaponItem(weapon)

            this.itemWeapons.push([weapon, uiEle])
            uiEle.Parent = this.boxWeapon
        })

        MessageManager.GetInstance().Subscribe(Messages.RemoveWeapon, data =>
        {
            let weapon = data as PlayerWeaponData

            let index = this.itemWeapons.findIndex(ele => ele[0].Guid === weapon.Guid)
            let [_, frame] = this.itemWeapons[index]
            frame.Destroy()
            this.itemWeapons.remove(index)
        })

        MessageManager.GetInstance().Subscribe(Messages.EquipWeapon, data =>
        {
            let equippedWeapon = data as PlayerWeaponData
            this.itemWeapons.forEach(([weapon, uiEle]) =>
            {
                let textIsEquipped = uiEle.GetDescendants().find(ele => ele.Name === "TextIsEquipped") as TextLabel
                textIsEquipped.Visible = weapon.Guid === equippedWeapon.Guid
            })
        })
    }
}