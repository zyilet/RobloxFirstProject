import { RunService, Workspace } from "@rbxts/services";

export class Transform {
    //在局部坐标系中进行位移
    static MoveInLocal(cFrame: CFrame, distance: Vector3): CFrame {
        return cFrame.ToWorldSpace(new CFrame(distance));
    }

    //返回局部坐标系中的某个位置所对应的世界坐标系中的位置。
    static PointLocalToWorld(cFrame: CFrame, point: Vector3): Vector3 {
        return cFrame.ToWorldSpace(new CFrame(point)).Position;
    }

    static DrawLine(startPosGetter: () => Vector3, endPosGetter: () => Vector3) {

        let part = new Instance("Part");
        part.Anchored = true;
        part.CanCollide = false;
        part.Material = Enum.Material.Neon;
        part.Color = new Color3(0, 1, 1);

        let updateTimer = 0;
        let updateInterval = 0.1;
        let connection = RunService.Heartbeat.Connect(dt => {
            updateTimer += dt;
            if (updateTimer < updateInterval)
                return;
            updateTimer = 0;

            let startPos = startPosGetter();
            let endPos = endPosGetter();
            let length = endPos.sub(startPos).Magnitude;

            part.Size = new Vector3(0.1, 0.1, length);
            part.CFrame = new CFrame(startPos, endPos);
            part.CFrame = this.MoveInLocal(part.CFrame, new Vector3(0, 0, -length / 2));
            part.Parent = Workspace;
        })

        return connection;
    }
}