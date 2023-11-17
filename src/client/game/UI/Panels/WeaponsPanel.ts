import { KnitServer } from "@rbxts/knit";
import { BasePanel } from "./BasePanel";
import { Players } from "@rbxts/services";

export class WeaponsPanel extends BasePanel
{
    private _ui?: ScreenGui;
    private _weaponItemPrefab?: TextButton;
    private _equipButton?: TextButton;
    private _sellButton?: TextButton;
    private _backButton?: TextButton;
    private _scrollingFrame?: ScrollingFrame;

    private _weaponIdToButton: Map<string, TextButton> = new Map<string, TextButton>;

    public Init(ui: ScreenGui): void
    {
        this._ui = ui;
        this._weaponItemPrefab = ui.WaitForChild("Prefabs").WaitForChild("WeaponButton") as TextButton
        this._equipButton = ui.WaitForChild("Frame").WaitForChild("Equip") as TextButton
        this._sellButton = ui.WaitForChild("Frame").WaitForChild("Sell") as TextButton
        this._backButton = ui.WaitForChild("Frame").WaitForChild("Back") as TextButton
        this._scrollingFrame = ui.WaitForChild("Frame").WaitForChild("Weapons").WaitForChild("ScrollingFrame") as ScrollingFrame
    }

    public Show(): void
    {
        this._ui!.Enabled = true;
    }
    public Hide(): void
    {
        this._ui!.Enabled = false;
    }

    private RefreshUI()
    {
        let Weapons = KnitServer.GetService("WeaponService").GetAllWeapon(Players.LocalPlayer);
    }
}