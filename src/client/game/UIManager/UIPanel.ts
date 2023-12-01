import { Players, ReplicatedStorage } from "@rbxts/services";

export abstract class UIPanel
{
    private static playerGui: PlayerGui
    private static uiPanels: Folder
    private static uiElements: Folder
    private static isUIPanelInited: boolean = false;

    private static _staticUIPanelInit = (() =>
    {
        print("UIPanel静态初始化")
        this.playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
        this.uiPanels = ReplicatedStorage.WaitForChild("UI").WaitForChild("UIPanels") as Folder
        this.uiElements = ReplicatedStorage.WaitForChild("UI").WaitForChild("UIElements") as Folder
        this.isUIPanelInited = true
    })()

    protected static LoadUIPanel(panelName: string)
    {
        while (this.isUIPanelInited === false) wait()
        let panel = this.uiPanels.WaitForChild(panelName) as ScreenGui

        if (panel === undefined)
        {
            error(`找不到这个UI面板__${panelName}`)
        }

        panel = panel.Clone()
        panel.Parent = this.playerGui
        return panel
    }

    protected static LoadUIElements<T extends Instance>(eleName: string)
    {
        while (this.isUIPanelInited === false) wait()
        let ele = this.uiElements.WaitForChild(eleName) as T

        if (ele === undefined)
        {
            error(`找不到这个元素__${eleName}`)
        }

        ele = ele.Clone()
        return ele
    }

    protected static EnsureNotNil(ele: unknown, name: string = "")
    {
        if (ele === undefined)
        {
            error(`找不到UI元素__${name}`)
        }
    }

    public static Name: string

    public abstract OnShow(depth: number, ...params: unknown[]): void
    public abstract OnClose(): void
    public abstract BindEvent(): void
    public abstract UnBindEvent(): void

    public OnCovered() { }
    public OnUnCovered() { }
    public OnUpdate(dt: number) { }

    public Show(depth: number, ...params: unknown[])
    {
        this.OnShow(depth, ...params)
        this.BindEvent()
    }

    public Covered()
    {
        this.UnCovered()
        this.UnBindEvent()
    }

    public UnCovered()
    {
        this.OnUnCovered()
        this.BindEvent()
    }

    public Close()
    {
        this.OnClose()
        this.UnBindEvent()
    }

    public Update(dt: number)
    {
        this.OnUpdate(dt)
    }
}

// export interface RBXScriptConnection
// {
//     BindToUI(): void
// }