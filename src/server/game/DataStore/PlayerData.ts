import { WeaponData } from "./WeaponData";

export class PlayerData
{
    public UserId: number
    public Attack: number
    public Gold: number
    public Weapon: WeaponData[]

    constructor(player: Player)
    {
        this.UserId = player.UserId;
        this.Attack = 0;
        this.Gold = 0;
        this.Weapon = []
    }
}