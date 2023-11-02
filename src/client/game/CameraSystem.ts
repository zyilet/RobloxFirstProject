import { UserInputService } from "@rbxts/services";

export default class CameraSystem {

    private static _instance: CameraSystem | undefined;
    public static GetInstance() {
        if (this._instance === undefined) {
            this._instance = new CameraSystem()
        }
        return this._instance;
    }

    private _cameraState = {
        LookPos: Vector3,
        CameraPos: Vector3,
    }

    public Run() {
        UserInputService.InputChanged.Connect(input => {
            if (input.UserInputType === Enum.UserInputType.MouseMovement) {
                this.OnMouseMove(input)
            }
        })
    }

    private OnMouseMove(input: InputObject) {
        const mouseDelta = input.Delta;
        print(mouseDelta)
    }
}