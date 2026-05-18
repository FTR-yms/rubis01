import { _decorator, Animation, Component, Label, Node } from "cc";
import { FormatLabel } from "../Common/FormatLabel";
const { ccclass, property } = _decorator;

@ccclass("ComboLabel")
export class ComboLabel extends Component {
  @property(FormatLabel)
  public comboCountLabel: FormatLabel = null;

  @property(Animation)
  public animation: Animation = null;

  public setCombo(combo: number) {
    this.comboCountLabel.setFormat(combo);
    this.animation.play();
  }
}
