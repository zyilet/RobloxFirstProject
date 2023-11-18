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

    /**
     * @description: 向背包中添加武器
     * @return {*}
     */
    public AddWeapon(weaponId: string)
    {
        this._data.Weapons.push(weaponId);
    }
    /**
     * @description: 从背包中移除武器
     * @return {*}
     */
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
}