import { UIManager } from "../UIManager";
import { UIPanel } from "../UIPanel";
import { UIWeaponPanel } from "./UIWeaponPanel";

export class UIMainPanel extends UIPanel
{
    public static Name = "UIMainPanel"


    private ui?: ScreenGui = undefined
    private btnWeapon?: ImageButton
    private btnPet?: ImageButton

    private unBindHandles: (() => void)[] = []

    public OnShow(depth: number): void
    {
        this.Init(depth)
    }

    private Init(depth: number)
    {
        this.ui = UIPanel.LoadUIPanel(UIMainPanel.Name)
        this.ui.DisplayOrder = depth

        let uiElements = this.ui.GetDescendants()
        this.btnWeapon = uiElements.find(ele => ele.Name === "BtnWeapon") as ImageButton
        this.btnPet = uiElements.find(ele => ele.Name === "BtnPet") as ImageButton
    }

    public OnClose(): void
    {
        this.ui?.Destroy()
    }

    public BindEvent()
    {
        let c1 = this.btnWeapon!.MouseButton1Down.Connect(() =>
        {
            print("按下武器按钮")
            UIManager.GetInstance().Open(UIWeaponPanel, "打开武器页面")
        })
        let c2 = this.btnPet!.MouseButton1Down.Connect(() =>
        {
            print("按下宠物按钮")
        })

        this.unBindHandles.push(() =>
        {
            c1.Disconnect()
            c2.Disconnect()
        })
    }

    public UnBindEvent()
    {
        this.unBindHandles.forEach(h => h())
        this.unBindHandles.clear()
    }
}