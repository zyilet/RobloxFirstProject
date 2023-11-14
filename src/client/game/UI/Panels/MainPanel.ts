import { KnitClient } from "@rbxts/knit";
import { BasePanel } from "./BasePanel";
import NumberFormatter from "shared/NumberFormatter";
import { Connection } from "@rbxts/knit/Knit/Util/Signal";
import { Players } from "@rbxts/services";

export class MainPanel extends BasePanel
{
    private _text?: TextLabel;
    private _ui?: ScreenGui;

    private connection?: Connection;

    public Init(ui: ScreenGui): void
    {
        this._text = ui.WaitForChild("AttackValue").WaitForChild("Text") as TextLabel;
        this._ui = ui;
    }

    public Show(): void
    {
        this.OnShow();
        this._ui!.Enabled = true;
    }
    public Hide(): void
    {
        this._ui!.Enabled = false;
        this.OnHide();
    }

    private OnShow()
    {
        let playerDataService = KnitClient.GetService("PlayerDataService");

        this._text!.Text = NumberFormatter.Format(playerDataService.GetAttack());

        this.connection = playerDataService.OnAttackChanged.Connect(value => this._text!.Text = NumberFormatter.Format(value));
    }

    private OnHide()
    {
        this.connection?.Disconnect();
    }
}