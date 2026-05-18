import {
  _decorator,
  Component,
  Node,
  SpriteFrame,
  SpriteComponent,
  Enum,
} from "cc";
import { Pool } from "../../Common/Pool";
const { ccclass, property } = _decorator;

enum Order {
  left,
  Middle,
  Right,
}

@ccclass("ScoreEffectFont")
export class ScoreEffectFont extends Component {
  @property({ type: SpriteFrame })
  private fontSprite: SpriteFrame[] = [];

  @property({ type: Enum(Order) })
  private order: Order = Order.Middle;

  @property
  private spacing: number = 48;

  @property({ type: Pool })
  private fontPool: Pool = null;

  private fonts: Node[] = [];

  public setFont(time: number) {
    let fontStr: string = Math.floor(time).toString();
    let fontLen: number = fontStr.length;
    for (let i = 0; i < fontLen; ++i) {
      if (this.fonts.length < fontLen) {
        let shortLen = fontLen - this.fonts.length;

        for (let j = 0; j < shortLen; ++j) {
          let node: Node = this.fontPool.get() as Node;
          this.fonts.push(node);
        }
      } else if (this.fonts.length > fontLen) {
        this.fontPool.return(this.fonts.pop());
      }

      let font: SpriteComponent = this.fonts[i].getComponent(SpriteComponent);
      font.spriteFrame = this.fontSprite[parseInt(fontStr[i])];

      switch (this.order) {
        case Order.left:
          {
            this.fonts[i].setPosition(i * this.spacing, 0);
          }
          break;
        case Order.Middle:
          {
            this.fonts[i].setPosition(
              -(this.spacing / 2) * (fontLen - 1) + i * this.spacing,
              0
            );
          }
          break;
        case Order.Right:
          {
            this.fonts[i].setPosition((fontLen - 1 - i) * -this.spacing, 0);
          }
          break;
      }
    }
  }
}
