import { Players, ReplicatedStorage, StarterGui, UserInputService } from "@rbxts/services";
import { UIManager } from "../UIManager";
import { UIPanel } from "../UIPanel";

export class UILoadingPanel extends UIPanel
{
    public static Name = "UILoadingPanel"

    private static isInited: boolean
    private static panel: ScreenGui

    private static _staticInit = (() =>
    {
        this.panel = UIPanel.LoadUIPanel(this.Name)
        this.panel.Enabled = false
        this.isInited = true
    })()

    private conn?: RBXScriptConnection

    public OnShow(depth: number): void
    {
        UILoadingPanel.panel.DisplayOrder = depth
        UILoadingPanel.panel.Enabled = true
    }

    public OnClose(): void
    {
        this.conn?.Disconnect()
        UILoadingPanel.panel.Enabled = false
    }

    public BindEvent(): void
    {
    }
    public UnBindEvent(): void
    {
    }
}