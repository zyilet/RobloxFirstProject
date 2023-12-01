import { KnitServer as Knit, KnitServer, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { GameDataManager } from "server/game/DataStore/GameDataManager";
import { PlayerWeaponData } from "server/game/DataStore/PlayerData";
import { PlayerDataManager } from "server/game/PlayerDataManager/PlayerDataManager";
import { WeaponManger } from "server/game/WeaponManager/WeaponManager";
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";

declare global
{
    interface KnitServices
    {
        WeaponService: typeof WeaponService;
    }
}

const WeaponService = Knit.CreateService({
    Name: "WeaponService",

    Client:
    {
        //当玩家第一次连接服务器时，推送玩家武器的总量
        AllWeapons: new RemoteSignal<(weapons: PlayerWeaponData[]) => void>(),
        //玩家武器增加
        AddWeapon: new RemoteSignal<(weapon: PlayerWeaponData) => void>(),
        //玩家武器移除
        RemoveWeapon: new RemoteSignal<(weapon: PlayerWeaponData) => void>(),
        //玩家装备的武器
        EquippedWeapon: new RemoteSignal<(guid: string | undefined) => void>(),

        EquipWeapon: new RemoteSignal<(guid: string) => void>(),
        UnEquipWeapon: new RemoteSignal<() => void>(),
        SellWeapon: new RemoteSignal<(guid: string) => void>(),
    },

    KnitInit()
    {

    },

    KnitStart()
    {
        Players.PlayerAdded.Connect(p =>
        {
            let wa = WeaponManger.GetInstance().CreateAccessor(p)
            this.Client.AllWeapons.Fire(p, wa.GetAllWeapon())
            this.Client.EquippedWeapon.Fire(p, wa.GetEquippedWeapon())
        })

        this.Client.EquipWeapon.Connect((p, guid) =>
        {
            let wa = WeaponManger.GetInstance().CreateAccessor(p)

            wa.EquipWeapon(guid)
            this.Client.EquippedWeapon.Fire(p, wa.GetEquippedWeapon())
        })

        this.Client.UnEquipWeapon.Connect(p =>
        {
            let wa = WeaponManger.GetInstance().CreateAccessor(p)

            wa.UnEquipWeapon()
            this.Client.EquippedWeapon.Fire(p, undefined)
        })

        this.Client.SellWeapon.Connect((p, guid) =>
        {
            let wa = WeaponManger.GetInstance().CreateAccessor(p)
            let pa = PlayerDataManager.GetInstance().CreateAccessor(p)

            let price = WeaponConfigCollection.GetConfigById(wa.GetWeapon(guid).Id).price
            wa.RemoveWeapon(guid)
            pa.AddGold(price)
        })
    },

    AddWeapon(player: Player, weaponId: string)
    {
        let wa = WeaponManger.GetInstance().CreateAccessor(player)

        let weapon = wa.AddWeapon(weaponId)
        this.Client.AddWeapon.Fire(player, weapon)
    }
});

export = WeaponService;