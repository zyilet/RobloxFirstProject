import { TweenService, Workspace } from "@rbxts/services"
import { UITools } from "../UITools"

export class TipsPanelGui
{
    private gui: ScreenGui
    private fitScale: UIScale
    private inner: Frame
    private infoCopy: Frame

    constructor()
    {
        this.gui = UITools.LoadGui("TipsPanel")

        this.fitScale = UITools.FindEle(this.gui, "FitScale") as UIScale
        this.inner = UITools.FindEle(this.gui, "Inner") as Frame
        this.infoCopy = UITools.FindEle(this.gui, "InfoCopy") as Frame

        this.fitScale.Scale = (Workspace.CurrentCamera?.ViewportSize.Y ?? 1080) / 1080
    }

    public GetCurTipsCount()
    {
        return this.inner.GetChildren().size() - 1
    }

    public async ShowTip(tip: string, color: Color3)
    {
        let info = this.infoCopy.Clone()
        info.Visible = true
        info.Parent = this.inner

        let text = UITools.FindEle(info, "Text") as TextLabel
        text.Text = tip
        text.TextColor3 = color

        let originalSize = text.Size
        text.Size = new UDim2()
        TweenService.Create(text, new TweenInfo(0.6, Enum.EasingStyle.Exponential, Enum.EasingDirection.Out), { Size: originalSize }).Play()
        wait(2)
        let tween = TweenService.Create(text, new TweenInfo(0.3, Enum.EasingStyle.Exponential, Enum.EasingDirection.In), { Size: new UDim2() })
        tween.Play()
        tween.Completed.Wait()
        info.Destroy()
    }

    public SetParent(panel: Instance)
    {
        this.gui.Parent = panel
    }

    public Destroy()
    {
        this.gui.Destroy()
    }
}