import { Players, ReplicatedStorage, StarterGui, UserInputService } from "@rbxts/services";
import { UIManager } from "../UIManager";
import { UIPanel } from "../UIPanel";

export class UILoadingPanel extends UIPanel
{
    public static Name = "UILoadingPanel"

    private static isInited: boolean
    private static ui: ScreenGui

    private static _staticInit = (() =>
    {
        let PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui")
        this.ui = ReplicatedStorage.WaitForChild("UIPanels").WaitForChild(UILoadingPanel.Name) as ScreenGui
        this.ui.Enabled = false
        this.ui.Parent = PlayerGui

        this.isInited = true
    })()

    private conn?: RBXScriptConnection

    public OnInit(): void
    {
        if (UILoadingPanel.isInited)
        {
            return
        }
    }

    public OnShow(depth: number): void
    {
        UILoadingPanel.ui.DisplayOrder = depth
        UILoadingPanel.ui.Enabled = true

        this.conn = Players.LocalPlayer.GetMouse().Button1Down.Connect(() =>
        {
            UIManager.GetInstance().Close(UILoadingPanel)
        })
    }

    public OnClose(): void
    {
        this.conn?.Disconnect()
        UILoadingPanel.ui.Enabled = false
    }
}