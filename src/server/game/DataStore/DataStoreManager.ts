import { DataStoreService } from "@rbxts/services";
import { PlayerData } from "./PlayerData";

export class DataStoreManager
{
    private static _instance: DataStoreManager;
    public static GetInstance()
    {
        return this._instance ??= new DataStoreManager();
    }

    private playerDataStores = new Map<string, DataStore>();
    private playerData = new Map<string, PlayerData>();


    public GetDataStore(player: Player)
    {
        return DataStoreService.GetDataStore(tostring(player.UserId))
    }

    public GetPlayerData(player: Player)
    {
        let userId = tostring(player.UserId)

        if (this.playerData.has(userId))
        {
            return this.playerData.get(userId)
        }

        if (!this.playerDataStores.has(userId))
        {
            this.playerDataStores.set(userId, this.GetDataStore(player))
        }
        let dataStore = this.playerDataStores.get(userId)!;

        let [success, playerData] = pcall(() =>
        {
            return dataStore.GetAsync("playerData")
        })

        if (success)
        {

            this.playerData.set(userId, (playerData as PlayerData) ?? new PlayerData(player));
            return this.playerData.get(userId);
        }

        error("获取玩家存储对象失败")
    }

    public Save(player: Player)
    {

    }

    public SaveAll()
    {

    }
}