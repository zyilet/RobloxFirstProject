import { Players, RunService, TweenService, Workspace } from "@rbxts/services"
import { UITools } from "../UITools"
import { PlayerWeaponData } from "client/game/DataManager/WeaponDataManager"
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig"
import { KnitClient } from "@rbxts/knit"

let qualityToColor = new Map<string, Color3>()
qualityToColor.set("Normal", Color3.fromHex("666666"))
qualityToColor.set("Rare", Color3.fromHex("55AAFF"))

export class ObtainWeaponPanelGui
{
    private gui: ScreenGui
    private fitScale: UIScale
    private fadeScale: UIScale
    private viewport: ViewportFrame
    private imgBack: ImageLabel
    private textName: TextLabel
    private textAttack: TextLabel

    private weaponData: PlayerWeaponData
    private isShowing: boolean = true

    constructor(weaponData: PlayerWeaponData)
    {
        this.weaponData = weaponData
        this.gui = UITools.LoadGui("ObtainWeaponPanel")
        this.gui.DisplayOrder = 100

        this.fitScale = UITools.FindEle(this.gui, "FitScale")
        this.fadeScale = UITools.FindEle(this.gui, "FadeScale")
        this.viewport = UITools.FindEle(this.gui, "ViewportFrame")
        this.imgBack = UITools.FindEle(this.gui, "ImgBack")
        this.textName = UITools.FindEle(this.gui, "TextName")
        this.textAttack = UITools.FindEle(this.gui, "TextAttack")

        let camera = new Instance("Camera")
        camera.Parent = this.viewport
        camera.CFrame = new CFrame(new Vector3(0, 2, 8))

        //适配设备大小
        this.fitScale.Scale = Workspace.CurrentCamera!.ViewportSize.Y / 1080
        this.fadeScale.Scale = 0
        this.Init()
    }

    public SetParent(parent: Instance)
    {
        this.gui.Parent = parent
    }

    public Destroy()
    {
        this.isShowing = false
        this.gui.Destroy()
    }

    private Init()
    {
        let weaponConfig = WeaponConfigCollection.GetConfigById(this.weaponData.Id)
        if (weaponConfig === undefined)
        {
            warn(`找不到id为【${this.weaponData.Id}】的武器`)
            return
        }

        this.textName.Text = weaponConfig.Name
        this.textAttack.Text = tostring(weaponConfig.Strength)
        this.textName.TextStrokeColor3 = qualityToColor.get(weaponConfig.Quality)!
        this.textAttack.TextStrokeColor3 = qualityToColor.get(weaponConfig.Quality)!

        this.LoadWeapon()
    }

    private LoadWeapon()
    {
        let config = WeaponConfigCollection.GetConfigById(this.weaponData.Id)

        task.spawn(() =>
        {
            let toolCache = Players.LocalPlayer.WaitForChild("Cache").FindFirstChild(tostring(config.AssetId)) as Tool
            if (!toolCache)
            {
                KnitClient.GetService("LoadAssetsService").LoadAsset.Fire(config.AssetId)
            }

            while (this.isShowing && wait())
            {
                toolCache = Players.LocalPlayer.WaitForChild("Cache").FindFirstChild(tostring(config.AssetId)) as Tool
                if (toolCache)
                {
                    let tool = toolCache.Clone()
                    tool.Parent = this.viewport
                    break
                }
            }
        })
    }

    public async Show()
    {

        //每秒旋转10°
        let rotationSpeed = 100
        task.spawn(() =>
        {
            while (this.isShowing)
            {
                let dt = RunService.Heartbeat.Wait()[0]
                this.imgBack.Rotation += rotationSpeed * dt
            }
        })

        let targetTime = 0.6 * (1 - this.fadeScale.Scale)
        let tween = TweenService.Create(this.fadeScale, new TweenInfo(targetTime, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { Scale: 1 })
        tween.Play()
        tween.Completed.Wait()
    }

    public async Hide()
    {
        let targetTime = 0.2 * this.fadeScale.Scale

        let tween = TweenService.Create(this.fadeScale, new TweenInfo(targetTime, Enum.EasingStyle.Back, Enum.EasingDirection.In), { Scale: 0 })
        tween.Play()
        tween.Completed.Wait()
        this.Destroy()
    }
}