import { InsertService, Workspace } from "@rbxts/services";
import { MonsterBase } from "./MonsterBase";
import { MonsterHPBar } from "./MonsterHPBar";
import { MonsterConfig } from "shared/GameConfig/MonsterConfig";


export class Monster extends MonsterBase
{
    //模型资源的缓存
    private static _modelCache = new Map<string, Model>();

    private static _modelId: number = 15296980369;
    private static _model: Model | undefined;
    private static _isLoading: boolean = false;

    private _model: Model | undefined;
    private _root: Part | undefined;
    private _HpBarImg: ImageLabel | undefined;
    private _isInit: boolean = false;
    private _hpBar?: MonsterHPBar

    public GetCurHp(): number
    {
        return this.CurHP;
    }

    public OnDamaged(damage: number): void
    {
        if (!this._isInit)
        {
            return;
        }

        this.CurHP = math.max(0, this.CurHP - damage);
        this._hpBar?.SetRatio(this.CurHP / this.MaxHP);
    }

    public OnDead(): void
    {
        this._model?.Destroy();

        //TODO::创建奖励
    }

    public Init(config: MonsterConfig, cf: CFrame, id: string)
    {
        if (!this.CheckLoadModel(config))
        {
            return undefined;
        }

        this.Id = id;
        this._model = Monster._modelCache.get(config.id)!.Clone()
        this._root = this._model.WaitForChild("Model") as Part
        this._hpBar = new MonsterHPBar(this._model.WaitForChild("HPBar") as BillboardGui)
        this._root.CFrame = cf;
        this._model.Parent = Workspace

        this._isInit = true;
        return this._model;
    }

    public Update(dt: number)
    {

    }

    private CheckLoadModel(config: MonsterConfig)
    {
        if (Monster._modelCache.has(config.id))
        {
            return true;
        }
        //加载模型
        let [success, result] = pcall(() =>
        {
            return InsertService.LoadAsset(config.assetID);
        })
        if (success)
        {
            let model = (result as Model).GetChildren()[0] as Model
            Monster._modelCache.set(config.id, model);
            return true;
        }
        return false;
    }
}