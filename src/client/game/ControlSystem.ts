import { Keyboard, Mouse } from "@rbxts/clack";
import { MeterToStud, OneKM, WaitCharacter, WaitCurrentCamera, WaitHumanoid, WaitHumanoidRoot } from "shared/Constants";
import { ContextActionService, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";
import Projectile from "shared/Projectile";
import { Transform } from "shared/Transform";
import { KnitClient } from "@rbxts/knit";

enum MoveStateType
{
    Fly,
    Ground,
}

export class ControlSystem
{
    private _hoverAnimId = "rbxassetid://15258521332"
    private _flySpeed = 20;

    private _currentMoveState = MoveStateType.Ground;
    private _keyboard: Keyboard | undefined;
    private _camera: Camera | undefined;
    private _humanoid: Humanoid | undefined;
    private _character: Model | undefined;
    private _rootPart: Part | undefined;
    private _animator: Animator | undefined;
    private _hoverAnim: AnimationTrack | undefined;
    private _bodyVelocity: BodyVelocity | undefined;
    private _heightVelocity: BodyVelocity | undefined;
    private _bodyGyro: BodyGyro | undefined;
    private _originFriction: number | undefined;
    private _jumpingDuration: number = 0;
    private _flyDir: Vector3 = Vector3.zero;
    private _verticalVector: Vector3 = Vector3.zero;
    private _axisYAngle = 0;
    private _axisXAngle = 0;
    private _backOffset = 8;
    private _maxBackOffset = 16;
    private _mouseSensitivity = 0.1;
    private _isFlipY = true;
    private _isReleaseCursor = false;

    public Init()
    {
        this._keyboard = new Keyboard();
        this._camera = WaitCurrentCamera();
        this._humanoid = WaitHumanoid();
        this._character = WaitCharacter();
        this._rootPart = WaitHumanoidRoot();
        this._animator = this._humanoid.WaitForChild("Animator") as Animator;
        this._originFriction = this._rootPart.Friction;

        let animation = new Instance("Animation");
        animation.AnimationId = this._hoverAnimId;
        this._hoverAnim = this._animator.LoadAnimation(animation)

        this._bodyVelocity = new Instance("BodyVelocity", this._character);
        this._bodyGyro = new Instance("BodyGyro", this._rootPart);
        this._bodyVelocity.MaxForce = Vector3.one.mul(1_0000)
        this._bodyVelocity.P = 1_0000;
        this._bodyGyro.MaxTorque = Vector3.one.mul(1_0000);
        this._bodyGyro.P = 1_0000;

        //#region 摄像机和朝向
        this._camera.CameraType = Enum.CameraType.Scriptable;
        this._humanoid.AutoRotate = false;
        //#endregion

        //注册按键释放事件(按键按下期间会持续调用事件回调， 但是释放时只会调用一次)
        this._keyboard.keyUp.Connect((key, processed) =>
        {
            if (key === Enum.KeyCode.Space)
            {
                this._jumpingDuration = 0
            }
        })

        this._keyboard.keyDown.Connect((key, processed) =>
        {
            if (key === Enum.KeyCode.C)
            {
                this._isReleaseCursor = !this._isReleaseCursor;
            }
        })

        ContextActionService.BindAction(
            "PlayerInput",
            (name, state, input) => this.UpdateCameraAxis(name, state, input),
            false,
            Enum.UserInputType.MouseMovement,
            Enum.UserInputType.Touch,
            Enum.UserInputType.MouseWheel,
        )

        RunService.BindToRenderStep(
            "CameraUpdate",
            Enum.RenderPriority.Camera.Value,
            () => this.UpdateCameraFacing()
        )
    }

    private atkDuration = 0.1;
    private mouse = new Mouse();
    public Update(dt: number)
    {
        this.atkDuration -= dt;
        if (this.mouse.isButtonDown(Enum.UserInputType.MouseButton1))
        {
            if (this.atkDuration <= 0)
            {
                this.atkDuration = 0.1;

                // new Projectile(1, 3, this._character!).Cast(this._rootPart!.CFrame.Position, Transform.PointLocalToWorld(this._camera!.CFrame, new Vector3(0, 0, -MeterToStud(100))), MeterToStud(10));
                KnitClient.GetService("ProjectileService").CastProjectile.Fire(this._rootPart!.CFrame.Position, Transform.PointLocalToWorld(this._camera!.CFrame, new Vector3(0, 0, -MeterToStud(100))));
            }
        }

        this.CheckCursor()
        this._keyboard = this._keyboard!
        this._bodyGyro!.CFrame = this._camera!.CFrame

        //按下跳跃键时监控时长
        if (this._keyboard.isKeyDown(Enum.KeyCode.Space))
        {
            this._jumpingDuration += dt;
            this.OnJumpingPress(this._jumpingDuration);
        }

        this.UpdateFlyDir();


        let rayCastParams = new RaycastParams();
        rayCastParams.FilterType = Enum.RaycastFilterType.Exclude;
        rayCastParams.FilterDescendantsInstances = [this._character!];
        let result = Workspace.Spherecast(this._rootPart!.CFrame.Position, MeterToStud(0.5), new Vector3(0, -MeterToStud(0.5)), rayCastParams);
        if (result?.Instance.Name === "Baseplate" && this._currentMoveState === MoveStateType.Fly)
        {
            this.ChangeMoveState(MoveStateType.Ground);
        }
    }

    private UpdateFlyDir()
    {
        this._bodyVelocity = this._bodyVelocity!;
        this._humanoid = this._humanoid!;
        this._camera = this._camera!;

        if (this._currentMoveState === MoveStateType.Ground)
        {
            return;
        }

        let flyDir = Vector3.zero;

        //#region 更新飞行方向
        //更新水平方向
        let flatDir = Vector3.zero
        if (this._humanoid.MoveDirection !== Vector3.zero)
        {
            let cameraPos = this._camera.CFrame.Position;
            let cameraLookExcludeY = new Vector3(this._camera.CFrame.LookVector.X, 0, this._camera.CFrame.LookVector.Z);
            let pos = new CFrame(cameraPos, cameraPos.add(cameraLookExcludeY)).VectorToObjectSpace(this._humanoid.MoveDirection);
            flatDir = (this._camera.CFrame.mul(new CFrame(pos))).Position.sub(this._camera.CFrame.Position).Unit;
        }
        flatDir = flatDir === Vector3.zero ? Vector3.zero : flatDir.Unit;
        //叠加垂直方向
        let verticalDir = Vector3.zero;
        if (this._keyboard?.isKeyDown(Enum.KeyCode.Space))
        {
            verticalDir = verticalDir.add(new Vector3(0, 1, 0));
        }
        if (this._keyboard?.isKeyDown(Enum.KeyCode.LeftControl))
        {
            verticalDir = verticalDir.add(new Vector3(0, -1, 0));
        }
        verticalDir = verticalDir === Vector3.zero ? Vector3.zero : verticalDir.Unit;
        //#endregion

        flyDir = flatDir.add(verticalDir);
        flyDir = flyDir === Vector3.zero ? Vector3.zero : flyDir.Unit;
        TweenService.Create(this._bodyVelocity, new TweenInfo(0.3), { Velocity: flyDir.mul(MeterToStud(this._flySpeed)) }).Play();
    }

    private ChangeMoveState(state: MoveStateType)
    {
        this._humanoid = this._humanoid!;
        this._bodyVelocity = this._bodyVelocity!;
        this._bodyGyro = this._bodyGyro!;
        this._hoverAnim = this._hoverAnim!;
        this._rootPart = this._rootPart!;
        this._character = this._character!;

        if (state === MoveStateType.Ground)
        {
            this._currentMoveState = MoveStateType.Ground;
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.Running, true);
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, true);
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, true);
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, true);
            this._humanoid.ChangeState(Enum.HumanoidStateType.Running);
            this._rootPart.Friction = this._originFriction!;
            this._bodyVelocity.Parent = this._character;
            this._bodyGyro.MaxTorque = new Vector3(0, 1, 0).mul(10000);
            this._hoverAnim.Stop();
            return;
        }

        if (state === MoveStateType.Fly)
        {
            this._currentMoveState = MoveStateType.Fly;
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.Running, false);
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, false);
            this._humanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, false);
            this._humanoid.ChangeState(Enum.HumanoidStateType.Flying);
            this._rootPart.Friction = 0!;
            this._bodyVelocity.Parent = this._rootPart;
            this._bodyGyro.MaxTorque = new Vector3(1, 1, 1).mul(10000);
            this._hoverAnim.Play();
            return;
        }
    }

    //跳跃按键按下
    private OnJumpingPress(pressDuration: number)
    {
        //如果按下的时间小于0.3秒，不会进入飞行状态
        if (pressDuration < 0.3)
        {
            return;
        }

        //如果不在飞行模式，切换到飞行模式
        if (this._humanoid!.GetState() === Enum.HumanoidStateType.Freefall)
        {
            this.ChangeMoveState(MoveStateType.Fly)
            return;
        }
    }

    //叠加鼠标位移delta数据在XY轴上
    private UpdateCameraAxis(name: string, state: Enum.UserInputState, input: InputObject)
    {
        if (state === Enum.UserInputState.Change)
        {
            let delta = input.Delta.mul(this._mouseSensitivity);
            let dx = -delta.X;
            let dy = this._isFlipY ? -delta.Y : delta.Y;
            this._axisYAngle = this._axisYAngle + dx;
            this._axisXAngle = math.clamp(this._axisXAngle + dy, -75, 75);
        }

        if (input.UserInputType === Enum.UserInputType.MouseWheel)
        {
            let dz = -input.Position.Z;
            this._backOffset = math.clamp(this._backOffset + dz, 2, this._maxBackOffset);
        }
    }

    private CheckCursor()
    {

        if (this._humanoid?.MoveDirection !== Vector3.zero ||
            this._verticalVector !== Vector3.zero)
        {
            this._isReleaseCursor = false;
        }

        if (this._isReleaseCursor)
        {
            UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
            UserInputService.MouseIconEnabled = true;
        }
        else
        {
            UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
            UserInputService.MouseIconEnabled = false;
        }
    }

    //根据XY轴旋转数据更新相机朝向
    private UpdateCameraFacing()
    {
        this._camera = this._camera!;

        let startCF = new CFrame(this._rootPart!.CFrame.Position)
            .mul(CFrame.Angles(0, math.rad(this._axisYAngle), 0))
            .mul(CFrame.Angles(math.rad(this._axisXAngle), 0, 0));

        let pos = startCF.PointToWorldSpace(new Vector3(2, 3, this._backOffset));
        let look = startCF.PointToWorldSpace(new Vector3(2, 2, -OneKM));

        this._camera.CFrame = CFrame.lookAt(pos, look);
    }

    // //更新角色朝向
    // private UpdatePlayerFacing()
    // {
    //     let lookingCF = CFrame.lookAt(
    //         this._rootPart!.Position,
    //         this._camera!.CFrame.PointToWorldSpace(new Vector3(0, 0, -OneKM)));

    //     let targetCF = CFrame.fromMatrix(
    //         this._rootPart!.Position,
    //         lookingCF.XVector,
    //         this._rootPart!.CFrame.YVector,
    //     );

    //     let ti = new TweenInfo(0.1, Enum.EasingStyle.Linear);
    //     TweenService.Create(this._rootPart!, ti, { CFrame: targetCF }).Play();
    // }
}