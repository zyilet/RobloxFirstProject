export abstract class BasePanel
{
    public abstract Init(ui: ScreenGui): void
    public abstract Show(): void
    public abstract Hide(): void
}