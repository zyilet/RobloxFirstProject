// import { UIUtils } from "../UIUtils";
// import { KnitClient } from "@rbxts/knit";
// import NumberFormatter from "shared/NumberFormatter";
// import { Connection } from "@rbxts/knit/Knit/Util/Signal";
// import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";
// import { TextChatService } from "@rbxts/services";

// export type UIPanelName = "MainPanel" | "TestPanel" | "WeaponPanel"

// export class UIManager_Back
// {
//     private static _instance: UIManager_Back;
//     public static GetInstance()
//     {
//         return this._instance ??= new UIManager_Back();
//     }

//     private _displayOrder = 1;
//     private _nameToPanels = new Map<UIPanelName, BasePanel>();
//     private _nameToUI = new Map<string, ScreenGui>();

//     public Show(name: UIPanelName)
//     {
//         if (!this._nameToPanels.has(name))
//         {
//             let panel = this.GetPanelForName(name);
//             if (!panel)
//             {
//                 warn(`${name} 没有相对应的panel实例`)
//                 return;
//             }

//             let ui = UIUtils.GetUIPanel(name);

//             panel.Init(ui, UIManager_Back.GetInstance());
//             this._nameToPanels.set(name, panel);
//             this._nameToUI.set(name, ui)
//         }

//         let panel = this._nameToPanels.get(name)!;
//         let ui = this._nameToUI.get(name);

//         ui!.DisplayOrder = this._displayOrder++;
//         panel.Show();
//     }

//     public Hide(name: UIPanelName)
//     {
//         let panel = this._nameToPanels.get(name);
//         if (!panel)
//         {
//             warn(`${name} 没有可以关闭的实例`)
//             return;
//         }

//         panel.Hide();
//     }

//     public GetPanelForName(name: UIPanelName)
//     {
//         switch (name)
//         {
//             case "MainPanel":
//                 return new MainPanel();
//             case "WeaponPanel":
//                 return new WeaponPanel();
//         }
//         return undefined;
//     }
// }

// abstract class BasePanel
// {
//     public abstract Init(ui: ScreenGui, manager: any): void
//     public abstract Show(): void
//     public abstract Hide(): void
// }

// class MainPanel extends BasePanel
// {
//     private _uiManager: any;
//     private _text?: TextLabel;
//     private _ui?: ScreenGui;
//     private _weaponsButton?: TextButton
//     private _textGold?: TextLabel

//     private connection?: Connection;

//     public Init(ui: ScreenGui, manager: any): void
//     {
//         this._uiManager = manager
//         this._text = ui.WaitForChild("AttackValue").WaitForChild("Text") as TextLabel;
//         this._ui = ui;
//         this._weaponsButton = ui.WaitForChild("Weapons") as TextButton;
//         this._textGold = ui.WaitForChild("Gold") as TextLabel

//         this.InitSub()
//         this.InitEvent();
//     }

//     public Show(): void
//     {
//         this.OnShow();
//         this._ui!.Enabled = true;
//     }
//     public Hide(): void
//     {
//         this._ui!.Enabled = false;
//         this.OnHide();
//     }

//     private OnShow()
//     {
//         let playerDataService = KnitClient.GetService("PlayerDataService");

//         this._text!.Text = NumberFormatter.Format(playerDataService.GetAttack());
//         this._textGold!.Text = NumberFormatter.Format(playerDataService.GetGold())
//     }

//     private OnHide()
//     {
//         // this.connection?.Disconnect();
//     }

//     private InitEvent()
//     {
//         this._weaponsButton?.MouseButton1Click.Connect(() =>
//         {
//             UIManager_Back.GetInstance().Show("WeaponPanel")
//         })
//     }

//     private InitSub()
//     {
//         KnitClient.GetService("PlayerDataService").OnAttackChanged.Connect(value => this._text!.Text = NumberFormatter.Format(value));
//         KnitClient.GetService("PlayerDataService").OnGoldChanged.Connect(value => this._textGold!.Text = NumberFormatter.Format(value))
//     }
// }

// class WeaponPanel extends BasePanel
// {
//     private _uiManager: any
//     private _ui?: ScreenGui;
//     private _weaponItemPrefab?: TextButton;
//     private _equipButton?: TextButton;
//     private _sellButton?: TextButton;
//     private _backButton?: TextButton;
//     private _scrollingFrame?: ScrollingFrame;
//     private _textWeaponStrength?: TextLabel

