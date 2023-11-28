import { KnitClient } from "@rbxts/knit"

export class WeaponDataManager
{
    private static instance: WeaponDataManager
    public static GetInstance()
    {
        return this.instance ??= new WeaponDataManager()
    }

    private allWeapons: string[] = []
    private equippedWeapon: string | undefined = undefined

    public Init()
    {
        let WeaponService = KnitClient.GetService("WeaponService")

        WeaponService.AllWeapons.Connect(data =>
        {
            this.allWeapons = data.ids
        })

        WeaponService.AddWeapon.Connect(data =>
        {
            this.allWeapons.push(data.id)
        })

        WeaponService.RemoveWeapon.Connect(data =>
        {
            for (let i = this.allWeapons.size() - 1; i >= 0; i--)
            {
                if (this.allWeapons[i] === data.id)
                {
                    this.allWeapons.remove(i)
                }
            }
        })

        WeaponService.EquippedWeapon.Connect(data =>
        {
            this.equippedWeapon = data.id
        })
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