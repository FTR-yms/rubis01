import {
  _decorator,
  Animation,
  Component,
  Node,
  ParticleSystem2D,
  Sprite,
  SpriteFrame,
  UIOpacity,
} from "cc";
import { MatchGameManager } from "./MatchGameManager";
import { MatchEffect } from "./MatchEffect";
import { SoundManager } from "../Common/SoundManager";
import { SfxNames_Match } from "../Common/SoundNames";
import MatchGameAnimationTimes from "./MatchGameAnimationTimes";
const { ccclass, property } = _decorator;

@ccclass("MatchCard")
export class MatchCard extends Component {
  @property(Animation)
  private animation: Animation = null;

  @property(Sprite)
  private enquirment: Sprite = null;

  @property(Node)
  private frontNode: Node = null;

  @property(Node)
  private backNode: Node = null;

  @property(MatchEffect)
  private matchEffect: MatchEffect = null;

  @property(UIOpacity)
  private uiopacity: UIOpacity = null;


  private readonly card_flip_front: string = "cardFlip_BackToFront";
  private readonly card_flip_back: string = "cardFlip_FrontToBack";
  private readonly card_fadeOut: string = "cardFadeOut";

  private gameManager: MatchGameManager = null;

  private _type: string = "";

  public get type() {
    return this._type;
  }

  public get isOpened() {
    return this.frontNode.active;
  }

  public init(spriteFrame: SpriteFrame, type: string, gm: MatchGameManager) {
    this.node.active = true;
    this.animation.stop();
    this.node.setScale(1, 1);
    this.uiopacity.opacity = 255;
    this.frontNode.active = false;
    this.backNode.active = true;

    this._type = type;
    this.gameManager = gm;
    this.enquirment.spriteFrame = spriteFrame;
    this.matchEffect.node.active = false;
  }

  public setFront() {
    SoundManager.instance.playSfxOneShot(SfxNames_Match.CardFlip);
    this.animation.play(this.card_flip_front);
  }

  public setBack() {
    SoundManager.instance.playSfxOneShot(SfxNames_Match.CardFlip);
    this.animation.play(this.card_flip_back);
  }

  public match(score: number, combo: number) {
    this.matchEffect.node.active = true;
    this.matchEffect.setValue(score, combo);
    this.matchEffect.play();

    this.scheduleOnce(() => {
      this.animation.play(this.card_fadeOut);
      this.scheduleOnce(() => this.node.active = false, MatchGameAnimationTimes.cardFadeOutTime)
    }, MatchGameAnimationTimes.matchEffectTime)
  }

  // public matchEffect() {

  // }

  public unmatch() {
    this.setBack();
  }

  public onClick() {
    this.gameManager.selectCard(this);
  }
}
