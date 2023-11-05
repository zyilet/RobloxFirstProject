/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-04 15:38:47
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
import { Component } from "@rbxts/knit"
import { Players } from "@rbxts/services";
import GameTest from "./GameTest";

// Knit.AddControllers(script.Parent!.FindFirstChild("controllers") as Folder);
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder);

Knit.Start()
    .andThen(() =>
    {

        print("Clinet Started");
        // CameraSystem.GetInstance().Run();
        // const PointService = Knit.GetService("PointsService");

        // function PointsChanged(points: number) {
        //     print("My points:", points);
        // }

        // const initialPoints = PointService.GetPoints();
        // PointsChanged(initialPoints);
        // PointService.PointsChanged.Connect(PointsChanged)

        // PointService.GiveMePoints.Fire();

        // let mostPoints = PointService.MostPoints.Get();

        // PointService.MostPoints.Changed.Connect(newValue => {
        //     mostPoints = newValue;
        // })

        // // Advanced example, using promises to get points:
        // PointService.GetPointsPromise().then(points => {
        //     print("Got points:", points);
        // });


        new GameTest().Run();
    })
    .catch(warn)