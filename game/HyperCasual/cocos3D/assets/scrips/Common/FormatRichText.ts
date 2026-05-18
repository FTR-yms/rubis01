import { _decorator, Color, Component, Node, RichText } from "cc";
import { SetFormat } from "./SetFormat";
import Util from "./Util";
const { ccclass, property } = _decorator;

@ccclass("ColorFormat")
export class ColorFormat {
  @property
  public index: number = 0;

  @property(Color)
  public color: Color = null;
}

@ccclass("FormatRichText")
export class FormatRichText extends SetFormat {
  @property(RichText)
  protected label: RichText = null;

  @property(ColorFormat)
  private colorFormats: ColorFormat[] = [];

  public override setFormat(...args: any[]) {
    let result = this.format;

    for (let i = 0; i < args.length; i++) {
      const value = args[i].toString();

      const colorFormat = this.colorFormats.find((cf) => cf.index === i);
      const colorHex = colorFormat ? colorFormat.color.toHEX("#rrggbb") : null;

      const coloredValue = colorHex
        ? `<color=${colorHex}>${value}</color>`
        : value;

      result = result.replace(new RegExp(`\\{${i}\\}`, "g"), coloredValue);
    }

    this.label.string = result;
  }

  protected onLoad() {
    if (!this.label) {
      this.label = this.getComponent(RichText);
    }
  }
}
