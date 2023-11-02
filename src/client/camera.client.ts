import { ContextActionService, Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { FarDistance } from "shared/Constants";

let camera = Workspace.CurrentCamera;
let player = Players.LocalPlayer;
let cameraOffset = new Vector3(-2, 2, -8);

player.CharacterAdded.Connect(c => {

    let humanoid = c.WaitForChild("Humanoid") as Humanoid;
    let rootPart = c.WaitForChild("HumanoidRootPart") as Part;
    let cameraAngleX = 0;
    let cameraAngleY = 0;

    // humanoid.AutoRotate = false;

    let playerInput = function (actionName: string, inputState: Enum.UserInputState, inputObj: InputObject) {
        if (inputState === Enum.UserInputState.Change) {
            cameraAngleX = cameraAngleX - inputObj.Delta.X * 0.1;
            cameraAngleY = math.clamp(cameraAngleY + inputObj.Delta.Y * 0.1, -75, 75);
        }
    }
    let cameraUpdate = function (dt: number) {

        let startCFrame =
            new CFrame(rootPart.CFrame.Position)
                .mul(CFrame.Angles(0, math.rad(cameraAngleX), 0))
                .mul(CFrame.Angles(math.rad(cameraAngleY), 0, 0));

        let cameraCFrame = startCFrame.PointToWorldSpace(cameraOffset);
        let cameraFocus = startCFrame.PointToWorldSpace(new Vector3(cameraOffset.X, cameraOffset.Y, FarDistance))

        // let lookingCFrame = CFrame.lookAt(rootPart.Position, camera!.CFrame.PointToWorldSpace(new Vector3(0, 0, -FarDistance)));
        // rootPart.CFrame = CFrame.fromMatrix(rootPart.Position, lookingCFrame.XVector, lookingCFrame.YVector);

        camera!.CFrame = CFrame.lookAt(cameraCFrame, cameraFocus);
    }

    ContextActionService.BindAction(
        "PlayerInput",
        playerInput,
        false,
        Enum.UserInputType.MouseMovement,
        Enum.UserInputType.Touch
    );
    RunService.BindToRenderStep("CameraUpdate", Enum.RenderPriority.Camera.Value, cameraUpdate);
})

let focusControl = function (actionName: string, inputState: Enum.UserInputState, inputObj: InputObject) {

    if (inputState === Enum.UserInputState.Begin) {
        camera!.CameraType = Enum.CameraType.Scriptable;

        UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
        UserInputService.MouseIconEnabled = false;

        ContextActionService.UnbindAction("FocusControl")
    }
}

ContextActionService.BindAction(
    "FocusControl",
    focusControl,
    false,
    Enum.UserInputType.MouseButton1,
    Enum.UserInputType.Touch,
    Enum.UserInputType.Focus
)

