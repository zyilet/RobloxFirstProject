import { DisposablePack } from "../UIEvent";
import { UIManager } from "../UIManager";
import { UIPanel } from "../UIPanel";
import { WeaponPanel } from "../WeaponPanel/WeaponPanel";
import { MainPanelGui } from "./MainPanelGui";

export class MainPanel extends UIPanel
{
    private uiObj: MainPanelGui

    private disposablePack = new DisposablePack()

    constructor()
    {
        super()

        this.uiObj = new MainPanelGui()
    }

    public OnShow(depth: number, ...params: unknown[]): void
    {
        this.uiObj.SetDisplayOrder(depth)
    }
    public OnClose(): void | unknown[]
    {
        this.uiObj.Destroy()
    }
    public BindEvent(): void
    {
        this.uiObj.OnBtnWeaponClick
            .SubScribe(() =>
            {
                print("点击武器按钮")
                UIManager.GetInstance().Open(WeaponPanel)
            })
            .AddTo(this.disposablePack)
    }
    public UnBindEvent(): void
    {
        this.disposablePack.Dispose()
    }

}