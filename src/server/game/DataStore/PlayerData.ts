
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
    //玩家ID
    public UserId: number
    //玩家攻击力
    public Attack: number
    //玩家金币
    public Gold: number
    //武器上限
    public weaponLimit: number
    //可装备武器上限
    public equipWeaponLimit: number
    //宠物上限
    public petLimit: number
    //可装备宠物上限
    public equipPetLimit: number
    //玩家拥有的武器
    public Weapons: PlayerWeaponData[]
    //玩家装备的武器
    public EquippedWeapon: string[]
    //玩家拥有的宠物
    public Pets: PlayerPetData[]
    //玩家装备的宠物
    public EquippedPets: string[]

    constructor(player: Player)
    {
        this.UserId = player.UserId;
        this.Attack = 0;
        this.Gold = 0;
        this.weaponLimit = 50
        this.equipWeaponLimit = 1
        this.petLimit = 10
        this.equipPetLimit = 1
        this.Weapons = []
        this.EquippedWeapon = []
        this.Pets = []
        this.EquippedPets = []
    }
}