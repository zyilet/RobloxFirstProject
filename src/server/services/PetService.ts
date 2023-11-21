import { KnitServer as Knit, RemoteSignal, Signal } from "@rbxts/knit";

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

    }
});

export = PetService;