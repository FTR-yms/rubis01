import { _decorator, Component, Node, Color, Sprite, Vec2, math } from "cc";
import { EventManager } from "../../Common/EventManager";
import { GameEvent, GameState, ScoreEffectTime, ScorePlayTime } from "../Util/Config";
import Store from "../Util/Store";
import { ScoreEffectFont } from "./ScoreEffectFont";
const { ccclass, property } = _decorator;

@ccclass("ScoreEffect")
export class ScoreEffect extends Component {
  @property({ type: ScoreEffectFont })
  private imageFont: ScoreEffectFont = null;

  private sprite: Sprite = null;

  private effectTime: number = 0;
  private playTime: number = 0;

  private isPlaying: boolean = false;

  private alpha: number = 0;
  private ratio: number = 0;

  protected onLoad(): void {
    this.sprite = this.node.getComponent(Sprite);
    this.sprite.color = new Color(255, 255, 255, 0);
  }

  update(deltaTime: number) {
    if (Store.gameState !== GameState.Play) {
      return;
    }

    if (this.isPlaying) {
      if (this.effectTime < ScoreEffectTime) {
        this.effectTime += deltaTime;
        this.ratio = this.effectTime / ScoreEffectTime;
        this.alpha = this.ratio * 255;
        this.setAlpha();
      } else {
        this.playTime += deltaTime;
        if (this.playTime >= ScorePlayTime) {
          this.isPlaying = false;
        }
      }
    } else {
      this.effectTime -= deltaTime;
      this.ratio = this.effectTime / ScoreEffectTime;
      this.alpha = this.ratio * 255;
      this.setAlpha();

      if (this.effectTime <= 0) {
        EventManager.instance.emit(GameEvent.poolingScoreEffect, this);
      }
    }
  }

  public setEffect(addScore: number, pos: Vec2) {
    this.node.setPosition(pos.x, pos.y);
    this.imageFont.setFont(addScore);
    this.isPlaying = true;
    this.effectTime = 0;
    this.playTime = 0;
    this.alpha = 0;
    this.setAlpha();
  }

  private setAlpha() {
    this.alpha = math.clamp(this.alpha, 0, 255);
    this.sprite.color = new Color(255, 255, 255, this.alpha);
  }
}
