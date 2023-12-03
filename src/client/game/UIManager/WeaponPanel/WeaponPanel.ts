import { Players } from "@rbxts/services";
import { UIPanel } from "../UIPanel";
import { WeaponPanelGui } from "./WeaponPanelGui";
import { UIMainPanel } from "../UIPanels/UIMainPanel";
import { UIManager } from "../UIManager";
import { Disposable, DisposablePack } from "../UIEvent";
import { DataManager } from "client/game/DataManager/DataManager";
import { MessageManager } from "client/game/MessageManager/MessageManager";
import { Messages } from "client/game/MessageManager/MessageDefine";
import { PlayerWeaponData } from "client/game/DataManager/WeaponDataManager";
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";
import { WeaponItemButton } from "./WeaponItemButton";
import { KnitClient } from "@rbxts/knit";

export class WeaponPanel extends UIPanel
{
    private uiObj: WeaponPanelGui

    private disposablePack = new DisposablePack()
    private messageKey: string[] = []


    constructor()
    {
        super()

        this.uiObj = new WeaponPanelGui(DataManager.GetInstance().GetAllWeapons().map(ele => ele.Guid))
    }

    public OnShow(depth: number, ...params: unknown[]): void
    {
        this.uiObj.SetDisplayOrder(depth)
        this.uiObj.ShowAnim()
        this.uiObj.SetParent(Players.LocalPlayer.WaitForChild("PlayerGui"))

        this.InitMessage()
    }
    public OnClose(): void
    {
        this.uiObj.Destroy()

        this.messageKey.forEach(key => MessageManager.GetInstance().UnSubscribe(key))
    }
    public BindEvent(): void
    {
        this.uiObj.OnCloseClick
            .SubScribe(() => UIManager.GetInstance().Close(WeaponPanel))
            .AddTo(this.disposablePack)
        this.uiObj.OnWeaponItemClick
            .Subscribe(data => this.uiObj.SelectedWeapon(data.Guid))
            .AddTo(this.disposablePack)
        this.uiObj.OnEquipBestClick
            .SubScribe(() =>
            {
                let guid = DataManager.GetInstance().GetBestWeapon()
                if (guid)
                {
                    KnitClient.GetService("WeaponService").EquipWeaponMethod(guid)
                }
            })
            .AddTo(this.disposablePack)
    }

    public UnBindEvent(): void
    {
        this.disposablePack.Disposable()
    }

    private InitMessage()
    {
        let mid1 = MessageManager.GetInstance().Subscribe(Messages.AddWeapon, data =>
        {
            let weapon = data as PlayerWeaponData
            this.uiObj.AddWeaponItem(weapon.Guid)
        })

        let mid2 = MessageManager.GetInstance().Subscribe(Messages.RemoveWeapon, data =>
        {
            let weapon = data as PlayerWeaponData
            this.uiObj.RemoveWeaponItem(weapon.Guid)
        })

        let mid3 = MessageManager.GetInstance().Subscribe(Messages.EquipWeapon, data =>
        {
            let guid = data as string
            this.uiObj.EquipWeapon(guid)
        })

        this.messageKey.push(mid1)
        this.messageKey.push(mid2)
        this.messageKey.push(mid3)
    }
}