import { DisposablePack } from "../UIEvent";
import { UIManager } from "../UIManager";
import { UIPanel } from "../UIPanel";
import { ConfirmPanelGui } from "./ConfirmPanelGui";

export class ConfirmPanelParam
{
    public Content: string
    public ConfirmAction: () => void
    public CloseAction: () => void
    public CancelAction: { (): void } | undefined

    constructor(content: string, confirmAction: { (): void }, closeAction: { (): void }, cancelAction: { (): void } | undefined = undefined)
    {
        this.Content = content
        this.ConfirmAction = confirmAction
        this.CloseAction = closeAction
        this.CancelAction = cancelAction
    }
}

export class ConfirmPanel extends UIPanel
{
    private gui: ConfirmPanelGui
    private param: ConfirmPanelParam | undefined

    private disposablePack = new DisposablePack()

    constructor()
    {
        super()
        this.gui = new ConfirmPanelGui()
    }

    public OnShow(depth: number, ...params: unknown[]): void
    {
        this.param = params[0] as ConfirmPanelParam
        if (this.param.CancelAction === undefined)
        {
            this.gui.SetCancelVisible(false)
        }

        this.gui.SetContent(this.param.Content)
        this.gui.FadeIn()
    }
    public OnClose(): void
    {
        this.gui.Destroy()
    }
    public BindEvent(): void
    {
        this.gui.OnCloseClick.SubScribe(() =>
        {
            this.param?.CloseAction()
            UIManager.GetInstance().Close(ConfirmPanel)
        }).AddTo(this.disposablePack)

        this.gui.OnCancelClick.SubScribe(() =>
        {
            this.param?.CancelAction?.()
            UIManager.GetInstance().Close(ConfirmPanel)
        }).AddTo(this.disposablePack)

        this.gui.OnConfirmClick.SubScribe(() =>
        {
            this.param?.ConfirmAction()
            UIManager.GetInstance().Close(ConfirmPanel)
        }).AddTo(this.disposablePack)
    }
    public UnBindEvent(): void
    {
        this.disposablePack.Dispose()
    }

}