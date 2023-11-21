import { InsertService } from "@rbxts/services"
import { PetConfigCollection } from "shared/GameConfig/PetConfig"

type modelCache =
    {
        state: "Init" | "Loading" | "WaitReTry"
        loadingCount: number
        assetId: number
    }
    |
    {
        state: "Loaded"
        model: Model
        assetId: number
    }
    |
    {
        state: "Err"
        assetId: number
    }

type progressHandle = (progress: number) => void

export class PetManger
{
    public static PetModelCache = new Map<number, modelCache>()
    private static _instance: PetManger
    public static GetInstance()
    {
        return this._instance ??= new PetManger()
    }

    public Handles = new Array<progressHandle>()
    public Initialized = false;

    public Init()
    {
        //从网络中缓存配置中的宠物模型
        PetConfigCollection.GetAllConfig().forEach(config =>
        {
            let modelCache: modelCache = {
                state: "Init",
                loadingCount: 0,
                assetId: config.assetId
            }
            PetManger.PetModelCache.set(config.assetId, modelCache)
        })
    }

    public Update()
    {
        if (!this.Initialized)
        {
            let progress = this.CachePetModel()
            this.Handles.forEach(handle => handle(progress))
            this.Initialized = progress === 1
        }
    }

    private CachePetModel(): number
    {
        PetManger.PetModelCache.forEach(cache =>
        {
            if (cache.state === "Init")
            {
                task.spawn(() =>
                {
                    let [success, result] = pcall(() =>
                    {
                        return InsertService.LoadAsset(cache.assetId);
                    })
                    if (success)
                    {
                        let model = (result as Model).GetChildren().pop() as Model
                        let newCache: modelCache = {
                            state: "Loaded",
                            assetId: cache.assetId,
                            model
                        }
                        PetManger.PetModelCache.set(cache.assetId, newCache)
                    }
                    else
                    {
                        cache.state = "WaitReTry"
                    }
                })
                cache.state = "Loading"
                cache.loadingCount += 1
                return
            }
            if (cache.state === "Loading")
            {
                return
            }
            if (cache.state === "WaitReTry")
            {
                if (cache.loadingCount >= 3)
                {
                    let newCache: modelCache = {
                        state: "Err",
                        assetId: cache.assetId
                    }
                    PetManger.PetModelCache.set(cache.assetId, newCache)
                    return
                }

                task.spawn(() =>
                {
                    let [success, result] = pcall(() =>
                    {
                        return InsertService.LoadAsset(cache.assetId);
                    })
                    if (success)
                    {
                        let model = (result as Model).GetChildren().pop() as Model
                        let newCache: modelCache = {
                            state: "Loaded",
                            assetId: cache.assetId,
                            model
                        }
                        PetManger.PetModelCache.set(cache.assetId, newCache)
                    }
                    else
                    {
                        cache.state = "WaitReTry"
                    }
                })
                cache.state = "Loading"
                cache.loadingCount += 1
                return
            }
            if (cache.state === "Err")
            {
                return
            }
            if (cache.state === "Loaded")
            {
                return
            }
        })
        return 0
    }
}