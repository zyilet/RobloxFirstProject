import { KnitClient } from "@rbxts/knit";
import { ControlSystem } from "./game/ControlManager";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { UIManager } from "./game/UI/UIManager";
import { WaitHumanoidRoot } from "shared/Constants";
import { Transform } from "shared/Transform";
import { Connection } from "@rbxts/knit/Knit/Util/Signal";

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


        let timer = 0
        let interval = 0.1
        UserInputService.InputBegan.Connect((input, processed) =>
        {
            if (processed)
            {
                return
            }

            if (input.UserInputType === Enum.UserInputType.MouseButton1)
            {
                if (timer >= interval)
                {
                    timer = 0;

                    let startPos = WaitHumanoidRoot().CFrame.Position;
                    let endPos = Transform.PointLocalToWorld(WaitHumanoidRoot().CFrame, new Vector3(0, 0, -1000));
                    KnitClient.GetService("ProjectileService").CastProjectile.Fire(startPos, endPos);
                    KnitClient.GetService("PlayerDataService").AddAttackValue.Fire();
                }
            }
        })

        RunService.Heartbeat.Connect(dt =>
        {
            timer += dt
        })

        UserInputService.InputBegan.Connect((i, p) =>
        {

        })

        UIManager.GetInstance().Show("MainPanel");



    })
    .catch(warn)