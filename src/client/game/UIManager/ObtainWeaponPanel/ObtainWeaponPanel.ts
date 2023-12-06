import { PlayerWeaponData } from "client/game/DataManager/WeaponDataManager";
import { ObtainWeaponPanelGui } from "./ObtainWeaponPanelGui";

export class ObtainWeaponPanel
{
    private uiObj: ObtainWeaponPanelGui

    public ShowTime: number = 0

    constructor(weaponData: PlayerWeaponData)
    {
        this.uiObj = new ObtainWeaponPanelGui(weaponData)
    }

    public Update(dt: number)
    {
        this.ShowTime += dt
    }

    public async Show()
    {
        this.uiObj.Show()
    }

    public async Hide()
    {
        this.uiObj.Hide()
    }

    public Destroy()
    {
        this.uiObj.Destroy()
    }
}