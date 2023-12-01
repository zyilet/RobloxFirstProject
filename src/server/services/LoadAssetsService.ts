import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { InsertService } from "@rbxts/services";

declare global
{
    interface KnitServices
    {
        LoadAssetsService: typeof LoadAssetsService;
    }
}

let loading: [assetId: number, state: "loading" | "done"][] = []

const LoadAssetsService = Knit.CreateService({
    Name: "LoadAssetsService",

    Client:
    {
        LoadAsset: new RemoteSignal<(id: number) => void>()
    },

    KnitInit()
    {
    },

    KnitStart()
    {
        this.Client.LoadAsset.Connect((p, assetId) =>
        {
            if (loading.find(([id, _]) => id === assetId))
            {
                return
            }

            let state: [number, "loading" | "done"] = [assetId, "loading"]
            loading.push(state)

            let [success, result] = pcall(() =>
            {
                return InsertService.LoadAsset(assetId)
            })

            if (success)
            {
                let model = result as Model
                let asset = model.GetChildren().pop()!

                asset.Name = tostring(assetId)
                asset.Parent = p.WaitForChild("Cache")
                state[1] = "done"
            }
            else
            {
                loading = loading.filter(([id, _]) => id !== assetId)
            }
        })
    },
});

export = LoadAssetsService;