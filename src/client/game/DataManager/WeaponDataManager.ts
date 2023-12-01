import { KnitClient } from "@rbxts/knit"
import { MessageManager } from "../MessageManager/MessageManager"
import { Messages } from "../MessageManager/MessageDefine"

export type PlayerWeaponData = {
    Guid: string,
    Id: string
}

export class WeaponDataManager
{
    private static instance: WeaponDataManager
    public static GetInstance()
    {
        return this.instance ??= new WeaponDataManager()
    }

    private allWeapons: PlayerWeaponData[] = []
    private equippedWeapon: string | undefined = undefined

    public Init()
    {
        let WeaponService = KnitClient.GetService("WeaponService")

        WeaponService.AllWeapons.Connect(data =>
        {
            this.allWeapons = data
        })

        WeaponService.AddWeapon.Connect(data =>
        {
            this.allWeapons.push(data)

            MessageManager.GetInstance().Publish(Messages.AddWeapon, data)
        })

        WeaponService.RemoveWeapon.Connect(data =>
        {
            this.allWeapons = this.allWeapons.filter(weapon => weapon.Guid !== data.Guid)

            MessageManager.GetInstance().Publish(Messages.RemoveWeapon, data)
        })

        WeaponService.EquippedWeapon.Connect(data =>
        {
            this.equippedWeapon = data

            MessageManager.GetInstance().Publish(Messages.EquipWeapon, data)
        })
        return this
    }

    public Update(dt: number)
    {

    }

    public GetAllWeapons()
    {
        return this.allWeapons
    }

    public GetEquippedWeapon()
    {
        return this.equippedWeapon
    }
}