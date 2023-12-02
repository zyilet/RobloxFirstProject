import { HttpService } from "@rbxts/services"

export type Disable = {
    Disable: () => void
}

export type Subscribable = {
    Add: (action: () => void) => Disable
}

export class CustomEvent
{
    private actions: [guid: string, action: { (): void }][] = []

    public Publish()
    {
        this.actions.forEach(([_, action]) => action())
    }

    public CreateSubscribable(): Subscribable
    {
        return {
            Add: (action: () => void): Disable =>
            {
                let guid = HttpService.GenerateGUID()
                this.actions.push([guid, action])
                return {
                    Disable: () =>
                    {
                        this.actions.remove(this.actions.findIndex(ele => ele[0] === guid))
                    }
                }
            }
        }
    }
}