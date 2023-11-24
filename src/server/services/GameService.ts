import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Player } from "@rbxts/knit/Knit/KnitClient";

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
        LoadCharacter: new RemoteSignal(),
        ResetCharacter: new RemoteSignal(),

        GetInitializeProgress(player: Player)
        {
            print(player)
        }
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

        this.Client.ResetCharacter.Connect(player =>
        {
            let root = player.Character?.PrimaryPart
            // if (head) head.Parent = undefined
            if (player.Character) player.Character.Destroy()

            player.LoadCharacter()
        })


    },
});

export = GameService;