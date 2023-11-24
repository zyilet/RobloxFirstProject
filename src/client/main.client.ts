import { KnitClient } from "@rbxts/knit";
import { ControlSystem } from "./game/ControlManager";
import { Players, RunService, StarterGui, UserInputService } from "@rbxts/services";
import { UIManager_Back } from "./game/UIManager/UIManager_Back";
import { WaitHumanoidRoot } from "shared/Constants";
import { Transform } from "shared/Transform";
import { Connection } from "@rbxts/knit/Knit/Util/Signal";
import { GameManager } from "./game/GameManager/GameManager";
import { MessageManager } from "./game/MessageManager/MessageManager";

// Knit.AddControllers(script.Parent!.FindFirstChild("controllers") as Folder);
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder);

KnitClient.Start()
    .andThen(() =>
    {
        print("Client Started");

        //游戏逻辑入口，帧循环驱动
        let gameManager = new GameManager().Init()
        RunService.Heartbeat.Connect(dt =>
        {
            gameManager.Update(dt)
        })
    })
    .catch(warn)

// task.wait(5)

// print("加载角色")
// KnitClient.GetService("GameService").LoadCharacter.Fire()

// task.wait(3)

// let cb = new Instance("BindableEvent")
// cb.Event.Connect(() =>
// {
//     print("重置角色")
//     KnitClient.GetService("GameService").ResetCharacter.Fire()
// })

// StarterGui.SetCore("ResetButtonCallback", true)
// StarterGui.SetCore("ResetButtonCallback", cb)

// KnitClient.GetService("GameService").GetInitializeProgress()