//     private _items: { id: string, item: TextButton }[] = []

//     private _selected?: string

//     public Init(ui: ScreenGui, manager: any): void
//     {
//         this._ui = ui;
//         this._weaponItemPrefab = ui.WaitForChild("Prefabs").WaitForChild("WeaponButton") as TextButton
//         this._equipButton = ui.WaitForChild("Frame").WaitForChild("Equip") as TextButton
//         this._sellButton = ui.WaitForChild("Frame").WaitForChild("Sell") as TextButton
//         this._backButton = ui.WaitForChild("Frame").WaitForChild("Back") as TextButton
//         this._scrollingFrame = ui.WaitForChild("Frame").WaitForChild("Weapons").WaitForChild("ScrollingFrame") as ScrollingFrame
//         this._textWeaponStrength = ui.WaitForChild("Frame").WaitForChild("Information").WaitForChild("Strength") as TextLabel

//         this.RefreshUI()
//         this.InitInputEvent()
//         this.InitSub()
//     }

//     public Show(): void
//     {
//         this._ui!.Enabled = true;
//     }
//     public Hide(): void
//     {
//         this._ui!.Enabled = false;
//     }

//     private InitInputEvent()
//     {
//         //关闭页面
//         this._backButton?.MouseButton1Click.Connect(() =>
//         {
//             UIManager_Back.GetInstance().Hide("WeaponPanel")
//         })
//         //出售武器
//         this._sellButton?.MouseButton1Click.Connect(() =>
//         {
//             if (!this._selected)
//             {
//                 return;
//             }

//             KnitClient.GetService("WeaponService").SellWeapon.Fire(this._selected)
//             this._selected = undefined
//             this.RefreshInformation()
//         })
//         //装备武器
//         this._equipButton?.MouseButton1Click.Connect(() =>
//         {
//             if (!this._selected)
//             {
//                 return;
//             }
//             KnitClient.GetService("WeaponService").EquipWeapon.Fire(this._selected)
//         })
//     }

//     private RefreshUI()
//     {
//         print("refresh weapon ui")

//         let weapons = KnitClient.GetService("WeaponService").GetAllWeapon();
//         for (let i = 0; i < weapons.size(); i++)
//         {
//             this.AddWeaponItem(weapons[i])
//         }

//         this.RefreshInformation()
//     }

//     private RefreshInformation()
//     {
//         if (!this._selected)
//         {
//             this._textWeaponStrength!.Text = "没有选择武器"
//             return
//         }

//         let strength = WeaponConfigCollection.GetConfigById(this._selected).strength
//         this._textWeaponStrength!.Text = tostring(strength)
//     }

//     private InitSub()
//     {
//         //武器数量发生变化
//         KnitClient.GetService("WeaponService").WeaponsChanged.Connect(info =>
//         {
//             print("增加武器信号")
//             if (info.mode === "Add")
//             {
//                 this.AddWeaponItem(info.id)
//                 return;
//             }
//             if (info.mode === "Remove")
//             {
//                 this.RemoveWeaponItem(info.id)
//                 return;
//             }
//         })

//         //更换装备武器
//         KnitClient.GetService("WeaponService").EquipWeapon.Connect(weaponId =>
//         {

//         })
//     }

//     private RemoveSubscribe()
//     {
//         // this._connections.forEach(ele => ele.Disconnect)
//     }

//     private AddWeaponItem(id: string)
//     {
//         print("add weapon")

//         let config = WeaponConfigCollection.GetConfigById(id)
//         let button = this._weaponItemPrefab!.Clone()!

//         button.Visible = true
//         button.Text = config.name
//         button.Parent = this._scrollingFrame

//         button.MouseButton1Click.Connect(() =>
//         {
//             this._selected = id
//             this.RefreshInformation()
//         })

//         this._items.push({ id, item: button })
//     }
//     private RemoveWeaponItem(id: string)
//     {
//         print("remove weapon")

//         let index = this._items.findIndex(ele => ele.id === id);
//         if (index !== -1)
//         {
//             this._items[index].item.Destroy()
//             this._items.remove(index)
//         }
//     }
// }

// class LoadingPanel extends BasePanel
// {
//     public Init(ui: ScreenGui, manager: any): void
//     {

//     }

//     public Show(): void
//     {

//     }

//     public Hide(): void
//     {

//     }
// }