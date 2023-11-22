import { KnitServer as Knit, RemoteSignal, Signal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { PetManager } from "server/game/Pet/PetManager";
import { AssetCacheManager } from "shared/AssetCache/AssetCacheManager";

declare global
{
    interface KnitServices
    {
        PetService: typeof PetService;
    }
}

const PetService = Knit.CreateService({
    Name: "PetService",

    Client: {
        //客户端发布
        EquipPet: new RemoteSignal<(id: string) => void>(),
        UnEquipPet: new RemoteSignal<(id: string) => void>(),
        SellPet: new RemoteSignal<(id: string) => void>(),
    },

    KnitInit()
    {

    },

    KnitStart()
    {
        Players.PlayerAdded.Connect(player =>
        {
            let petManager = PetManager.GetInstance()
            let cacheManager = AssetCacheManager.GetInstance()

            while (task.wait())
            {
                if (cacheManager.GetState() === "loaded")
                {
                    break
                }
            }

            petManager.CreatePetForPlayer(player, "测试宠物1")

        })
    }
});

export = PetService;