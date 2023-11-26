import { UIPanel } from "./UIPanel";
import { UIPanelStack } from "./UIPanelStack";

export class UIManager
{

    private static instance: UIManager
    public static GetInstance()
    {
        return this.instance ??= new UIManager()
    }

    private uiPanelStack: UIPanelStack = new UIPanelStack()

    public Open<T extends UIPanel>(UIPanel: { new(): T, Name: string })
    {
        let panel = new UIPanel()

        this.uiPanelStack.Push([UIPanel.Name, panel])

        panel.OnInit()
        panel.OnShow(this.uiPanelStack.GetDepth())
    }

    public Close<T extends UIPanel>(UIPanel: { new(): T, Name: string })
    {
        if (!this.uiPanelStack.Exist(UIPanel.Name))
        {
            error("当前不存在这个UI页面")
        }

        while (this.uiPanelStack.GetDepth() > 0)
        {
            let [name, panel] = this.uiPanelStack.Pop()
            panel.OnClose()

            if (name === UIPanel.Name)
            {
                return
            }
        }
    }

    public IsOpening<T extends UIPanel>(UIPanel: { new(): T, Name: string })
    {
        return this.uiPanelStack.Exist(UIPanel.Name)
    }
}
