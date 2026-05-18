import { _decorator, Component, Label, Node } from "cc";
import Util from "./Util";
import { SetFormat } from "./SetFormat";
const { ccclass, property } = _decorator;

@ccclass("FormatLabel")
export class FormatLabel extends SetFormat {
  @property(Label)
  protected label: Label = null;

  public override setFormat(...args: any[]) {
    this.label.string = Util.formatString(this.format, ...args);
  }

  protected onLoad() {
    if (!this.label) {
      this.label = this.getComponent(Label);
    }
  }
}
