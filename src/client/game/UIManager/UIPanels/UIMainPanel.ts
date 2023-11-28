import { UIManager } from "../UIManager";
import { UIPanel } from "../UIPanel";
import { UIWeaponPanel } from "./UIWeaponPanel";

export class UIMainPanel extends UIPanel
{
    public static Name = "UIMainPanel"

    private static isInited: boolean = false
    private static panel: ScreenGui
    private static btnWeapon: ImageButton
    private static btnPet: ImageButton

    private static _staticInit = (() =>
    {
        this.panel = UIPanel.LoadUIPanel(this.Name)
        this.panel.Enabled = false

        let uiElements = this.panel.GetDescendants()
        print(uiElements.size())

        this.btnWeapon = uiElements.find(ele => ele.Name === "BtnWeapon") as ImageButton
        this.btnPet = uiElements.find(ele => ele.Name === "BtnPet") as ImageButton
    })()

    private conns: RBXScriptConnection[] = []

    public OnShow(depth: number): void
    {
        UIMainPanel.panel.Enabled = true
        UIMainPanel.panel.DisplayOrder = depth

        this.BindEvent()
    }

    public OnClose(): void
    {
        this.UnBindEvent()
    }

    public OnCovered(): void
    {
        this.UnBindEvent()
    }

    public OnUnCovered(): void
    {
        this.BindEvent()
    }

    private BindEvent()
    {
        this.conns.push(UIMainPanel.btnWeapon.MouseButton1Down.Connect(() =>
        {
            print("按下武器按钮")
            UIManager.GetInstance().Open(UIWeaponPanel)
        }))
        this.conns.push(UIMainPanel.btnPet.MouseButton1Down.Connect(() =>
        {
            print("按下宠物按钮")
        }))
    }

    private UnBindEvent()
    {
        this.conns.forEach(conn => conn.Disconnect())
    }
}