import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";

declare global
{
    interface KnitServices
    {
        GameService: typeof GameService;
    }
}

const GameService = Knit.CreateService({
    Name: "GameService",

    Client: {
        LoadCharacter: new RemoteSignal()
    },

    KnitInit()
    {
    },

    KnitStart()
    {
        this.Client.LoadCharacter.Connect(player =>
        {
            player.LoadCharacter()
        })
    },
});

export = GameService;