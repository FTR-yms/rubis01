import { _decorator, Animation, Component, Label, Node, ParticleSystem2D } from 'cc';
import { FormatLabel } from '../Common/FormatLabel';
const { ccclass, property } = _decorator;

@ccclass('MatchEffect')
export class MatchEffect extends Component {
    @property(Animation)
    private animation: Animation = null;

    @property(FormatLabel)
    private scoreLabel: FormatLabel = null;

    @property(FormatLabel)
    private comboLabel: FormatLabel = null;

    @property(ParticleSystem2D)
    private particle: ParticleSystem2D = null;

    public play() {
        this.animation.play();
        this.particle.resetSystem();
    }

    public setValue(score: number, combo: number) {
        this.scoreLabel.setFormat(score);
        this.comboLabel.setFormat(combo);
    }
}


