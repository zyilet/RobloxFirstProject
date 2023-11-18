import { DataStoreService, HttpService, Players, TextChatService } from "@rbxts/services";
import { PlayerData } from "./PlayerData";
import { PlayerDataAccessor } from "./PlayerDataAccessor";

export class GameDataManager
{
    private static _instance: GameDataManager;
    public static GetInstance()
    {
        return this._instance ??= new GameDataManager();
    }

    private _playerData
    private _gameDataStore

    constructor()
    {
        this._playerData = new Array<PlayerData>();
        this._gameDataStore = DataStoreService.GetDataStore("GameData");
    }


    public GetPlayerDataAccessor(player: Player)
    {
        let data = this._playerData.find(ele => ele.UserId === player.UserId) ?? this.LoadPlayerData(player)
        return new PlayerDataAccessor(player, data, this._gameDataStore)
    }

    public Save(player: Player)
    {
        this.GetPlayerDataAccessor(player).SaveAsync();
    }

    public Reset(player: Player)
    {
        this.GetPlayerDataAccessor(player).ResetData();
    }

    public SaveAll()
    {

    }

    private LoadPlayerData(player: Player)
    {
        let key = `player_data_${player.UserId}`
        let [success, data] = pcall(() => this._gameDataStore.GetAsync(key))
        if (!success)
        {
            error("加载玩家数据时出现异常")
        }

        let playerData = data as PlayerData;
        if (!playerData)
        {
            playerData = new PlayerData(player)
            let [success, errorMessage] = pcall(() => this._gameDataStore.SetAsync(key, playerData))
            if (!success)
            {
                error("创建新玩家数据存储时出现异常")
            }
        }
        this._playerData.push(playerData);
        return playerData;
    }
}