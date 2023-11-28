import { UIPanel } from "../UIPanel";

export class UIWeaponInfoPanel extends UIPanel
{
    public static Name = "UIWeaponInfoPanel"

    private static isInited: boolean
    private static ui: ScreenGui

    private static _staticInit = (() =>
    {
        this.ui = UIPanel.LoadUIPanel(this.Name)
        this.ui.Enabled = false
        this.isInited = true
    })()

    public OnShow(depth: number): void
    {
        UIWeaponInfoPanel.ui.DisplayOrder = depth
        UIWeaponInfoPanel.ui.Enabled = true
    }
    public OnClose(): void
    {
        UIWeaponInfoPanel.ui.Enabled = false
    }
    public OnCovered(): void
    {
    }
    public OnUnCovered(): void
    {
    }

}