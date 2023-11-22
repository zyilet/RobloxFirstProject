import { InitializedState } from "shared/InitializedState";
import { AssetCache } from "./AssetCache";
import { MonsterConfigCollection } from "shared/GameConfig/MonsterConfig";
import { PetConfigCollection } from "shared/GameConfig/PetConfig";


export type LoadState = "none" | "loading" | "loaded"
export class AssetCacheManager
{
    private static instance: AssetCacheManager
    public static GetInstance()
    {
        return this.instance ??= new AssetCacheManager()
    }

    private cacheList: AssetCache<any>[] = []
    private state: LoadState = "none"
    private initializedState: InitializedState = "not"

    public Init()
    {
        this.initializedState = "done"

        let monsterIds = MonsterConfigCollection.GetAllConfig().map(ele => ele.assetID)
        let petIds = PetConfigCollection.GetAllConfig().map(ele => ele.assetId)

        for (const id of [...monsterIds, ...petIds])
        {
            this.cacheList.push(new AssetCache<any>().Init(id))
        }
    }

    public Update(dt: number)
    {
        //未初始化
        if (this.initializedState === "not") return
        //加载完成
        if (this.state === "loaded") return

        this.LoadCache()
        print(this.state, this.GetProgress())
    }

    public GetState()
    {
        return this.state
    }

    public GetProgress()
    {
        if (this.state === "loading")
        {
            let loadedCount = this.cacheList.filter(ele => ele.GetState() === "loaded").size()
            let allCount = this.cacheList.size()
            return loadedCount / allCount
        }
        return this.state === "loaded" ? 1 : 0
    }

    public GetAsset<T>(assetId: number)
    {
        if (this.state === "loaded")
        {
            let cache = this.cacheList.find(ele => ele.GetAssetId() === assetId)
            if (cache === undefined)
            {
                error("找不到指定的id所对应的缓存资源")
            }
            return cache.GetAsset() as T
        }
        error("缓存资源未加载完成")
    }

    private LoadCache()
    {
        this.state = "loading"
        let needLoadCache = this.cacheList.filter(ele => ele.GetState() === "none")
        let loadingCache = this.cacheList.filter(ele => ele.GetState() === "loading")
        if (needLoadCache.size() === 0 && loadingCache.size() === 0)
        {
            this.state = "loaded"
            return
        }

        for (const cache of needLoadCache)
        {
            if (cache.GetState() === "none" || cache.GetState() === "loading")
            {
                cache.Load()
            }
        }
    }
}