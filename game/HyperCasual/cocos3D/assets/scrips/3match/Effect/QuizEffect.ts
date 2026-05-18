import { _decorator, Component, Node, sp } from "cc";
import { EventManager } from "../../Common/EventManager";
import { CharacterAniName, GameEvent, GameState } from "../Util/Config";
import Store from "../Util/Store";
const { ccclass, property } = _decorator;

@ccclass("QuizEffect")
export class QuizEffect extends Component {
  private spine: sp.Skeleton = null;

  private isEnd: boolean = false;

  onLoad() {
    this.spine = this.node.getComponent(sp.Skeleton);
  }

  start() {
    EventManager.instance.on(
      GameEvent.showQuizTextEffect,
      this.setEffect.bind(this)
    );

    this.spine.setCompleteListener((entry) => {
      if (this.isEnd) {
        EventManager.instance.emit(GameEvent.openEndQuizBoard);
      } else {
        EventManager.instance.emit(GameEvent.openQuizBoard);
      }

      EventManager.instance.emit(GameEvent.playCharacterAni, CharacterAniName.QuizIn);

      this.node.active = false;
    });

    this.node.active = false;
  }

  public setEffect(isEnd: boolean) {
    this.node.active = true;
    this.isEnd = isEnd;
    Store.gameState = GameState.Quiz;
    this.spine.setAnimation(0, "i_quiztime_text", false);
  }
}
