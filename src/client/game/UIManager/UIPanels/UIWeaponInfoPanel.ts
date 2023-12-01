import { UIPanel } from "../UIPanel";

export class UIWeaponInfoPanel extends UIPanel
{

    public static Name = "UIWeaponInfoPanel"

    private ui?: ScreenGui = undefined


    public OnShow(depth: number, ...params: unknown[]): void
    {
        this.ui = UIPanel.LoadUIPanel(UIWeaponInfoPanel.Name)
        this.ui.DisplayOrder = depth

        print(params[0])
    }
    public OnClose(): void
    {

    }
    public BindEvent(): void
    {

    }
    public UnBindEvent(): void
    {

    }


    // private static _staticInit = (() =>
    // {
    //     this.ui = UIPanel.LoadUIPanel(this.Name)
    //     this.ui.Enabled = false
    //     this.isInited = true
    // })()



}