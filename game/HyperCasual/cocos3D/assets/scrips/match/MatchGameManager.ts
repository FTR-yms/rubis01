import {
  _decorator,
  Animation,
  Component,
  Input,
  input,
  KeyCode,
  Label,
  Node,
  PostProcessStage,
  Sprite,
  SpriteFrame,
  tween,
  UIOpacity,
} from "cc";
import Util from "../Common/Util";
import { MatchCard } from "./MatchCard";
import { ComboLabel } from "./ComboLabel";
import { SoundManager } from "../Common/SoundManager";
import * as custom_macro from "cc/userland/macro";
import { GameStartIntro } from "../Common/GameStartIntro";
import { FormatLabel } from "../Common/FormatLabel";
import { ResultPopup } from "../Common/ResultPopup";
import { SfxNames_Match } from "../Common/SoundNames";
import MatchGameAnimationTimes from "./MatchGameAnimationTimes";
import { ANIMATION_CONFIG } from "../Common/Constants";
import { GameEndOutro } from "../Common/GameEndOutro";
const { ccclass, property } = _decorator;

@ccclass("MatchCardInfo")
export class MatchCardInfo {
  @property
  public type: string = "";

  @property(SpriteFrame)
  public spriteFrame: SpriteFrame = null;
}

@ccclass("MatchCards")
export class MatchCards {
  @property(Node)
  public board: Node = null;

  @property(MatchCard)
  public cards: MatchCard[] = [];
}

@ccclass("MatchGameManager")
export class MatchGameManager extends Component {
  @property(GameStartIntro)
  private startIntro: GameStartIntro = null;

  @property(GameEndOutro)
  private gameEndOutro: GameEndOutro = null;

  @property(Animation)
  private endOutro: Animation = null;

  // @property(FormatLabel)
  // private roundLabel: FormatLabel = null;

  @property(FormatLabel)
  protected timeLabel: FormatLabel = null;

  @property(Sprite)
  private timeGauge: Sprite = null;

  @property(FormatLabel)
  protected scoreLabel: FormatLabel = null;

  @property
  protected gameTime: number = 60;

  @property([MatchCards])
  private matchBoards: MatchCards[] = [];

  @property(MatchCardInfo)
  private matchCardInfos: MatchCardInfo[] = [];

  @property(Label)
  private matchLabel: Label = null;

  @property(ComboLabel)
  private comboLabel: ComboLabel = null;

  @property(ResultPopup)
  private result: ResultPopup = null;

  private matchLabelOpacity: UIOpacity = null;
  private combo: number = 0;

  private matchCount: number = 0;
  private selectedCards: MatchCard[] = [];
  private isMatching: boolean = false;

  public isGameStarted: boolean = false;
  public isTimeUpdating: boolean = false;


  protected gameTimer: number = 0;
  protected score: number = 0;
  protected round: number = 0;
  protected targetRound: number = 0;

  protected get getGameCode(): string {
    return "match";
  }

  public roundStart() {
    // this.round = 2;
    this.round++;
    // this.roundLabel.setFormat(this.round);

    this.dataRefresh();
    this.intro();
  }


  public gameInit() {
    this.uiRefresh();
    this.roundStart();
  }

  protected intro() {
    SoundManager.instance.playSfxOneShot(SfxNames_Match.GameStart);
    this.startIntro.play();
    this.scheduleOnce(this.gameStart, ANIMATION_CONFIG.START_FX.TIME);
  }

  protected outro() {
    const playFinish = () => {
      this.gameEndOutro.play();
      this.scheduleOnce(() => {
        this.result.open(
          Math.floor(this.score),
        );
      }, ANIMATION_CONFIG.END_FX.TIME);
    }


    if (this.gameTimer > 0) {
      this.endOutro.node.active = true;
      this.endOutro.play();
      this.scheduleOnce(() => {
        if (this.isMissionClear() && this.round < 3) {
          this.roundStart();
        } else {
          this.endOutro.node.active = false;
          playFinish();
        }
      }, 2);
    } else {
      playFinish();
    }
  }

  protected updateTime(dt: number) {
    if (this.isGameStarted && this.isTimeUpdating) {
      this.gameTimer -= dt;

      if (this.gameTimer <= 0) {
        this.gameTimer = 0;
        this.roundEnd();
      }

      this.timeLabel.setFormat(Math.ceil(this.gameTimer));
      this.timeGauge.fillRange = this.gameTimer / this.gameTime;
    }
  }

  protected addScore(value: number) {
    this.score += value;
    this.updateScore();
  }

  protected setScore(value: number) {
    this.score = value;
    this.updateScore();
  }

  protected updateScore() {
    this.scoreLabel.setFormat(Math.floor(this.score));
  }

  public selectCard(card: MatchCard) {
    if (!this.isGameStarted) {
      return;
    }

    if (card.isOpened) {
      return;
    }

    if (this.isMatching) {
      return;
    }

    if (this.selectedCards.indexOf(card) >= 0) {
      return;
    }

    this.selectedCards.push(card);
    card.setFront();

    if (this.selectedCards.length >= 2) {
      this.isMatching = true;
      this.scheduleOnce(this.checkMatch, MatchGameAnimationTimes.flipTime);
    }
  }

