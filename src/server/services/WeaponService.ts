import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { GameDataManager } from "server/game/DataStore/GameDataManager";
import { WeaponData } from "server/game/DataStore/WeaponData";

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
        //订阅
        EquipWeaponChanged: new RemoteSignal<(id: string) => void>(),
        WeaponsChanged: new RemoteSignal<(weapons: WeaponData) => void>(),
        //发布
        EquipWeapon: new RemoteSignal<(weaponId: string) => void>(),
        SellWeapon: new RemoteSignal<(ids: string[]) => void>(),
        //调用
        GetCurWeapon(player: Player)
        {
            return this.Server.GetCurWeapon(player);
        },
        GetAllWeapon(player: Player)
        {
            return this.Server.GetAllWeapon(player);
        }
    },

    KnitInit()
    {

    },

    KnitStart()
    {
        this.Client.EquipWeapon.Connect((player, weaponId) =>
        {
            // this.EquipWeapon(player, weaponId);
        })
    },

    //获取当前武器
    GetCurWeapon(player: Player)
    {
        return GameDataManager.GetInstance().GetPlayerDataAccessor(player).GetCurEquipWeapon();
    },
    //获取所有武器
    GetAllWeapon(player: Player)
    {
        return GameDataManager.GetInstance().GetPlayerDataAccessor(player).GetAllWeapon();
    },

    //向玩家添加武器
    AddWeapon(player: Player, weapon: WeaponData)
    {
        GameDataManager.GetInstance().GetPlayerDataAccessor(player).AddWeapon(weapon);
    },

    //装备指定id的武器
    EquipWeapon(player: Player, id: string)
    {
        let accessor = GameDataManager.GetInstance().GetPlayerDataAccessor(player);
        let haveWeapons = accessor.GetAllWeapon();
        //检查玩家背包是否存在这个武器
        if (!haveWeapons.find(ele => ele.WeaponId === id))
        {
            return;
        }
        accessor.EquipWeapon(id);
        this.Client.EquipWeaponChanged.Fire(player, id);
    },

    GenerateWeapon()
    {
        return new WeaponData(0, 10, "Normal", 100);
    }
});

export = WeaponService;