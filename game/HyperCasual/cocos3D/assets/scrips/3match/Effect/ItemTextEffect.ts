import { _decorator, Component, Node, sp } from "cc";
import { EventManager } from "../../Common/EventManager";
import { GameEvent, ItemAniName } from "../Util/Config";
const { ccclass, property } = _decorator;

@ccclass("ItemTextEffect")
export class ItemTextEffect extends Component {
  private spine: sp.Skeleton;

  private callBack: Function = null;

  protected onLoad() {
    this.spine = this.node.getComponent(sp.Skeleton);

    this.spine.setCompleteListener((entry) => {
      this.node.active = false;
      this.callBack();
    });
  }

  protected start() {
    EventManager.instance.on(
      GameEvent.showItemTextEffect,
      this.setItemText.bind(this)
    );

    this.node.active = false;
  }

  private setItemText(type: string, callBack?: Function) {
    this.node.active = true;

    if (type === ItemAniName.Flip) {
      this.spine.setAnimation(0, "01_flip_z", false);
    } else if (type === ItemAniName.Fold) {
      this.spine.setAnimation(0, "02_fold_z", false);
    }

    if (callBack) {
      this.callBack = callBack;
    }
  }
}
