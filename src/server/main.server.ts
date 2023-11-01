import { KnitServer as knit } from "@rbxts/knit";
import { Component } from "@rbxts/knit";

knit.AddServices(script.Parent!.FindFirstChild('services') as Folder)
Component.Auto(script.Parent!.FindFirstChild("components") as Folder)

knit.Start()
    .andThen(() => {
        print("Server Start")
    })
    .catch(warn)