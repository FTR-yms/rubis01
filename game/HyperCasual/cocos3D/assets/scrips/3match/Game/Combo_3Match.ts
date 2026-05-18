import {
  _decorator,
  Component,
  Node,
  Color,
  ColorKey,
  Sprite,
  UITransform,
  Vec3,
  Label,
} from "cc";
import { EventManager } from "../../Common/EventManager";
import {
  ComboEffectTime,
  ComboMaxTime,
  GameEvent,
  GameState,
  MaxCombo,
  SFXSound,
} from "../Util/Config";
import Store from "../Util/Store";
const { ccclass, property } = _decorator;

@ccclass("Combo_3Match")
export class Combo_3Match extends Component {
  @property({ type: Sprite })
  private boardEdge: Sprite = null;

  @property({ type: Label })
  private label: Label = null;

  @property({ type: Node })
  private base: Node = null;

  private color: Color = new Color(255, 255, 255, 0);

  private isPlaying: boolean = false;
  private effectTime: number = 0;
  private comboTime: number = 0;

  private isPause : boolean = false;

  private ratio: number = 0;

  protected start(): void {
    EventManager.instance.on(GameEvent.addCombo, this.addCombo.bind(this));
    EventManager.instance.on(GameEvent.pauseCombo, this.pauseCombo.bind(this));
    EventManager.instance.on(GameEvent.resumeCombo, this.resumeCombo.bind(this));
  }

  public reset(){
    this.isPlaying = false;
    this.effectTime = 0;

    this.color = new Color(255, 255, 255, 0);
    this.boardEdge.color = this.color;

    this.base.active = false;

    Store.combo = 0;
    this.label.string = Store.combo.toString();
  }

  debug: boolean = false;
  protected update(deltaTime: number): void {
    if (Store.gameState !== GameState.Play || this.isPause) {
      return;
    }

    if (this.isPlaying) {
      this.effectTime += deltaTime;
      if (this.effectTime < ComboEffectTime) {
        this.ratio = this.effectTime / ComboEffectTime;
        this.color.a = this.ratio * 255;
        this.boardEdge.color = this.color;
      } else {
        this.comboTime += deltaTime;
        if (this.comboTime >= ComboMaxTime) {
          this.endCombo();
        }
      }
    } else {
      if (this.effectTime > 0) {
        this.effectTime -= deltaTime;
        this.ratio = this.effectTime / ComboEffectTime;
        this.color.a = this.ratio * 255;
        this.boardEdge.color = this.color;
      }
    }
  }

  private addCombo(): void {
    Store.combo++;
    this.label.string = Store.combo.toString();
    this.isPause = false;

    if (this.isPlaying) {
      this.comboTime = 0;
    } else {
      this.base.active = true;
      this.isPlaying = true;
      this.effectTime = 0;
      this.comboTime = 0;
    }
  }

  private endCombo(): void {
    this.isPlaying = false;
    this.effectTime = ComboEffectTime;
    this.base.active = false;
    Store.combo = 0;
  }
  
  private pauseCombo(){
    this.isPause = true;
  }

  private resumeCombo(){
    this.isPause = false;
  }
}
