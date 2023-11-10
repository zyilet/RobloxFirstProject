import { Players } from "@rbxts/services";
import { UIPanelName } from "./UI/UIManager";

export class UIUtils
{
    public static GetUIPanel(name: UIPanelName)
    {
        return Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild(name) as ScreenGui;
    }
}