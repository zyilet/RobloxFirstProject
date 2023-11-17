import { UIUtils } from "../UIUtils";
import { KnitClient } from "@rbxts/knit";
import NumberFormatter from "shared/NumberFormatter";
import { Connection } from "@rbxts/knit/Knit/Util/Signal";

export type UIPanelName = "MainPanel" | "TestPanel" | "WeaponPanel"

export class UIManager
{
    private static _instance: UIManager;
    public static GetInstance()
    {
        return this._instance ??= new UIManager();
    }

    private _displayOrder = 1;
    private _nameToPanels = new Map<UIPanelName, BasePanel>();
    private _nameToUI = new Map<string, ScreenGui>();

    public Show(name: UIPanelName)
    {
        if (!this._nameToPanels.has(name))
        {
            let panel = this.GetPanelForName(name);
            if (!panel)
            {
                warn(`${name} 没有相对应的panel实例`)
                return;
            }

            let ui = UIUtils.GetUIPanel(name);

            panel.Init(ui, UIManager.GetInstance());
            this._nameToPanels.set(name, panel);
            this._nameToUI.set(name, ui)
        }

        let panel = this._nameToPanels.get(name)!;
        let ui = this._nameToUI.get(name);

        ui!.DisplayOrder = this._displayOrder++;
        panel.Show();
    }

    public Hide(name: UIPanelName)
    {
        let panel = this._nameToPanels.get(name);
        if (!panel)
        {
            warn(`${name} 没有可以关闭的实例`)
            return;
        }

        panel.Hide();
    }

    public GetPanelForName(name: UIPanelName)
    {
        switch (name)
        {
            case "MainPanel":
                return new MainPanel();
            case "WeaponPanel":
                return new WeaponPanel();
        }
        return undefined;
    }
}

abstract class BasePanel
{
    public abstract Init(ui: ScreenGui, manager: any): void
    public abstract Show(): void
    public abstract Hide(): void
}

class MainPanel extends BasePanel
{
    private _uiManager: any;
    private _text?: TextLabel;
    private _ui?: ScreenGui;
    private _weaponsButton?: TextButton

    private connection?: Connection;

    public Init(ui: ScreenGui, manager: any): void
    {
        this._uiManager = manager
        this._text = ui.WaitForChild("AttackValue").WaitForChild("Text") as TextLabel;
        this._ui = ui;
        this._weaponsButton = ui.WaitForChild("Weapons") as TextButton;

        this.InitEvent();
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

    private InitEvent()
    {
        this._weaponsButton?.MouseButton1Click.Connect(() =>
        {
            UIManager.GetInstance().Show("WeaponPanel")
        })
    }
}

class WeaponPanel extends BasePanel
{
    private _uiManager: any
    private _ui?: ScreenGui;
    private _weaponItemPrefab?: TextButton;
    private _equipButton?: TextButton;
    private _sellButton?: TextButton;
    private _backButton?: TextButton;
    private _scrollingFrame?: ScrollingFrame;

    private _weaponIdToButton: Map<string, TextButton> = new Map<string, TextButton>;

    public Init(ui: ScreenGui, manager: any): void
    {
        this._ui = ui;
        this._weaponItemPrefab = ui.WaitForChild("Prefabs").WaitForChild("WeaponButton") as TextButton
        this._equipButton = ui.WaitForChild("Frame").WaitForChild("Equip") as TextButton
        this._sellButton = ui.WaitForChild("Frame").WaitForChild("Sell") as TextButton
        this._backButton = ui.WaitForChild("Frame").WaitForChild("Back") as TextButton
        this._scrollingFrame = ui.WaitForChild("Frame").WaitForChild("Weapons").WaitForChild("ScrollingFrame") as ScrollingFrame

        this.InitEvent()
    }

    public Show(): void
    {
        this._ui!.Enabled = true;
    }
    public Hide(): void
    {
        this._ui!.Enabled = false;
    }

    private InitEvent()
    {
        this._backButton?.MouseButton1Click.Connect(() =>
        {
            this.Hide()
        })
    }

    private RefreshUI()
    {
        let Weapons = KnitClient.GetService("WeaponService").GetAllWeapon();
    }
}