import { Players, TweenService, Workspace } from "@rbxts/services"
import { ScalableButton } from "../Base/ScalableButton"
import { Subscribable, UIEvent } from "../UIEvent"
import { UITools } from "../UITools"
import { resolve } from "@rbxts/knit/Knit/Util/Promise"

export class ConfirmPanelGui
{
    private gui: ScreenGui
    private fitScale: UIScale
    private fadeScale: UIScale
    private btnClose: ScalableButton
    private btnConfirm: ScalableButton
    private btnCancel: ScalableButton
    private textContent: TextLabel

    private onCloseClickEvent: UIEvent
    private onCancelClickEvent: UIEvent
    private onConfirmClickEvent: UIEvent

    public OnCloseClick: Subscribable
    public OnCancelClick: Subscribable
    public OnConfirmClick: Subscribable

    constructor()
    {
        this.gui = UITools.LoadGui("ConfirmPanel")
        this.fitScale = UITools.FindEle(this.gui, "FitScale")
        this.fadeScale = UITools.FindEle(this.gui, "FadeScale")
        this.btnClose = new ScalableButton(UITools.FindEle(this.gui, "BtnClose"))
        this.btnConfirm = new ScalableButton(UITools.FindEle(this.gui, "BtnConfirm"))
        this.btnCancel = new ScalableButton(UITools.FindEle(this.gui, "BtnCancel"))
        this.textContent = UITools.FindEle(this.gui, "TextContent")

        this.onCloseClickEvent = new UIEvent()
        this.onCancelClickEvent = new UIEvent()
        this.onConfirmClickEvent = new UIEvent()

        this.OnCloseClick = this.onCloseClickEvent.CreateSubscribable()
        this.OnCancelClick = this.onCancelClickEvent.CreateSubscribable()
        this.OnConfirmClick = this.onConfirmClickEvent.CreateSubscribable()

        this.btnClose.OnClick.SubScribe(() => this.onCloseClickEvent.Publish())
        this.btnCancel.OnClick.SubScribe(() => this.onCancelClickEvent.Publish())
        this.btnConfirm.OnClick.SubScribe(() => this.onConfirmClickEvent.Publish())


        this.fitScale.Scale = Workspace.CurrentCamera!.ViewportSize.Y / 1440
        this.gui.Parent = Players.LocalPlayer!.WaitForChild("PlayerGui")
    }

    public SetContent(content: string)
    {
        this.textContent.Text = content
    }

    public SetCancelVisible(visible: boolean)
    {
        this.btnCancel.SetVisible(visible)
    }

    public Destroy()
    {
        this.gui.Destroy()
    }

    public async FadeIn()
    {
        return new Promise<void>(resolve =>
        {
            this.fadeScale.Scale = 0
            let tween = TweenService.Create(this.fadeScale, new TweenInfo(0.2, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { Scale: 1 })
            tween.Play()
            tween.Completed.Wait()
            resolve()
        })
    }

    public async FadeOut()
    {
        return new Promise<void>(resolve =>
        {
            this.fadeScale.Scale = 1
            let tween = TweenService.Create(this.fadeScale, new TweenInfo(0.2, Enum.EasingStyle.Back, Enum.EasingDirection.In), { Scale: 0 })
            tween.Play()
            tween.Completed.Wait()
            resolve()
        })
    }
}