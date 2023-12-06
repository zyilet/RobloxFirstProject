import { PlayerWeaponData } from "client/game/DataManager/WeaponDataManager";
import { UIPanel } from "../UIPanel";
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";
import { UIManager } from "../UIManager";
import { KnitClient } from "@rbxts/knit";

export class UIWeaponInfoPanel extends UIPanel
{

    public static Name = "UIWeaponInfoPanel"

    private ui?: ScreenGui
    private textAtk?: TextLabel
    private textPrice?: TextLabel
    private btnCancel?: TextButton;
    private btnEquip?: TextButton
    private btnSell?: TextButton
    private weaponData?: PlayerWeaponData

    private unBindActions: { (): void }[] = []

    public OnShow(depth: number, ...params: unknown[]): void
    {
        this.ui = UIPanel.LoadUIPanel(UIWeaponInfoPanel.Name)
        this.ui.DisplayOrder = depth

        let elements = this.ui.GetDescendants()
        this.textAtk = elements.find(ele => ele.Name === "TextAtk") as TextLabel
        this.textPrice = elements.find(ele => ele.Name === "TextPrice") as TextLabel
        this.btnCancel = elements.find(ele => ele.Name === "BtnCancel") as TextButton
        this.btnEquip = elements.find(ele => ele.Name === "BtnEquip") as TextButton
        this.btnSell = elements.find(ele => ele.Name === "BtnSell") as TextButton
        this.weaponData = params[0] as PlayerWeaponData

        this.RenderUI()
    }
    public OnClose(): void
    {
        this.ui?.Destroy()
    }
    public BindEvent(): void
    {
        let c1 = this.btnCancel?.MouseButton1Click.Connect(() =>
        {
            UIManager.GetInstance().Close(UIWeaponInfoPanel)
        })
        let c2 = this.btnEquip?.MouseButton1Click.Connect(() =>
        {
            KnitClient.GetService("WeaponService").EquipWeaponMethod(this.weaponData!.Guid)
            UIManager.GetInstance().Close(UIWeaponInfoPanel)
        })

        let c3 = this.btnSell?.MouseButton1Click.Connect(() =>
        {
            KnitClient.GetService("WeaponService").SellWeaponMethod(this.weaponData!.Guid)
            UIManager.GetInstance().Close(UIWeaponInfoPanel)
        })

        this.unBindActions.push(() =>
        {
            c1?.Disconnect()
            c2?.Disconnect()
            c3?.Disconnect()
        })
    }
    public UnBindEvent(): void
    {
        this.unBindActions.forEach(a => a())
    }

    private RenderUI()
    {
        let weaponConfig = WeaponConfigCollection.GetConfigById(this.weaponData!.Id)
        this.textAtk!.Text = tostring(weaponConfig.Strength)
        this.textPrice!.Text = tostring(weaponConfig.Price)
    }


    // private static _staticInit = (() =>
    // {
    //     this.ui = UIPanel.LoadUIPanel(this.Name)
    //     this.ui.Enabled = false
    //     this.isInited = true
    // })()



}