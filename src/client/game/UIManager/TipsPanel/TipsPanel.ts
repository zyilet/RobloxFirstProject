import { Players } from "@rbxts/services";
import { TipsPanelGui } from "./TipsPanelGui";

export class TipsPanel
{
    private gui: TipsPanelGui

    constructor()
    {
        this.gui = new TipsPanelGui()
    }

    public GetCurTipsCount()
    {
        return this.gui.GetCurTipsCount()
    }

    public Destroy()
    {
        this.gui.Destroy()
    }

    public ShowTip(tip: string, color: Color3)
    {
        this.gui.SetParent(Players.LocalPlayer.WaitForChild("PlayerGui"))
        this.gui.ShowTip(tip, color)
    }
}