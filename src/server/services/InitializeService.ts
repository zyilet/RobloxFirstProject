import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";

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

    },
});

export = InitializeService;