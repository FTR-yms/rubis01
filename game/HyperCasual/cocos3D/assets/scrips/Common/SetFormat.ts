import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SetFormat")
export abstract class SetFormat extends Component {
  @property({ multiline: true })
  protected format: string = "{0}";

  public abstract setFormat(...args: any[]);
}
