import { Players, UserInputService } from "@rbxts/services"
import { DisposablePack } from "../UIEvent"
import { UIPanel } from "../UIPanel"
import { WeaponInfoPanelGui } from "./WeaponInfoPanelGui"
import { UIManager } from "../UIManager"
import { DataManager } from "client/game/DataManager/DataManager"
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig"
import { KnitClient } from "@rbxts/knit"

export class WeaponInfoPanel extends UIPanel
{
    private uiObj: WeaponInfoPanelGui

    private disposablePack = new DisposablePack()
    private guid: string = ""

    constructor()
    {
        super()
        this.uiObj = new WeaponInfoPanelGui()
    }

    public OnShow(depth: number, ...params: unknown[]): void
    {
        let pos = UserInputService.GetMouseLocation()

        this.uiObj.SetPosition(new UDim2(0, pos.X, 0, pos.Y))
        this.uiObj.SetParent(Players.LocalPlayer.WaitForChild("PlayerGui"))
        this.uiObj.SetDepth(depth)
        this.uiObj.ShowAnim()

        this.guid = params[0] as string
        this.Init(this.guid)
    }
    public OnClose(): void | unknown[]
    {
        this.uiObj.Destroy()
    }
    public BindEvent(): void
    {
        this.uiObj.OnBtnCloseClick.SubScribe(() =>
        {
            UIManager.GetInstance().Close(WeaponInfoPanel)
        }).AddTo(this.disposablePack)

        this.uiObj.OnBtnCancelClick.SubScribe(() =>
        {
            UIManager.GetInstance().Close(WeaponInfoPanel)
        }).AddTo(this.disposablePack)

        this.uiObj.OnBtnEquipClick.SubScribe(() =>
        {
            KnitClient.GetService("WeaponService").EquipWeaponMethod(this.guid)
            UIManager.GetInstance().Close(WeaponInfoPanel)
        })

        this.uiObj.OnBtnUnEquipClick.SubScribe(() =>
        {
            KnitClient.GetService("WeaponService").UnequipWeaponMethod(this.guid)
            UIManager.GetInstance().Close(WeaponInfoPanel)
        })

        this.uiObj.OnBtnSellClick.SubScribe(() =>
        {
            KnitClient.GetService("WeaponService").SellWeaponMethod(this.guid)
            UIManager.GetInstance().Close(WeaponInfoPanel)
        })

        this.uiObj.OnBtnEquipClick
    }
    public UnBindEvent(): void
    {
        this.disposablePack.Dispose()
    }

    public Init(guid: string)
    {
        let weaponData = DataManager.GetInstance().GetWeapon(guid)
        let weaponConfig = WeaponConfigCollection.GetConfigById(weaponData.Id)
        let isEquipped = DataManager.GetInstance().GetEquippedWeapon().find(ele => ele === guid)

        this.uiObj.SetName(weaponConfig.Name)
        this.uiObj.SetAttack(weaponConfig.Strength)
        this.uiObj.SetEquipBtnState(isEquipped ? "equip" : "unequip")
    }
}