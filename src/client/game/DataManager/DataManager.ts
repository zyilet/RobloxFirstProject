import { KnitClient } from "@rbxts/knit"
import { WeaponDataManager } from "./WeaponDataManager"
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig"

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

    public GetWeapon(guid: string)
    {
        let result = this.weaponManger!.GetAllWeapons().find(ele => ele.Guid === guid)
        if (result === undefined) error(`找不到guid为【${guid}】的武器`)
        return result
    }

    public GetBestWeapon()
    {
        let weapons = this.weaponManger?.GetAllWeapons()
        if (weapons === undefined || weapons.size() <= 0)
        {
            return undefined
        }

        let result = weapons[0]

        weapons.forEach(weapon =>
        {
            let targetConfig = WeaponConfigCollection.GetConfigById(result.Id)
            let curConfig = WeaponConfigCollection.GetConfigById(weapon.Id)
            if (curConfig.Strength > targetConfig.Strength)
            {
                result = weapon
            }
        })

        return result.Guid
    }

    public GetEquippedWeapon()
    {
        return this.weaponManger!.GetEquippedWeapon()
    }
}