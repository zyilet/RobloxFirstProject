import { Players } from "@rbxts/services";
import { UIPanelName } from "./UIManager/UIManager_Back";

export class UIUtils
{
    public static GetUIPanel(name: UIPanelName)
    {
        return Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild(name) as ScreenGui;
    }
}