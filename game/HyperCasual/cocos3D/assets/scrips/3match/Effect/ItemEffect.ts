import { _decorator, Component, Node, sp, Vec2 } from "cc";
import { EventManager } from "../../Common/EventManager";
import { ActionManager_3Match } from "../Game/ActionManager_3Match";
import { ActionType, GameEvent, ItemAniName } from "../Util/Config";
const { ccclass, property } = _decorator;

@ccclass("ItemEffect")
export class ItemEffect extends Component {
  private spine: sp.Skeleton = null;

  private callBack: Function = null;

  protected onLoad() {
    this.spine = this.node.getComponent(sp.Skeleton);
  }

  protected start() {
    this.spine.setCompleteListener((entry) => {
      EventManager.instance.emit(GameEvent.poolingItemEffect, this);
      if (this.callBack) {
        this.callBack();
      }
      ActionManager_3Match.instance.countDown(ActionType.effect);
    });
  }

  public setEffect(pos: Vec2, type: string, callBack?: Function) {
    switch (type) {
      case ItemAniName.WatchH:
        this.node.setPosition(0, pos.y);
        break;
      case ItemAniName.WatchV:
        this.node.setPosition(pos.x, 0);
        break;
      case ItemAniName.Fold:
      case ItemAniName.Flip:
        this.node.setPosition(0, 0);
        break;
    }

    const track = this.spine.setAnimation(0, type, false);
    console.log(track.animationEnd);

    this.callBack = callBack;
  }
}
