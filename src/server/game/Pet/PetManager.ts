import { InsertService } from "@rbxts/services"
import { PetConfigCollection } from "shared/GameConfig/PetConfig"
import { Pet } from "./Pet"

export type modelCache =
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

export type progressHandle = (progress: number) => void

export class PetManager
{
    // #region 单例
    private static _instance: PetManager
    public static GetInstance()
    {
        return this._instance ??= new PetManager()
    }
    // #endregion

    private playerPets: [Player, Pet][] = []

    public Init()
    {

    }

    public Update(dt: number)
    {
        for (const [plaeyr, pet] of this.playerPets)
        {
            pet.Update(dt)
        }
    }

    public CreatePetForPlayer(player: Player, petId: string)
    {
        let pet = new Pet().Init(petId, player)
        this.playerPets.push([player, pet])
    }


    // private CachePetModel(): number
    // {
    //     PetManager.PetModelCache.forEach(cache =>
    //     {
    //         if (cache.state === "Init")
    //         {
    //             task.spawn(() =>
    //             {
    //                 let [success, result] = pcall(() =>
    //                 {
    //                     return InsertService.LoadAsset(cache.assetId);
    //                 })
    //                 if (success)
    //                 {
    //                     let model = (result as Model).GetChildren().pop() as Model
    //                     let newCache: modelCache = {
    //                         state: "Loaded",
    //                         assetId: cache.assetId,
    //                         model
    //                     }
    //                     // PetManager.PetModelCache.set(cache.assetId, newCache)
    //                     PetManager.PetModelCache
    //                 }
    //                 else
    //                 {
    //                     cache.state = "WaitReTry"
    //                 }
    //             })
    //             cache.state = "Loading"
    //             cache.loadingCount += 1
    //             return
    //         }
    //         if (cache.state === "Loading")
    //         {
    //             return
    //         }
    //         if (cache.state === "WaitReTry")
    //         {
    //             if (cache.loadingCount >= 3)
    //             {
    //                 let newCache: modelCache = {
    //                     state: "Err",
    //                     assetId: cache.assetId
    //                 }
    //                 PetManager.PetModelCache.set(cache.assetId, newCache)
    //                 return
    //             }

    //             task.spawn(() =>
    //             {
    //                 let [success, result] = pcall(() =>
    //                 {
    //                     return InsertService.LoadAsset(cache.assetId);
    //                 })
    //                 if (success)
    //                 {
    //                     let model = (result as Model).GetChildren().pop() as Model
    //                     let newCache: modelCache = {
    //                         state: "Loaded",
    //                         assetId: cache.assetId,
    //                         model
    //                     }
    //                     PetManager.PetModelCache.set(cache.assetId, newCache)
    //                 }
    //                 else
    //                 {
    //                     cache.state = "WaitReTry"
    //                 }
    //             })
    //             cache.state = "Loading"
    //             cache.loadingCount += 1
    //             return
    //         }
    //         if (cache.state === "Err")
    //         {
    //             return
    //         }
    //         if (cache.state === "Loaded")
    //         {
    //             return
    //         }
    //     })


    // }
}