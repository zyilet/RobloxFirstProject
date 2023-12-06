import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { GameDataManager } from "server/game/DataStore/GameDataManager";
import { PlayerData } from "server/game/DataStore/PlayerData";

declare global
{
    interface KnitServices
    {
        DebugPlayerDataService: typeof DebugPlayerDataService;
    }
}

const DebugPlayerDataService = Knit.CreateService({
    Name: "DebugPlayerDataService",

    Client: {
        PlayerData: new RemoteSignal<(data: PlayerData) => void>
    },

    KnitInit()
    {
    },

    KnitStart()
    {
        Players.PlayerAdded.Connect(p =>
        {
            while (wait(1))
            {
                this.Client.PlayerData.Fire(p, GameDataManager.GetInstance().GetPlayerDataAccessor(p).Data)
            }
        })
    },
});

export = DebugPlayerDataService;