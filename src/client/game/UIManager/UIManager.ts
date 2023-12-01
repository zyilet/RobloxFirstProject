import { UIPanel } from "./UIPanel";
import { UIPanelStack } from "./UIPanelStack";

export class UIManager
{

    private static instance: UIManager
    public static GetInstance()
    {
        return this.instance ??= new UIManager()
    }

    public Init()
    {

        return this
    }

    public Update(dt: number)
    {
        if (this.uiPanelStack.GetDepth() > 0)
        {
            let [name, panel] = this.uiPanelStack.Peek()
            panel.OnUpdate(dt)
        }
    }

    private uiPanelStack: UIPanelStack = new UIPanelStack()

    public Open<T extends UIPanel>(UIPanel: { new(): T, Name: string }, ...params: unknown[])
    {
        if (this.uiPanelStack.GetDepth() > 0)
        {
            let [name, panel] = this.uiPanelStack.Peek()
            panel.Covered()
        }

        let panel = new UIPanel()
        this.uiPanelStack.Push([UIPanel.Name, panel])
        panel.Show(this.uiPanelStack.GetDepth(), ...params)
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
            panel.Close()

            if (this.uiPanelStack.GetDepth() > 0)
            {
                let [nextName, nextPanel] = this.uiPanelStack.Peek()
                nextPanel.UnCovered()
            }

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
