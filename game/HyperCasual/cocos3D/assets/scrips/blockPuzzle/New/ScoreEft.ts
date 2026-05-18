import { _decorator, Component, Node, sp, tween, Vec2, Vec3 } from 'cc';
import { BlockMatchEft } from './BlockManager_BlockPuzzle';
import Util from '../../Common/Util';
const { ccclass, property } = _decorator;

@ccclass('ScoreEft')
export class ScoreEft extends Component {

    private skeleton : sp.Skeleton = null;

    private get Skeleton() : sp.Skeleton
    {
        return Util.getDefault(this.skeleton, this.getComponent(sp.Skeleton));
    }

    public show(blockEftType : BlockMatchEft, pos : Vec3)
    {
        this.node.active = true;
        this.node.setWorldPosition(pos);

        if (blockEftType == BlockMatchEft.Normal)
        {
            this.Skeleton.setSkin("05_effect");
        }
        else
        {
            this.Skeleton.setSkin("15_effect");
        }
        this.Skeleton.setAnimation(0, "animation", false);

    }
}

