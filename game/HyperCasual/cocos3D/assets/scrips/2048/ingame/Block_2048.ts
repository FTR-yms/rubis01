import { _decorator, Component, Vec2, tween, UIOpacity, v3, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block_2048')
export class Block_2048 extends Component {
    @property(sp.Skeleton) private spine: sp.Skeleton = null!;
    @property(sp.Skeleton) private mergeEffect: sp.Skeleton = null!;

    public value: number = 2;
    public upgraded: boolean = false;
    public upgradeMoved: boolean = false;

    private uiOpacity: UIOpacity = null!;

    onLoad() { this.uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity); }

    setNumber(num: number) {
        this.value = num;
        this.spine.setSkin({ 2: '01_2', 4: '02_4', 8: '03_8', 16: '04_16', 32: '05_32', 64: '06_64', 128: '07_128', 256: '08_256', 512: '09_512', 1024: '10_1024', 2048: '11_2048', 4096: '12_4096' }[num] || '01_2');
    }

    reset() {
        tween(this.node).stop();
        this.upgraded = false;
        this.upgradeMoved = false;
        this.uiOpacity.opacity = 0;
    }

    setPosition(pos: Vec2) { this.node.setPosition(pos.x, pos.y, 0); }

    playMoveAction(pos: Vec2) {
        tween(this.node).to(0.1, { position: v3(pos.x, pos.y, 0) }).start();
    }

    stopAction() {
        tween(this.node).stop();
        // cancel 시점에 upgradeMoved(사라지는 중)였다면 
        // 이미 맵에서는 제거된 객체이므로 즉시 비활성화해서 풀로 보냅니다.
        if (this.upgradeMoved) {
            this.upgradeMoved = false;
            this.node.active = false;
        }
    }

    upgrade() {
        this.value *= 2;
        if (this.value > 4096) {
            this.value = 2;
        }

        this.upgraded = true;
        this.merged();
    }

    upgradeOut(pos: Vec2, onComplete?: Function) {
        this.upgradeMoved = true;
        // 0.1초도 연타 시에는 길 수 있으므로, stopAction과의 연동이 중요합니다.
        tween(this.node)
            .to(0.1, { position: v3(pos.x, pos.y, 0) })
            .call(() => {
                this.upgradeMoved = false;
                if (onComplete) onComplete();
            })
            .start();
    }

    in() {
        this.uiOpacity.opacity = 255;
        this.spine.setAnimation(0, 'block_in', false);
        this.spine.addAnimation(0, 'block_idle', true);
    }

    merged() {
        this.uiOpacity.opacity = 255;
        this.setNumber(this.value);
        this.spine.setAnimation(0, 'block_merge', false);
        this.spine.addAnimation(0, 'block_idle', true);
        if (this.mergeEffect) {
            this.mergeEffect.node.active = true;
            this.mergeEffect.setAnimation(0, 'merge', false);
        }
    }

    endTurn() {
        this.upgraded = false;
    }

    gameOver() { this.uiOpacity.opacity = 255; this.spine.setAnimation(0, 'block_idle', true); }
}