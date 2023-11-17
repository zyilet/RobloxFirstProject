import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { DataStoreService, Players } from "@rbxts/services";
import { GameDataManager } from "server/game/DataStore/GameDataManager";

class PlayerData
{
    Attack: number = 0;
    Gold: number = 0;
}

declare global
{
    interface KnitServices
    {
        PlayerDataService: typeof PlayerDataService;
    }
}

const PlayerDataService = Knit.CreateService(
    {
        Name: "PlayerDataService",
        PlayersData: new Map<number, PlayerData>(),

        Client:
        {

            OnGoldChanged: new RemoteSignal<(gold: number) => void>(),
            OnAttackChanged: new RemoteSignal<(attack: number) => void>(),

            AddAttackValue: new RemoteSignal<() => void>(),
            AddGoldValue: new RemoteSignal<() => void>(),

            GetAttack(player: Player): number
            {
                return GameDataManager.GetInstance().GetPlayerDataAccessor(player).GetAttack()
            },
            GetGold(player: Player): number
            {
                return GameDataManager.GetInstance().GetPlayerDataAccessor(player).GetGold()
            },

            ClearData(player: Player)
            {
                GameDataManager.GetInstance().GetPlayerDataAccessor(player).ResetData()
            }
        },

        KnitInit()
        {
            //玩家进入游戏，加载数据
            Players.PlayerAdded.Connect((player) => this.OnPlayerEntryGame(player))
            //玩家离开游戏，保存数据
            Players.PlayerRemoving.Connect((player) => this.OnPlayerMovingGame(player))

            this.Client.AddAttackValue.Connect(player =>
            {
                let accessor = GameDataManager.GetInstance().GetPlayerDataAccessor(player)
                let curWeapon = accessor.GetCurEquipWeapon()
                let curAttackValue = accessor.GetAttack()
                let newAttackValue = curAttackValue + (curWeapon ? curWeapon.Strength : 1);

                accessor.SetAttack(newAttackValue)

                this.Client.OnAttackChanged.Fire(player, newAttackValue)
            })
        },

        KnitStart()
        {

        },

        GetAttack(player: Player)
        {
            return this.PlayersData.get(player.UserId)!.Attack;
        },

        OnPlayerEntryGame(player: Player)
        {
            //获取玩家的存储对象
            let playerDataStore = DataStoreService.GetDataStore(tostring(player.UserId))
            let [success, value] = pcall(() =>
            {
                return playerDataStore.GetAsync("PlayerData")
            })
            if (success)
            {
                let data = value as PlayerData;
                print(data)
                if (!data)
                {
                    print("第一次初始化数据")
                    data = new PlayerData();
                }
                print(data)
                this.PlayersData.set(player.UserId, data);
            }
        },
        OnPlayerMovingGame(player: Player)
        {
            let playerDataStore = DataStoreService.GetDataStore(tostring(player.UserId))
            let data = this.PlayersData.get(player.UserId) ?? new PlayerData();

            let [success, value] = pcall(() =>
            {
                return playerDataStore.SetAsync("PlayerData", data)
            })

            if (success)
            {
                this.PlayersData.delete(player.UserId)
            }
        }
    }
);

export = PlayerDataService;