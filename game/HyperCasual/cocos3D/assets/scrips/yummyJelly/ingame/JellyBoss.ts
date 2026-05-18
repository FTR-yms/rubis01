import { _decorator, Component, Node, sp } from 'cc';
import { EventManager } from '../../Common/EventManager';
const { ccclass, property } = _decorator;

@ccclass('JellyBoss')
export class JellyBoss extends Component {
    @property(sp.Skeleton)
    private bossRenderer: sp.Skeleton = null;

    protected start(): void {
        EventManager.instance.node.on('jellyEat', () => {
            this.bossRenderer.setAnimation(0, "mouth_close", false);
            this.bossRenderer.addAnimation(0, "idle_basic", true);

            // SoundManager.Instance.playSound('missionclear2');
        });
    }

    public eat() {
        this.bossRenderer.setAnimation(0, "mouth_open", false);
        this.bossRenderer.addAnimation(0, "mouth_eat", true);
    }
}


