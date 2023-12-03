import { Players, ReplicatedStorage } from "@rbxts/services"

export class UITools
{
    public static FindEle<T extends GuiObject | UIBase>(root: GuiBase, name: string)
    {
        return root
            .GetDescendants()
            .find(ele => ele.Name === name) as T
            ?? error(`找不到【${name}】UI对象`)
    }

    public static FindGui(name: string)
    {
        return ReplicatedStorage.WaitForChild("UI").WaitForChild("UIPanels").WaitForChild(name) as ScreenGui
    }

    public static LoadGui(name: string)
    {
        return (ReplicatedStorage.WaitForChild("UI").WaitForChild("UIPanels").WaitForChild(name) as ScreenGui).Clone()
    }

    public static LoadEle<T extends GuiObject | UIBase>(name: string)
    {
        return (ReplicatedStorage.WaitForChild("UI").WaitForChild("UIElements").WaitForChild(name) as T).Clone()
    }
}