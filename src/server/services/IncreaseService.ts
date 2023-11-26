import { KnitServer as Knit, KnitServer } from "@rbxts/knit";

declare global
{
    interface KnitServices
    {
        IncreaseService: typeof IncreaseService;
    }
}

const IncreaseService = Knit.CreateService({
    Name: "IncreaseService",

    Client:
    {

    },

    KnitInit()
    {

    },

    KnitStart()
    {

    },
});

export = IncreaseService;