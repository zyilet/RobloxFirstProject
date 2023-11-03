import { Players, Workspace } from "@rbxts/services";

export default class GameObjLoader {

    private static _instance?: GameObjLoader;
    public static GetInstance() {
        return this._instance ??= new GameObjLoader();
    }

    public GetCharacter() {
        let character = Players.LocalPlayer.Character;
        while (!character) {
            wait();
            character = Players.LocalPlayer.Character;
        }
        return character;
    }

    public GetCurrentCamera() {
        let camera = Workspace.CurrentCamera;
        while (!camera) {
            wait();
            camera = Workspace.CurrentCamera;
        }
        return camera;
    }

    public GetHumanoid() {
        let character = this.GetCharacter();
        return character.WaitForChild("Humanoid") as Humanoid;
    }

    public GetHumanoidRoot() {
        let character = this.GetCharacter();
        return character.WaitForChild("HumanoidRootPart") as Part;
    }
}