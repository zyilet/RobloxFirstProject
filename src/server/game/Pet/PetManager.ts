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
        for (const [player, pet] of this.playerPets)
        {
            pet.Update(dt)
        }
    }

    public CreatePetForPlayer(player: Player, petId: string)
    {
        let pet = new Pet().Init(petId, player)
        this.playerPets.push([player, pet])
    }
}