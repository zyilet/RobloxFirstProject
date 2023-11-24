import { HttpService } from "@rbxts/services"

type Handle = (...params: unknown[]) => void
type SubInfo = {
    msgName: string,
    handles: HandleInfo[],
}
type HandleInfo = {
    guid: string,
    handle: Handle
}

export class MessageManager
{
    private static instance: MessageManager
    public static GetInstance()
    {
        return this.instance ??= new MessageManager()
    }

    private subscribers: SubInfo[] = []

    public Publish(msgName: string, ...params: unknown[])
    {
        let subInfo = this.subscribers.find(subInfo => subInfo.msgName === msgName)
        if (subInfo)
        {
            for (let handleInfo of subInfo.handles)
            {
                handleInfo.handle(...params)
            }
        }
    }

    public Subscribe(msgName: string, handle: Handle): string
    {
        let guid = HttpService.GenerateGUID(false)

        let subInfo = this.subscribers.find(subInfo => subInfo.msgName === msgName)
        if (!subInfo)
        {
            this.subscribers.push({
                msgName,
                handles: [{
                    guid,
                    handle
                }]
            })
        }
        else
        {
            subInfo.handles.push({
                guid,
                handle
            })
        }
        return guid
    }

    public UnSubscribe(guidToRemove: string)
    {
        for (let i = this.subscribers.size() - 1; i >= 0; i--)
        {
            let subInfo = this.subscribers[i]
            for (let i = subInfo.handles.size() - 1; i >= 0; i--)
            {
                let handInfo = subInfo.handles[i]
                if (handInfo.guid === guidToRemove)
                {
                    subInfo.handles.remove(i)
                }
            }
        }
    }
}