import { _decorator, Component, Node, sp } from "cc";
import { EventManager } from "../../Common/EventManager";
import { CharacterAniName, GameEvent } from "../Util/Config";
const { ccclass, property } = _decorator;

@ccclass("Character_3Match")
export class Character_3Match extends Component {
  private spine: sp.Skeleton = null;

  private badCount: number = 0;

  onLoad() {
    this.spine = this.node.getComponent(sp.Skeleton);
  }

  start() {
    EventManager.instance.on(
      GameEvent.playCharacterAni,
      this.setAni.bind(this)
    );

    EventManager.instance.on(
      GameEvent.resetCharacterIdle,
      this.resetBadCount.bind(this)
    );

    this.spine.setCompleteListener((entry) => {
      switch (entry.animation.name) {
        case CharacterAniName.Idle:
          this.badCount++;

          if (this.badCount > 1) {
            this.setAni(CharacterAniName.Bad, true);
          }
          break;
        case CharacterAniName.Good:
          this.setAni(CharacterAniName.Idle, true);
          break;
        case CharacterAniName.QuizIn:
          this.setAni(CharacterAniName.QuizLoop, true);
          break;
        case CharacterAniName.QuizO:
        case CharacterAniName.QuizX:
          break;
      }
    });
  }

  private resetBadCount() {
    if (this.badCount > 0) {
      this.setAni(CharacterAniName.Idle, true);
    }

    this.badCount = 0;
  }

  private setAni(name: string, loop: boolean) {
    this.spine.setAnimation(0, name, loop);
  }
}
