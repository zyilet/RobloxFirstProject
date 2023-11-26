import { UIPanel } from "./UIPanel"

export class UIPanelStack
{
    private panelInfos: [string, UIPanel][] = []

    public GetDepth()
    {
        return this.panelInfos.size()
    }

    public Push(panelInfo: [string, UIPanel])
    {
        this.panelInfos.push(panelInfo)
    }

    public Pop()
    {
        if (this.panelInfos.size() === 0)
        {
            error("试图从一个空的ui栈中出栈元素")
        }

        return this.panelInfos.pop()!
    }

    public Peek(depth: number = 1)
    {
        if (depth > this.panelInfos.size())
        {
            error("检查深度大于ui栈的实际深度")
        }

        let peekIndex = this.panelInfos.size() - depth

        return this.panelInfos[peekIndex]
    }

    public Exist(name: string)
    {
        for (const panelInfo of this.panelInfos)
        {
            let [curName, _] = panelInfo
            if (curName === name)
            {
                return true
            }
        }
        return false
    }
}