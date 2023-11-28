import { AssetService } from "@rbxts/services";
import { UIPanel } from "../UIPanel";
import { UIManager } from "../UIManager";

export class UIWeaponPanel extends UIPanel
{
    public static Name = "UIWeaponPanel"

    private static isInited: boolean
    private static ui: ScreenGui

    private static _staticInit = (() =>
    {
        this.ui = UIPanel.LoadUIPanel(this.Name)
        this.ui.Enabled = false
        this.isInited = true
    })()

    private btnQuit?: TextButton

    public OnShow(depth: number): void
    {
        this.InitUI()
        this.InitEvent()
        UIWeaponPanel.ui.DisplayOrder = depth
        UIWeaponPanel.ui.Enabled = true
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

    private InitUI()
    {
        let elements = UIWeaponPanel.ui.GetDescendants()
        this.btnQuit = elements.find(ele => ele.Name === "BtnQuit") as TextButton

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
}