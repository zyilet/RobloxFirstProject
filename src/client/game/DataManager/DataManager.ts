import { KnitClient } from "@rbxts/knit"
import { WeaponDataManager } from "./WeaponDataManager"

export class DataManager
{
    private static instance: DataManager
    public static GetInstance()
    {
        return this.instance ??= new DataManager()
    }

    private weaponManger?: WeaponDataManager

    public Init()
    {
        this.weaponManger = WeaponDataManager.GetInstance().Init()

        return this
    }

    public Update(dt: number)
    {
        this.weaponManger?.Update(dt)
    }

    public GetAllWeapons()
    {
        return this.weaponManger!.GetAllWeapons()
    }

    public GetEquippedWeapon()
    {
        return this.weaponManger!.GetEquippedWeapon()
    }
}