  protected update(dt: number): void {
    this.updateTime(dt);
  }

  protected start() {
    if (!custom_macro.RELEASE) {
      input.on(Input.EventType.KEY_DOWN, (e) => {
        if (e.keyCode === KeyCode.KEY_Q) {
          this.matchCount = 0;
          this.roundEnd();
        }
      });
    }

    this.matchLabelOpacity = this.matchLabel.getComponent(UIOpacity);

    this.gameInit();
  }

  protected async roundEnd() {
    this.isGameStarted = false;
    this.isTimeUpdating = false;
    this.comboLabel.node.active = false;
    // await API.roundEnd(Math.floor(this.score), !this.isMissionClear());

    this.outro();
  }

  protected isMissionClear(): boolean {
    return this.matchCount <= 0;
  }

  private checkMatch() {
    this.isMatching = true;

    const type = this.selectedCards[0].type;
    let isMatch = true;

    for (let i = 1; i < this.selectedCards.length; ++i) {
      isMatch = this.selectedCards[i].type == type;
    }

    if (isMatch) {
      this.match(type);
    } else {
      this.unMatch();
    }

    for (let card of this.selectedCards) {
      if (isMatch) {
        card.match(50, this.combo);
      } else {
        card.unmatch();
      }
    }

    this.selectedCards = [];
  }

  private match(type: string) {
    SoundManager.instance.playSfxOneShot(SfxNames_Match.Match_Correct);

    this.matchCount--;
    // this.matchLabel.string = type;
    // this.matchLabel.node.active = true;
    this.isTimeUpdating = false;
    this.combo++;

    if (this.combo > 1) {
      this.comboLabel.node.active = true;
      this.comboLabel.setCombo(this.combo);
    }

    this.addScore(50 * this.combo);

    // tween(this.matchLabelOpacity)
    //   .to(0.5, { opacity: 255 })
    //   .delay(0.5)
    //   .to(1.0, { opacity: 0 })
    //   .call(() => this.matchEnd())
    //   .start();

    this.scheduleOnce(this.matchEnd, MatchGameAnimationTimes.matchWaitTime);
  }

  private unMatch() {
    SoundManager.instance.playSfxOneShot(SfxNames_Match.Match_Wrong);
    this.combo = 0;
    this.comboLabel.node.active = false;
    this.scheduleOnce(
      () => (this.isMatching = false),
      MatchGameAnimationTimes.flipTime
    );
  }

  private matchEnd() {
    this.matchLabel.node.active = false;
    this.isMatching = false;
    this.isTimeUpdating = true;

    if (this.matchCount <= 0) {
      this.roundEnd();
    }
  }

  protected uiRefresh() {
    this.gameTimer = this.gameTime;
    this.timeLabel.setFormat(Math.ceil(this.gameTimer));
    this.timeGauge.fillRange = this.gameTimer / this.gameTime;
    this.score = 0;
    this.scoreLabel.setFormat(this.score);

    this.round = 0;
    this.matchBoards[this.round].board.active = false;

    this.combo = 0;
    this.comboLabel.node.active = false;
  }

  protected dataRefresh(): void {
    this.gameTimer = this.gameTime;
    this.timeLabel.setFormat(Math.ceil(this.gameTimer));
    this.timeGauge.fillRange = this.gameTimer / this.gameTime;

    this.combo = 0;
    this.comboLabel.node.active = false;

    // this.score = 0;
    // this.scoreLabel.setFormat(this.score);

    const roundIdx = this.round - 1;

    const cardInfos = this.matchCardInfos;

    const cards = this.matchBoards[roundIdx].cards;
    this.matchCount = cards.length * 0.5;

    let selectEquipments = [...cardInfos];

    if (this.round < 3) {
      selectEquipments = Util.shuffle(selectEquipments.splice(0, 8)).splice(0, this.matchCount);
    } else {
      selectEquipments = Util.shuffle(selectEquipments).splice(0, this.matchCount);
    }

    const cardEquipments = Util.shuffle(
      selectEquipments.concat(selectEquipments)
    );

    for (let i = 0; i < this.matchBoards.length; ++i) {
      this.matchBoards[i].board.active = i == roundIdx;
    }

    for (let i = 0; i < cards.length && i < cardEquipments.length; ++i) {
      cards[i].init(
        cardEquipments[i].spriteFrame,
        cardEquipments[i].type,
        this
      );
    }

    this.selectedCards = [];
  }

  protected gameStart(): void {
    this.isGameStarted = true;
    this.isTimeUpdating = true;

    this.isTimeUpdating = false;
    const matchCards = this.matchBoards[this.round - 1].cards;
    for (let i = 0; i < matchCards.length; ++i) {
      matchCards[i].setFront();
    }

    this.scheduleOnce(() => {
      for (let i = 0; i < matchCards.length; ++i) {
        matchCards[i].setBack();
      }

      this.isTimeUpdating = true;
    }, MatchGameAnimationTimes.cardIntroTime);
  }
}
