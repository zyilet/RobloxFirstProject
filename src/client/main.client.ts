/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-10 16:40:47
 * @FilePath: \RobloxFirstProject\src\client\main.client.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-02 16:18:47
 * @FilePath: \RobloxFirstProject\src\client\main.client.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { KnitClient as Knit } from "@rbxts/knit";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { ControlSystem } from "./game/ControlManager";
import NumberFormatter from "shared/NumberFormatter";
import { UIManager } from "./game/UI/UIManager";

// Knit.AddControllers(script.Parent!.FindFirstChild("controllers") as Folder);
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder);



Knit.Start()
    .andThen(() =>
    {
        print("Client Started");

        let controlSystem = ControlSystem.GetInstance();
        controlSystem.Init();
        RunService.Heartbeat.Connect(dt =>
        {
            controlSystem?.Update(dt);
        })

        UIManager.GetInstance().Show("MainPanel");
    })
    .catch(warn)