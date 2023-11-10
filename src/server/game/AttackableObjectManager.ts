import { InsertService, Workspace } from "@rbxts/services";
import { ToAssetId } from "shared/Constants";

/**
 * @description: 可被攻击对象管理器
 * @return {*}
 */
export class AttackableObjectManager
{
    private static _instance: AttackableObjectManager;
    public static GetInstance()
    {
        return this._instance ??= new AttackableObjectManager();
    }

    private _curUnitId = 0;
    private _modelToObj = new Map<Model, AttackableObject>();

    public Init()
    {

    }

    public Update(dt: number)
    {

    }

    public GetObj(model: Model)
    {
        return this._modelToObj.get(model);
    }

    public RemoveObj(model: Model)
    {
        this._modelToObj.delete(model);
    }

    public StartSpawn()
    {
        let obj = new TestAttackableObject();
        let model = obj.Init();
        this._modelToObj.set(model, obj);
    }

    public StopSpawn()
    {

    }
}

/**
 * @description: 可被攻击对象抽象父类
 * @return {*}
 */
export abstract class AttackableObject
{
    protected MaxHP: number = 0;
    protected CurHP: number = 0;

    public abstract OnBeAttacked(damage: number): void;
    public abstract OnDead(): void;
}

export class TestAttackableObject extends AttackableObject
{
    private static _modelId: number = 15296980369;
    private static _model: Model | undefined;
    private static _isLoading: boolean = false;

    private _model: Model | undefined;
    private _root: Part | undefined;
    private _HpBarImg: ImageLabel | undefined;

    public OnBeAttacked(damage: number): void
    {
        if (!this._model || !this._HpBarImg)
        {
            return;
        }

        this.CurHP = math.max(0, this.CurHP - damage);
        this._HpBarImg.Size = new UDim2(this.CurHP / this.MaxHP, 0, 1, 0)

        if (this.CurHP <= 0)
        {
            AttackableObjectManager.GetInstance().RemoveObj(this._model);
            this._model!.Destroy();
        }
    }

    public OnDead(): void
    {
        this._model?.Destroy();
    }

    public Init()
    {
        this.MaxHP = 100;
        this.CurHP = 100;

        //如果还没有加载好模型，就先加载模型
        if (!TestAttackableObject._model)
        {
            if (TestAttackableObject._isLoading)
            {
                while (!TestAttackableObject._model)
                {
                    wait()
                }
            }
            else
            {
                TestAttackableObject._isLoading = true;
                let [success, model] = pcall(() =>
                {
                    return InsertService.LoadAsset(TestAttackableObject._modelId);
                })
                if (success)
                {
                    TestAttackableObject._model = (model as Model).WaitForChild("TestModel") as Model;
                }
                TestAttackableObject._isLoading = false;
            }
        }
        //如果加载失败，就递归重新加载
        if (!TestAttackableObject._model)
        {
            this.Init();
        }

        this._model = TestAttackableObject._model!.Clone();
        this._root = this._model.WaitForChild("Model") as Part;
        this._HpBarImg = this._model.WaitForChild("BillboardGui").WaitForChild("Frame").WaitForChild("Front") as ImageLabel;

        this._root.CFrame = new CFrame(Vector3.zero);
        this._model.Parent = Workspace;

        return this._model;
    }

    public Update(dt: number)
    {

    }
}