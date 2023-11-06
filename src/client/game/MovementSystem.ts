import { ContextActionService, Players, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";
import GameObjLoader from "./GameObjLoader";
import { OneKM } from "shared/Constants";
import { Keyboard } from "@rbxts/clack";

//运动模式类型
export enum MovementType
{
    Default,
    Ground,
    Air,
}

export default class MovementSystem
{

    //单例
    private static _instance: MovementSystem;
    public static GetInstance()
    {
        return this._instance ??= new MovementSystem();
    }

    private _movementController?: MovementController;

    public SetMovementType(movementType: MovementType)
    {

        this._movementController?.Abolish();

        if (movementType === MovementType.Ground)
            this._movementController = new GroundController();
        if (movementType === MovementType.Air)
            this._movementController = new AirController();
        if (movementType === MovementType.Default)
            this._movementController = new DefaultController();

        this._movementController?.Apply();
    }
}

interface MovementController
{
    Apply(): void;
    Abolish(): void;
}

abstract class BaseController implements MovementController
{

    abstract Apply(): void;
    abstract Abolish(): void;

    protected _camera = GameObjLoader.GetInstance().GetCurrentCamera();
    protected _character = GameObjLoader.GetInstance().GetCharacter();
    protected _humanoid = GameObjLoader.GetInstance().GetHumanoid();
    protected _humanoidRoot = GameObjLoader.GetInstance().GetHumanoidRoot();

    // public InitObj(): void {
    //     this._character = GameObjLoader.GetInstance().GetCharacter();
    //     this._camera = GameObjLoader.GetInstance().GetCurrentCamera();
    //     this._humanoid = GameObjLoader.GetInstance().GetHumanoid();
    //     this._humanoidRoot = GameObjLoader.GetInstance().GetHumanoidRoot();
    // }
}

class GroundController extends BaseController
{

    private _cameraState = {
        OffsetX: 2,
        OffsetY: 2,
        OffsetZ: -8,
        AxisYAngle: 0,
        AxisXAngle: 0,
    }

    private AxisYAngle = 0;
    private AxisXAngle = 0;
    private FlipY = true;
    private BackOffset = 8;
    private _keyboard = new Keyboard();



    public Apply()
    {
        this._camera!.CameraType = Enum.CameraType.Scriptable;
        UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
        UserInputService.MouseIconEnabled = false;
        this._humanoid.AutoRotate = false;

        ContextActionService.BindAction(
            "PlayerInput",
            (name, state, obj) => this.PlayerInput(name, state, obj),
            false,
            Enum.UserInputType.MouseMovement,
            Enum.UserInputType.Touch,
            Enum.UserInputType.MouseWheel,
        );
        RunService.BindToRenderStep(
            "CameraUpdate",
            Enum.RenderPriority.Camera.Value,
            () => this.CameraUpdate()
        );

        let connect = RunService.Heartbeat.Connect(dt =>
        {
            if (
                this._keyboard.isKeyDownAllowProcessed(Enum.KeyCode.W) ||
                this._keyboard.isKeyDownAllowProcessed(Enum.KeyCode.S) ||
                this._keyboard.isKeyDownAllowProcessed(Enum.KeyCode.A) ||
                this._keyboard.isKeyDownAllowProcessed(Enum.KeyCode.D))
            {

                this.FacingUpdate();
            }
        })
    }

    public Abolish(): void
    {
        this._camera.CameraType = Enum.CameraType.Custom;
        UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
        UserInputService.MouseIconEnabled = true;
        this._humanoid.AutoRotate = true;

        ContextActionService.UnbindAction("PlayerInput");
        RunService.UnbindFromRenderStep("CameraUpdate");
    }

    private PlayerInput(actionName: string, inputState: Enum.UserInputState, inputObj: InputObject)
    {
        if (inputState === Enum.UserInputState.Change)
        {
            let delta = inputObj.Delta.mul(0.1);
            let dx = -delta.X;
            let dy = this.FlipY ? -delta.Y : delta.Y;
            this.AxisYAngle = this.AxisYAngle + dx;
            this.AxisXAngle = math.clamp(this.AxisXAngle + dy, -75, 75);
        }

        if (inputObj.UserInputType === Enum.UserInputType.MouseWheel)
        {
            let dz = -inputObj.Position.Z;
            this.BackOffset = math.clamp(this.BackOffset + dz, 2, 10);
        }
    }

    //更新相机
    private CameraUpdate()
    {
        UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

        let startCF = new CFrame(this._humanoidRoot.CFrame.Position)
            .mul(CFrame.Angles(0, math.rad(this.AxisYAngle), 0))
            .mul(CFrame.Angles(math.rad(this.AxisXAngle), 0, 0));

        let pos = startCF.PointToWorldSpace(new Vector3(2, 3, this.BackOffset));
        let look = startCF.PointToWorldSpace(new Vector3(2, 2, -OneKM));

        this._camera.CFrame = CFrame.lookAt(pos, look);
    }

    private _cfTween: Tween | undefined;
    //更新朝向
    private FacingUpdate()
    {
        let lookingCF = CFrame.lookAt(
            this._humanoidRoot.Position,
            this._camera.CFrame.PointToWorldSpace(new Vector3(0, 0, -OneKM)));

        let targetCF = CFrame.fromMatrix(
            this._humanoidRoot.Position,
            lookingCF.XVector,
            this._humanoidRoot.CFrame.YVector,
        );

        this._cfTween?.Cancel();
        let ti = new TweenInfo(0.1, Enum.EasingStyle.Linear);
        this._cfTween = TweenService.Create(this._humanoidRoot, ti, { CFrame: targetCF });
        this._cfTween.Play();

        // this._humanoidRoot.CFrame = targetCF;
    }
}


class AirController implements MovementController
{

    Apply(): void
    {

    }
    Abolish(): void
    {

    }
}

class DefaultController implements MovementController
{

    Apply(): void
    {

    }
    Abolish(): void
    {

    }
}