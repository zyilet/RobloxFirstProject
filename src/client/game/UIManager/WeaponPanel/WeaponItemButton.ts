import { DataManager } from "client/game/DataManager/DataManager"
import { ScalableButton } from "../Base/ScalableButton"
import { UITools } from "../UITools"
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig"
import { Players } from "@rbxts/services"
import { KnitClient } from "@rbxts/knit"

export class WeaponItemButton extends ScalableButton
{
    private textName: TextLabel
    private imgSelected: ImageLabel
    private imgEquip: ImageLabel
    private viewPort: ViewportFrame

    constructor(root: Frame)
    {
        super(root)

        this.textName = UITools.FindEle(this.root, "TextName")
        this.imgSelected = UITools.FindEle(this.root, "ImgSelected")
        this.imgEquip = UITools.FindEle(this.root, "ImgEquip")
        this.viewPort = UITools.FindEle(this.root, "ViewportFrame")

        this.imgEquip.Visible = false
        this.imgSelected.Visible = false

        let camera = new Instance("Camera")
        camera.Parent = this.viewPort
        camera.CFrame = new CFrame(new Vector3(0, 2, 8))
        this.viewPort.CurrentCamera = camera
    }

    public SetSelected(value: boolean)
    {
        this.imgSelected.Visible = value
    }

    public SetEquipState(value: boolean)
    {
        this.imgEquip.Visible = value
    }

    public LoadWeapon(guid: string)
    {
        let weaponId = DataManager.GetInstance().GetAllWeapons().find(ele => ele.Guid === guid)?.Id
        if (weaponId === undefined)
        {
            warn(`找不到guid为【${guid}】的武器`)
            return
        }

        let config = WeaponConfigCollection.GetConfigById(weaponId)

        this.textName.Text = config.name

        task.spawn(() =>
        {
            //等待1帧，避免父对象在当前帧没有设置上导致加载while循环进不去的问题
            wait()

            let toolCache = Players.LocalPlayer.WaitForChild("Cache").FindFirstChild(tostring(config.assetId)) as Tool
            if (!toolCache)
            {
                KnitClient.GetService("LoadAssetsService").LoadAsset.Fire(config.assetId)
            }

            while (this.root.IsDescendantOf(Players.LocalPlayer) && wait())
            {
                toolCache = Players.LocalPlayer.WaitForChild("Cache").FindFirstChild(tostring(config.assetId)) as Tool
                if (toolCache)
                {
                    let tool = toolCache.Clone()
                    tool.Parent = this.viewPort
                    break
                }
            }
        })
    }
}