import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, RunService } from "@rbxts/services";
import { AssetCacheManager } from "shared/AssetCache/AssetCacheManager";

declare global
{
    interface KnitServices
    {
        InitializeService: typeof InitializeService;
    }
}

type InitializeData =
    {
        state: "initializing"
        progress: number
    }
    |
    {
        state: "initialized"
    }
    |
    {
        state: "err"
    }

const InitializeService = Knit.CreateService({
    Name: "InitializeService",

    Client: {
        InitializeProgress: new RemoteSignal<(data: InitializeData) => void>()
    },

    KnitInit()
    {

    },

    KnitStart()
    {
        let assetCacheManager = AssetCacheManager.GetInstance()
        Players.PlayerAdded.Connect(player =>
        {
            task.spawn(() =>
            {
                let progress = assetCacheManager.GetProgress()
                while (progress !== 1)
                {
                    this.Client.InitializeProgress.Fire(player, {
                        state: "initializing",
                        progress
                    })

                    task.wait(1)
                    progress = assetCacheManager.GetProgress()
                }
                this.Client.InitializeProgress.Fire(player, {
                    state: "initialized"
                })
            })
        })
    },
});

export = InitializeService;