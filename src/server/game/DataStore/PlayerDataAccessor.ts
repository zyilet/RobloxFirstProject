import { HttpService } from "@rbxts/services";
import { PlayerData, PlayerWeaponData } from "./PlayerData";

export class PlayerDataAccessor
{

    private _store: DataStore;
    private _storeKey: string;
    private _data: PlayerData;
    private _player: Player;

    public Data: PlayerData

    constructor(player: Player, data: PlayerData, dataStore: DataStore)
    {
        this._data = data;
        this._store = dataStore;
        this._player = player;
        this._storeKey = `player_data_${this._data.UserId}`

        this.Data = this._data
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
    public RemoveGold(value: number)
    {
        let result = this.GetGold() - value
        this._data.Gold = math.max(0, result)
    }
    // #endregion

    // #region 武器相关接口
    public GetCurEquipWeapon()
    {
        return this._data.EquippedWeapon
    }
    public GetAllWeapon()
    {
        return this._data.Weapons;
    }

    public GetWeaponLimit()
    {
        return this._data.weaponLimit
    }

    public EquipWeapon(guid: string)
    {
        this._data.EquippedWeapon.push(guid)
    }
    public UnequipWeapon(guid: string)
    {
        let index = this._data.EquippedWeapon.findIndex(equipped => equipped === guid)
        this._data.EquippedWeapon.remove(index)
    }
    public AddWeapon(weaponId: string)
    {
        let weapon = new PlayerWeaponData(HttpService.GenerateGUID(), weaponId)
        this._data.Weapons.push(weapon)
        return weapon
    }
    public RemoveWeapon(guid: string)
    {
        this._data.Weapons = this._data.Weapons.filter(weapon => weapon.Guid !== guid)
        // for (let i = this._data.Weapons.size() - 1; i >= 0; i--)
        // {
        //     let weapon = this._data.Weapons[i]
        //     if (weapon.Guid === guid)
        //     {
        //         this._data.Weapons.remove(i);
        //         return
        //     }
        // }
    }
    // #endregion

    // #region 宠物相关接口
    public GetAllPets()
    {
        return this._data.Pets
    }
    public EquipPet(guid: string)
    {
        this._data.EquippedPets.push(guid)
    }
    public UnEquipPet(guid: string)
    {
        this._data.EquippedPets = this._data.EquippedPets.filter(petGuid => petGuid !== guid)
    }
    public RemovePet(guid: string)
    {

        this._data.Pets = this._data.Pets.filter(pet => pet.Guid !== guid)
        // for (let i = this._data.Pets.size() - 1; i >= 0; i--)
        // {
        //     let pet = this._data.Pets[i]
        //     if (pet.Guid === guid)
        //     {
        //         this._data.Weapons.remove(i);
        //         return
        //     }
        // }
    }
    // #endregion
}