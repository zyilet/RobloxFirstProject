import { PlayerData } from "./PlayerData";

export class PlayerDataAccessor
{

    private _store: DataStore;
    private _storeKey: string;
    private _data: PlayerData;
    private _player: Player;

    constructor(player: Player, data: PlayerData, dataStore: DataStore)
    {
        this._data = data;
        this._store = dataStore;
        this._player = player;
        this._storeKey = `player_data_${this._data.UserId}`
    }

    public SaveAsync()
    {
        let [success, errorMessage] = pcall(() =>
        {
            this._store.SetAsync(this._storeKey, this._data);
        })
        if (!success)
        {
            error("保存玩家数据失败。 错误信息：" + errorMessage)
        }
    }

    public ResetData()
    {
        let [success, errorMessage] = pcall(() =>
        {
            this._store.SetAsync(this._storeKey, new PlayerData(this._player))
        })
        if (!success)
        {
            error("重置玩家数据时出现异常")
        }
    }

    // #region 攻击力和金币相关接口
    public GetAttack()
    {
        return this._data.Attack;
    }
    public SetAttack(value: number)
    {
        this._data.Attack = value;
    }
    public AddAttack(value: number)
    {
        this._data.Attack += value;
    }
    public GetGold()
    {
        return this._data.Gold;
    }
    public SetGold(value: number)
    {
        this._data.Gold = value;
    }
    public AddGold(value: number)
    {
        this._data.Gold += value;
    }
    // #endregion

    // #region 武器相关接口
    public GetCurEquipWeaponId()
    {
        return this._data.EquipWeaponId
    }
    public GetAllWeapon()
    {
        return this._data.Weapons;
    }
    public EquipWeapon(id: string | undefined)
    {
        this._data.EquipWeaponId = id;
    }
    public AddWeapon(weaponId: string)
    {
        this._data.Weapons.push(weaponId);
    }
    public RemoveWeapon(id: string)
    {
        for (let i = this._data.Weapons.size() - 1; i >= 0; i--)
        {
            let weaponId = this._data.Weapons[i]
            if (weaponId === id)
            {
                this._data.Weapons.remove(i);
                return
            }
        }
    }
    // #endregion

    // #region 宠物相关接口
    public GetAllPets()
    {
        return this._data.Pets
    }
    public EquipPet(id: string)
    {
        this._data.EquipPets.push(id)
    }
    public RemovePet(id: string)
    {
        for (let i = this._data.Pets.size() - 1; i >= 0; i--)
        {
            let petId = this._data.Pets[i]
            if (petId === id)
            {
                this._data.Weapons.remove(i);
                return
            }
        }
    }
    // #endregion
}