import {
  _decorator,
  Component,
  Node,
  JsonAsset,
  resources,
} from "cc";
import { Board_3Match } from "../Game/Board_3Match";
import { EventManager } from "../../Common/EventManager";
import { ActionType, GameEvent, GameState, SFXSound } from "../Util/Config";
import { ActionManager_3Match } from "../Game/ActionManager_3Match";
import Store from "../Util/Store";
import { Timer_3Match } from "../Game/Timer_3Match";
import { Score_3Match } from "../Game/Score_3Match";
import { Combo_3Match } from "../Game/Combo_3Match";
import { ResultPopup } from "../../Common/ResultPopup";
import { GameStartIntro } from "../../Common/GameStartIntro";
import { ANIMATION_CONFIG } from "../../Common/Constants";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_3Match } from "../../Common/SoundNames";
import { GameEndOutro } from "../../Common/GameEndOutro";
const { ccclass, property } = _decorator;

@ccclass("GameManager_3Match")
export class GameManager_3Match extends Component {
  @property({ type: Node })
  private inGame: Node = null;

  @property({ type: Board_3Match })
  private board: Board_3Match = null;

  @property({ type: Timer_3Match })
  private timer: Timer_3Match = null;

  @property({ type: Combo_3Match })
  private combo: Combo_3Match = null;

  @property({ type: Score_3Match })
  private score: Score_3Match = null;

  @property(GameStartIntro)
  private startIntro: GameStartIntro = null;

  @property(GameEndOutro)
  private endOutro: GameEndOutro = null;

  @property(ResultPopup)
  private result: ResultPopup = null;

  async start() {
    EventManager.instance.on(GameEvent.gameOver, this.gameOver.bind(this));
    EventManager.instance.on(GameEvent.gameStart, this.gameStart.bind(this));

    ActionManager_3Match.instance.addAction(ActionType.match, ActionType.match);
    ActionManager_3Match.instance.addAction(ActionType.fall, ActionType.fall);
    ActionManager_3Match.instance.addAction(ActionType.effect, ActionType.effect);

    // Store.server.loading = this.loading;

    // this.mainStart();
    this.gameStart();
  }

  public async gameStart() {

    SoundManager.instance.playSfxOneShot(SfxNames_3Match.GameStart);
    this.startIntro.play();
    this.scheduleOnce(() => {
      EventManager.instance.emit(GameEvent.poolingAllObject);

      Store.gameState = GameState.Play;
      this.score.gameStart(false, false);
      this.timer.gameStart(false, false);
      this.board.gameStart(false);

      this.inGame.active = true;
    }, ANIMATION_CONFIG.START_FX.TIME);
  }

  private async gameOver() {
    Store.gameState = GameState.End;

    let newRecord: boolean = false;

    this.endOutro.play();
    this.scheduleOnce(() => {
      this.result.open(Store.score);
    }, ANIMATION_CONFIG.END_FX.TIME);

    this.timer.reset();
    this.score.reset();
    this.combo.reset();


    // await Store.server.gameOver(Store.score + bonusScore).then((res) => {
    //   newRecord = res.data.result.is_new_record;
    // });

    // await Store.server.leaderBoard().then((res) => {
    //   const result = res.data.result;

    //   if (res.data.result.is_new_record) {
    //     Sound.instance.playSFX(SFXSound.HighScore);
    //   } else {
    //     Sound.instance.playSFX(SFXSound.GameOver);
    //   }

    //   this.result.init(Store.score, bonusScore, isQuizComplete, result);

    //   this.timer.reset();
    //   this.score.reset();
    //   this.combo.reset();
    // });
  }
}
