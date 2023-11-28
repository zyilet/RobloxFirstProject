import { Players, ReplicatedStorage } from "@rbxts/services";

export abstract class UIPanel
{
    private static playerGui: PlayerGui
    private static uiPanels: Folder
    private static isUIPanelInited: boolean = false;

    private static _staticUIPanelInit = (() =>
    {
        print("UIPanel静态初始化")
        this.playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
        this.uiPanels = ReplicatedStorage.WaitForChild("UI").WaitForChild("UIPanels") as Folder
        this.isUIPanelInited = true
    })()

    protected static LoadUIPanel(panelName: string)
    {
        while (this.isUIPanelInited === false) wait()

        let panel = this.uiPanels.WaitForChild(panelName) as ScreenGui

        panel.Parent = this.playerGui

        return panel
    }

    protected static EnsureNotNil(ele: unknown, name: string = "")
    {
        if (ele === undefined)
        {
            error(`找不到UI元素__${name}`)
        }
    }

    public static Name: string
    public abstract OnShow(depth: number): void
    public abstract OnClose(): void
    public abstract OnCovered(): void
    public abstract OnUnCovered(): void
}

export interface RBXScriptConnection
{
    BindToUI(): void
}