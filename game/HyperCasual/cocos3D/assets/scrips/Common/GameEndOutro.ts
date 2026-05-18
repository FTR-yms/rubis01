import {
  _decorator,
  Color,
  Component,
  Node,
  sp,
  Sprite,
  tween,
  UIOpacity,
} from "cc";
import { SoundManager } from "./SoundManager";
import { SfxNames_Match } from "./SoundNames";
import { ANIMATION_CONFIG } from "./Constants";
const { ccclass, property } = _decorator;

@ccclass("GameEndOutro")
export class GameEndOutro extends Component {
  @property(sp.Skeleton)
  private spine: sp.Skeleton = null;

  @property(UIOpacity)
  private dim: UIOpacity = null;

  private originalOpacity: number = 0;

  protected onLoad(): void {
    this.originalOpacity = this.dim.opacity;
  }

  play() {
    this.node.active = true;
    this.dim.opacity = 0;
    const track = this.spine.setAnimation(0, ANIMATION_CONFIG.END_FX.NAME, false);
    this.scheduleOnce(() => {
      this.node.active = false;
    }, track.animationEnd);
    tween(this.dim)
      .to(0.5, { opacity: this.originalOpacity })
      .start();
  }
}
