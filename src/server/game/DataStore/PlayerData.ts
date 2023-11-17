import { WeaponData } from "./WeaponData";

export class PlayerData
{
    public UserId: number
    public Attack: number
    public Gold: number
    public Weapons: WeaponData[]
    public EquipWeaponId: string | undefined;

    constructor(player: Player)
    {
        this.UserId = player.UserId;
        this.Attack = 0;
        this.Gold = 0;
        this.Weapons = []
        this.EquipWeaponId = undefined;
    }
}