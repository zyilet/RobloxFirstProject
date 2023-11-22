import { InsertService, Workspace } from "@rbxts/services"
import { InitializedState } from "shared/InitializedState"

export type AssetLoadState = "loading" | "loaded" | "none"
export class AssetCache<T>
{
    private assetId?: number
    private asset?: T
    private requestCount = 0
    private state: AssetLoadState = "none"
    private initialized: InitializedState = "not";

    public Init(assetId: number)
    {
        this.initialized = "done"
        this.assetId = assetId;
        return this
    }

    public GetRequestCount()
    {
        return this.requestCount
    }

    public GetState()
    {
        return this.state
    }

    public GetAssetId()
    {
        return this.assetId
    }

    public GetAsset()
    {
        return this.asset
    }

    public Load()
    {
        if (this.initialized === "not") return
        if (this.state === "loaded" || this.state === "loading") return

        this.requestCount += 1
        this.state = "loading"

        let id = this.assetId!
        task.spawn(() =>
        {
            let [success, result] = pcall(() =>
            {
                return InsertService.LoadAsset(id)
            })
            if (success)
            {
                this.asset = (result as Model).GetChildren().pop() as T
                this.state = "loaded"
            }
            else
            {
                this.state = "none"
            }
        })
    }
}