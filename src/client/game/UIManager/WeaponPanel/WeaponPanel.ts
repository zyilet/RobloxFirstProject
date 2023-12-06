import { Players } from "@rbxts/services";
import { UIPanel } from "../UIPanel";
import { WeaponPanelGui, WeaponPanelState } from "./WeaponPanelGui";
import { UIMainPanel } from "../UIPanels/UIMainPanel";
import { UIManager } from "../UIManager";
import { Disposable, DisposablePack } from "../UIEvent";
import { DataManager } from "client/game/DataManager/DataManager";
import { MessageManager } from "client/game/MessageManager/MessageManager";
import { Messages } from "client/game/MessageManager/MessageDefine";
import { PlayerWeaponData } from "client/game/DataManager/WeaponDataManager";
import { KnitClient } from "@rbxts/knit";

export class WeaponPanel extends UIPanel
{
    private uiObj: WeaponPanelGui

    private disposablePack = new DisposablePack()
    private messageKey: string[] = []
    private selectedWeapons: string[] = []
    private curPanelState: WeaponPanelState = "normal"

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
        //点击关闭按钮
        this.uiObj.OnCloseClick
            .SubScribe(() => UIManager.GetInstance().Close(WeaponPanel))
            .AddTo(this.disposablePack)
        //点击武器
        this.uiObj.OnWeaponItemClick
            .Subscribe(data =>
            {
                this.uiObj.SelectedWeapon(data.Guid)

                if (this.curPanelState === "normal")
                {
                    this.selectedWeapons.clear()
                    this.selectedWeapons.push(data.Guid)
                    return
                }

                if (this.curPanelState === "multi sell")
                {
                    let index = this.selectedWeapons.findIndex(ele => ele === data.Guid)
                    if (index !== -1)
                    {
                        this.selectedWeapons.remove(index)
                        return
                    }
                    this.selectedWeapons.push(data.Guid)
                    return
                }
            })
            .AddTo(this.disposablePack)
        //装备最好的武器或者全选
        this.uiObj.OnEquipBestClick
            .SubScribe(() => this.curPanelState === "normal" ? this.EquipBest() : this.SelectAll())
            .AddTo(this.disposablePack)
        //取消装备所有武器
        this.uiObj.OnUnequipAllClick
            .SubScribe(() => this.curPanelState === "normal" ? this.UnequipAll() : this.ChangeStateToNormal())
            .AddTo(this.disposablePack)
        //点击多选出售
        this.uiObj.OnMultiSellClick
            .SubScribe(() => this.curPanelState === "normal" ? this.ChangeStateToMultiSell() : this.Sell())
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
            this.uiObj.EquipWeapon(data as string[])
        })

        this.messageKey.push(mid1)
        this.messageKey.push(mid2)
        this.messageKey.push(mid3)
    }

    //装备最好的武器
    private EquipBest()
    {
        let guid = DataManager.GetInstance().GetBestWeapon()
        if (guid)
        {
            KnitClient.GetService("WeaponService").EquipWeaponMethod(guid)
        }
    }

    //选择所有武器
    private SelectAll()
    {
        this.selectedWeapons = this.uiObj.SelectAllWeapon()
    }

    //取消装备所有武器
    private UnequipAll()
    {
        DataManager.GetInstance().GetEquippedWeapon().forEach(guid =>
        {
            KnitClient.GetService("WeaponService").UnequipWeaponMethod(guid)
        })
    }

    //转换状态到普通模式
    private ChangeStateToNormal()
    {
        this.selectedWeapons.clear()
        this.curPanelState = "normal"
        this.uiObj.SetPanelState("normal")
    }

    //转换状态到多选出售模式
    private ChangeStateToMultiSell()
    {
        this.selectedWeapons.clear()
        this.curPanelState = "multi sell"
        this.uiObj.SetPanelState("multi sell")
    }

    //出售所选武器
    private Sell()
    {
        this.selectedWeapons.forEach(guid =>
        {
            KnitClient.GetService("WeaponService").SellWeaponMethod(guid)
        })
        this.selectedWeapons.clear()
    }
}