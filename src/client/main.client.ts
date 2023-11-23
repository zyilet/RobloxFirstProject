import { KnitClient } from "@rbxts/knit";
import { ControlSystem } from "./game/ControlManager";
import { Players, RunService, StarterGui, UserInputService } from "@rbxts/services";
import { UIManager } from "./game/UI/UIManager";
import { WaitHumanoidRoot } from "shared/Constants";
import { Transform } from "shared/Transform";
import { Connection } from "@rbxts/knit/Knit/Util/Signal";
import { GameManager } from "./game/GameManager/GameManager";

// Knit.AddControllers(script.Parent!.FindFirstChild("controllers") as Folder);
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder);

KnitClient.Start()
    .andThen(() =>
    {
        print("Client Started");

        // let controlSystem = ControlSystem.GetInstance();
        // controlSystem.Init();
        // RunService.Heartbeat.Connect(dt =>
        // {
        //     controlSystem?.Update(dt);
        // })

        // let timer = 0
        // let interval = 0.1
        // UserInputService.InputBegan.Connect((input, processed) =>
        // {
        //     if (processed)
        //     {
        //         return
        //     }

        //     if (input.UserInputType === Enum.UserInputType.MouseButton1)
        //     {
        //         if (timer >= interval)
        //         {
        //             timer = 0;

        //             let startPos = WaitHumanoidRoot().CFrame.Position;
        //             let endPos = Transform.PointLocalToWorld(WaitHumanoidRoot().CFrame, new Vector3(0, 0, -1000));
        //             KnitClient.GetService("ProjectileService").CastProjectile.Fire(startPos, endPos);
        //             KnitClient.GetService("PlayerDataService").AddAttackValue.Fire();
        //         }
        //     }
        // })

        // RunService.Heartbeat.Connect(dt =>
        // {
        //     timer += dt
        // })

        // UserInputService.InputBegan.Connect((i, p) =>
        // {

        // })

        // UIManager.GetInstance().Show("MainPanel");

        // KnitClient.GetService("InitializeService").InitializeProgress.Connect(data =>
        // {
        //     let msg = data.state === "initializing" ? `${data.state}:${data.progress}` : `${data.state}`
        //     print(msg)
        // })

    })
    .catch(warn)


// let gameManager = new GameManager().Init()
// RunService.Heartbeat.Connect(dt =>
// {
//     gameManager.Update(dt)
// })

task.wait(5)

print("加载角色")
KnitClient.GetService("GameService").LoadCharacter.Fire()

task.wait(3)

let cb = new Instance("BindableEvent")
cb.Event.Connect(() =>
{
    print("重置角色")
})

StarterGui.SetCore("ResetButtonCallback", true)
StarterGui.SetCore("ResetButtonCallback", cb)