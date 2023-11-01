import { KnitClient as Knit } from "@rbxts/knit";
import { Component } from "@rbxts/knit"
import { Players } from "@rbxts/services";
import GameTest from "./GameTest";

Knit.AddControllers(script.Parent!.FindFirstChild("controllers") as Folder);
Component.Auto(script.Parent!.FindFirstChild("components") as Folder);

Knit.Start()
    .andThen(() => {

        print("Clinet Started");
        const PointService = Knit.GetService("PointsService");

        function PointsChanged(points: number) {
            print("My points:", points);
        }

        const initialPoints = PointService.GetPoints();
        PointsChanged(initialPoints);
        PointService.PointsChanged.Connect(PointsChanged)

        PointService.GiveMePoints.Fire();

        let mostPoints = PointService.MostPoints.Get();

        PointService.MostPoints.Changed.Connect(newValue => {
            mostPoints = newValue;
        })

        // Advanced example, using promises to get points:
        PointService.GetPointsPromise().then(points => {
            print("Got points:", points);
        });



        new GameTest().Run();
    })
    .catch(warn)