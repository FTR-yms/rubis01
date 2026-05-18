import { _decorator, Component, Node, Vec2, Label } from "cc";
import { EventManager } from "../../Common/EventManager";
import {
  BonusRate,
  ScoreBonusRate,
  GameEvent,
  ScoreBonusTime,
  GameState,
} from "../Util/Config";
import Store from "../Util/Store";
const { ccclass, property } = _decorator;

@ccclass("Score")
export class Score_3Match extends Component {
  // @property({ type: ImageFont })
  // private iamgeFont: ImageFont = null;

  @property({ type: Label })
  private label: Label = null;

  @property({ type: Node })
  private boost: Node = null;

  private bonusRate: number = 1;

  start() {
    EventManager.instance.on(GameEvent.addScore, this.addScore.bind(this));
    EventManager.instance.on(
      GameEvent.onBonusScore,
      this.onBonusScore.bind(this)
    );
    EventManager.instance.on(
      GameEvent.offBonusScore,
      this.offBonusScore.bind(this)
    );
  }

  public gameStart(item1: boolean, item2: boolean): void {
    //this.iamgeFont.setFont(Store.score);
    if (item1 || item2) {
      this.boost.active = true;
    }

    if (item1) {
      this.bonusRate += ScoreBonusRate;
    }

    if (item2) {
      this.bonusRate += ScoreBonusRate;
    }
  }

  public reset(){
    Store.score = 0;
    this.label.string = Store.score.toString();

    this.bonusRate = 1;
    this.boost.active = false;
  }

  private addScore(score: number, centerPos: Vec2) {
    let addScore: number = score * this.bonusRate;
    Store.score += Math.floor(addScore);
    // EventManager_3Match.instance.emit(
    //   GameEvent.createScoreEffect,
    //   addScore,
    //   centerPos
    // );

    this.label.string = Store.score.toString();
    //this.iamgeFont.setFont(Store.score);
  }

  private onBonusScore(rate: number) {
    this.boost.active = true;
    this.bonusRate += rate;
  }

  private offBonusScore() {
    this.boost.active = false;
    this.bonusRate = 1;
  }
}
