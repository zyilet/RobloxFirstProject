import { HttpService } from "@rbxts/services"

export class DisposablePack
{
    private disposables: Disposable[] = []

    public Add(disposable: Disposable)
    {
        this.disposables.push(disposable)
    }

    public Disposable()
    {
        this.disposables.forEach(ele => ele.Disposable())
        this.disposables.clear()
    }
}

export type Disposable = {
    Disposable: { (): void }
    AddTo: (disposables: DisposablePack) => void
}

export type Subscribable = {
    SubScribe: (action: () => void) => Disposable
}

export type SubscribableWithParam<T> = {
    Subscribe: (action: (param: T) => void) => Disposable
}

export class UIEvent
{
    private actions: Map<string, () => void> = new Map()

    public Publish()
    {
        this.actions.forEach(action => action())
    }

    public CreateSubscribable(): Subscribable
    {
        return {
            SubScribe: (action: { (): void }) =>
            {
                let guid = HttpService.GenerateGUID()
                this.actions.set(guid, action)

                let disposable = {
                    Disposable: () =>
                    {
                        this.actions.delete(guid)
                    },
                    AddTo: (pack: DisposablePack) =>
                    {
                        pack.Add(disposable)
                    }
                }
                return disposable
            }
        }
    }
}

export class UIParamEvent<T>{
    private actions: Map<string, (param: T) => void> = new Map()

    public Publish(param: T)
    {
        this.actions.forEach(action => action(param))
    }

    public CreateSubscribable(): SubscribableWithParam<T>
    {
        return {
            Subscribe: (action: (param: T) => void) =>
            {
                let guid = HttpService.GenerateGUID()
                this.actions.set(guid, action)

                let disposable = {
                    Disposable: () =>
                    {
                        this.actions.delete(guid)
                    },
                    AddTo: (pack: DisposablePack) =>
                    {
                        pack.Add(disposable)
                    }
                }
                return disposable
            }
        }
    }
}