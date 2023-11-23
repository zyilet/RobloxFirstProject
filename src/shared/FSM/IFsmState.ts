export interface IFsmState<TOwner, TKeys>
{
    GetKey(): TKeys
    OnEntry(): void
    OnUpdate(dt: number): void
    OnExit(): void
}