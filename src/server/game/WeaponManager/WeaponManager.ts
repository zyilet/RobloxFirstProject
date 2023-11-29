export class WeaponManger
{
    private static instance: WeaponManger
    public static GetInstance()
    {
        return this.instance ??= new WeaponManger()
    }


    
}