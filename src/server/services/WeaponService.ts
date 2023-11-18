import { KnitServer as Knit, KnitServer, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { GameDataManager } from "server/game/DataStore/GameDataManager";
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
        //订阅
        EquipWeaponChanged: new RemoteSignal<(id: string) => void>(),
        WeaponsChanged: new RemoteSignal<(info: { mode: "Add" | "Remove", id: string }) => void>(),
        //发布
        EquipWeapon: new RemoteSignal<(weaponId: string) => void>(),
        SellWeapon: new RemoteSignal<(ids: string) => void>(),
        //调用
        GetCurWeapon(player: Player)
        {
            return this.Server.GetCurWeaponId(player);
        },
        GetAllWeapon(player: Player)
        {
            return this.Server.GetAllWeapon(player);
        },
        TestAddWeapon(player: Player)
        {
            this.Server.AddWeapon(player, math.random(1, 2) === 1 ? "测试武器1" : "测试武器2")
            print(this.Server.GetAllWeapon(player))
        }
    },

    KnitInit()
    {

    },

    KnitStart()
    {
        this.Client.EquipWeapon.Connect((player, weaponId) =>
        {
            this.EquipWeapon(player, weaponId);
        })
        this.Client.SellWeapon.Connect((player, weaponId) =>
        {
            this.SellWeapon(player, weaponId)
        })
    },

    //获取当前武器
    GetCurWeaponId(player: Player)
    {
        return GameDataManager.GetInstance().GetPlayerDataAccessor(player).GetCurEquipWeaponId();
    },
    //获取所有武器
    GetAllWeapon(player: Player)
    {
        return GameDataManager.GetInstance().GetPlayerDataAccessor(player).GetAllWeapon();
    },

    //向玩家添加武器
    AddWeapon(player: Player, weaponId: string)
    {
        GameDataManager.GetInstance().GetPlayerDataAccessor(player).AddWeapon(weaponId);
        this.Client.WeaponsChanged.Fire(player, { mode: "Add", id: weaponId });
    },

    //出售一把武器
    SellWeapon(player: Player, weaponId: string)
    {
        let accessor = GameDataManager.GetInstance().GetPlayerDataAccessor(player);
        let price = WeaponConfigCollection.GetConfigById(weaponId).price

        accessor.RemoveWeapon(weaponId)
        this.Client.WeaponsChanged.Fire(player, { mode: "Remove", id: weaponId })

        KnitServer.GetService("PlayerDataService").AddGold(player, price);
    },

    //装备指定id的武器
    EquipWeapon(player: Player, id: string)
    {
        let accessor = GameDataManager.GetInstance().GetPlayerDataAccessor(player);
        let haveWeapons = accessor.GetAllWeapon();
        //检查玩家背包是否存在这个武器
        if (!haveWeapons.find(ele => ele === id))
        {
            return;
        }
        accessor.EquipWeapon(id);
        this.Client.EquipWeaponChanged.Fire(player, id);
    }
});

export = WeaponService;