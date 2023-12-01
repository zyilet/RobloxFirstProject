
export class PlayerWeaponData
{
    public Guid: string
    public Id: string

    constructor(guid: string, id: string)
    {
        this.Guid = guid
        this.Id = id
    }
}

export class PlayerPetData
{
    public Guid: string
    public Id: string

    constructor(guid: string, id: string)
    {
        this.Guid = guid
        this.Id = id
    }
}

export class PlayerData
{
    public UserId: number
    public Attack: number
    public Gold: number
    public Weapons: PlayerWeaponData[]
    public EquippedWeapon: string | undefined;
    public Pets: PlayerPetData[]
    public EquipPets: string[]

    constructor(player: Player)
    {
        this.UserId = player.UserId;
        this.Attack = 0;
        this.Gold = 0;
        this.Weapons = []
        this.EquippedWeapon = undefined;
        this.Pets = []
        this.EquipPets = []
    }
}