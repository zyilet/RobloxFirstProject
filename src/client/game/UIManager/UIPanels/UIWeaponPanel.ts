import { AssetService } from "@rbxts/services";
import { UIPanel } from "../UIPanel";
import { UIManager } from "../UIManager";
import { WeaponConfig } from "shared/GameConfig/WeaponConfig";

export class UIWeaponPanel extends UIPanel
{
    public static Name = "UIWeaponPanel"

    private static isInited: boolean
    private static ui: ScreenGui
    private static weaponItem: Frame

    private static _staticInit = (() =>
    {
        this.ui = UIPanel.LoadUIPanel(this.Name)
        this.ui.Enabled = false
        this.weaponItem = UIPanel.FinUIElements("ItemWeapon") as Frame

        this.isInited = true
    })()

    private btnQuit?: TextButton
    private boxWeapon?: ScrollingFrame

    public OnShow(depth: number): void
    {
        this.InitUI()
        this.InitEvent()
        UIWeaponPanel.ui.DisplayOrder = depth
        UIWeaponPanel.ui.Enabled = true

        let weapon = UIWeaponPanel.weaponItem.Clone()
        weapon.Parent = this.boxWeapon
    }
    public OnClose(): void
    {
        UIWeaponPanel.ui.Enabled = false
    }
    public OnCovered(): void
    {

    }
    public OnUnCovered(): void
    {

    }

    public OnUpdate(dt: number): void
    {

    }

    private InitUI()
    {
        let elements = UIWeaponPanel.ui.GetDescendants()
        this.btnQuit = elements.find(ele => ele.Name === "BtnQuit") as TextButton
        this.boxWeapon = elements.find(ele => ele.Name === "BoxWeapon") as ScrollingFrame

        UIPanel.EnsureNotNil(this.btnQuit)
    }
    private InitEvent()
    {
        let conn = this.btnQuit?.MouseButton1Down.Connect(() =>
        {
            UIManager.GetInstance().Close(UIWeaponPanel)
            conn?.Disconnect()
        })
    }

    private CreateWeaponItem(config: WeaponConfig, isEquipped: boolean = false)
    {
        
    }
}