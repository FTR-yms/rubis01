import {
  _decorator,
  Component,
  Node,
  SpriteFrame,
  SpriteComponent,
  math,
  EventKeyboard,
  Sprite,
  UITransform,
  Vec2,
  Label,
  Prefab,
} from "cc";
import { EventManager } from "../../Common/EventManager";
import {
  Bgm,
  GameEvent,
  GameState,
  ItemType,
  NormalComeSpeed,
  PlayTime,
  QuizPlayTime,
  QuizTime,
  ScoreBonusTime,
  TimerBonusTime,
} from "../Util/Config";
import Store from "../Util/Store";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_3Match } from "../../Common/SoundNames";
const { ccclass, property } = _decorator;

@ccclass("Timer_3Match")
export class Timer_3Match extends Component {
  @property({ type: SpriteComponent })
  private gauges: SpriteComponent[] = [];

  @property({ type: Node })
  private itemBase: Node = null;

  @property({ type: UITransform })
  private mask: UITransform = null;

  @property({ type: Label })
  private number: Label = null;

  @property({ type: Sprite })
  private itemGauge: Sprite = null;

  private item: { active: boolean; time: number }[] = [
    { active: false, time: 0 },
    { active: false, time: 0 },
  ];

  private contentSize: math.Size = math.Size.ZERO;

  private normalTimer: number = PlayTime;
  private playTimer: number = this.normalTimer;
  private maxTime: number = PlayTime;
  private isPause = true;

  private isOnQuiz: boolean[] = [];
  private test: number = 1;

  private hurryUp: boolean = false;

  protected start(): void {
    EventManager.instance.on(
      GameEvent.addPlayTime,
      this.addPlayTime.bind(this)
    );


    EventManager.instance.on(GameEvent.onBonusScore, () => {
      this.item[ItemType.Score].active = true;
      this.item[ItemType.Score].time = ScoreBonusTime;
    });
    EventManager.instance.on(GameEvent.pauseTimer, this.pauseTimer.bind(this));
    EventManager.instance.on(
      GameEvent.resumeTimer,
      this.resumeTimer.bind(this)
    );
    this.contentSize = this.mask.contentSize.clone();
  }

  protected update(deltaTime: number): void {
    if (Store.gameState === GameState.AddTime) {
      if (this.normalTimer < this.playTimer) {
        if (!this.isPause) {
          this.normalTimer += deltaTime * NormalComeSpeed;
        }

        if (this.normalTimer > this.playTimer) {
          this.normalTimer = this.playTimer;
          Store.gameState = GameState.Play;
        }

        this.gauges.forEach((gauge) => {
          gauge.fillRange = this.getFillRange();
        });

        this.number.string = `${Math.floor(
          this.normalTimer + this.item[ItemType.Timer].time
        )}`;
      }
    } else if (Store.gameState === GameState.Play) {
      if (!this.isPause) {
        if (this.item[ItemType.Timer].active) {
          this.itemAction(deltaTime, ItemType.Timer);
        } else {
          this.playTimer -= deltaTime * this.test;
          this.playTimer = Math.max(this.playTimer, 0);
          this.normalTimer = this.playTimer;

          if (this.playTimer <= 10 && !this.hurryUp) {
            this.hurryUp = true;
            SoundManager.instance.playSfx(SfxNames_3Match.HurryUp, true);
          }

          if (this.playTimer <= 0) {
            this.timeOut();
          }
        }

        if (this.item[ItemType.Score].active) {
          this.itemAction(deltaTime, ItemType.Score);
        }
        this.gauges.forEach((gauge) => {
          gauge.fillRange = this.getFillRange();
        });
        this.number.string = `${Math.floor(
          this.normalTimer + this.item[ItemType.Timer].time
        )}`;
      }
    }
  }

  public gameStart(scoreItem: boolean, timerItem: boolean): void {
    this.item[ItemType.Timer].active = timerItem;
    this.item[ItemType.Score].active = scoreItem;

    if (timerItem) {
      this.itemBase.active = true;
      this.item[ItemType.Timer].time = TimerBonusTime;

      this.itemGauge.fillRange = 1;
      this.mask.contentSize = new math.Size(
        this.itemGauge.fillRange * this.contentSize.x,
        this.contentSize.y
      );
    }

    if (scoreItem) {
      this.item[ItemType.Score].time = ScoreBonusTime;
    }

    this.normalTimer = PlayTime;
    this.playTimer = this.normalTimer;
    this.maxTime = this.normalTimer + this.item[ItemType.Timer].time;

    this.gauges.forEach((gauge) => {
      gauge.fillRange = this.getFillRange();
    });
    this.number.string = `${Math.floor(
      this.normalTimer + this.item[ItemType.Timer].time
    )}`;

    // for (let i = 0; i < QuizTime.length; ++i) {
    //   let quizPoint: Sprite = this.quizPointPool.get().getComponent(Sprite);
    //   quizPoint.node.setPosition(
    //     this.contentSize.x * (QuizTime[i] / this.maxTime),
    //     0
    //   );
    //   this.quizPoints.push(quizPoint);
    // }
  }

  public reset() {
    this.isOnQuiz = [];
    this.isPause = true;
    this.hurryUp = false;

    this.itemBase.active = false;

    if (this.contentSize.equals(math.Size.ZERO)) {
      this.contentSize = this.mask.contentSize.clone();
    }

    for (let i = 0; i < QuizTime.length; ++i) {
      this.isOnQuiz.push(false);
    }

    this.item[ItemType.Timer].time = 0;
    this.item[ItemType.Score].time = 0;

    SoundManager.instance.stopSfx(SfxNames_3Match.HurryUp);
  }

  private getFillRange(): number {
    return this.normalTimer / this.maxTime;
  }

  private pauseTimer(): void {
    this.isPause = true;
  }

  private resumeTimer(): void {
    this.isPause = false;
  }

  private timeOut(): void {
    SoundManager.instance.stopSfx(SfxNames_3Match.HurryUp);
    // EventManager_3Match.instance.emit(GameEvent.showQuizTextEffect, true);
    EventManager.instance.emit(GameEvent.gameOver);
  }

  private addPlayTime(time: number): void {
    Store.gameState = GameState.AddTime;

    this.playTimer += time;
    this.playTimer = Math.min(this.playTimer, PlayTime);

    if (this.playTimer > 10) {
      this.hurryUp = false;
      SoundManager.instance.stopSfx(SfxNames_3Match.HurryUp);
    }
  }

  private itemAction(deltaTime: number, type: ItemType) {
    this.item[type].time -= deltaTime * this.test;

    switch (type) {
      case ItemType.Timer:
        this.itemGauge.fillRange =
          (this.item[type].time + PlayTime) / this.maxTime;

        this.mask.contentSize = new math.Size(
          this.itemGauge.fillRange * this.contentSize.x,
          this.contentSize.y
        );
        break;
      case ItemType.Score:
        break;
    }

    if (this.item[type].time <= 0) {
      this.endItemAction(type);
    }
  }

  private endItemAction(type: ItemType) {
    this.item[type].active = false;
    this.item[type].time = 0;

    switch (type) {
      case ItemType.Timer:
        this.itemBase.active = false;
        break;
      case ItemType.Score:
        EventManager.instance.emit(GameEvent.offBonusScore);
        break;
    }
  }
}
