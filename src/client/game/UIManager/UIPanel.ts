export abstract class UIPanel
{
    public static Name: string
    public abstract OnInit(): void
    public abstract OnShow(depth: number): void
    public abstract OnClose(): void
}

export interface RBXScriptConnection
{
    BindToUI(): void
}