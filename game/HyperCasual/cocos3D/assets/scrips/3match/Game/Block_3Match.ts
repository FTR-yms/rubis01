import {
  _decorator,
  Component,
  SpriteFrame,
  SpriteComponent,
  Vec2,
  NodeEventType,
  Node,
  EventMouse,
  lerp,
  Vec3,
  randomRangeInt,
  EventTouch,
  Skeleton,
  SkeletalAnimation,
  sp,
  Sprite,
} from "cc";
import { EventManager } from "../../Common/EventManager";
import {
  ActionType,
  blockDisatnce,
  BlockShape,
  BlockState,
  BlockWay,
  CellStartPos,
  GameEvent,
  BlockItemType,
  GameState,
  SFXSound,
  BlockAni,
  ResourceType,
  ResourceData,
} from "../Util/Config";
import Store from "../Util/Store";
import { ActionManager_3Match } from "./ActionManager_3Match";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_3Match } from "../../Common/SoundNames";
const { ccclass, property } = _decorator;

interface itemInfo {
  isItem: boolean;
  type: BlockItemType;
  swapColor: number;
  isHorizontal: boolean;
}

@ccclass("Block_3Match")
export class Block_3Match extends Component {
  @property(sp.SkeletonData)
  private spines: sp.SkeletonData[] = [];

  @property
  private blockFallSpeed: number = 300;

  @property(Node)
  private inputCollider: Node = null;

  @property(Node)
  private highLightNode : Node = null;

  @property(sp.Skeleton)
  private spine: sp.Skeleton = null;

  private _color: number = 0;
  private _index: Vec2 = new Vec2(0, 0);

  private state: BlockState = BlockState.Idle;

  private _itemInfo: itemInfo = {
    isItem: false,
    type: BlockItemType.Watch,
    swapColor: 0,
    isHorizontal: false,
  };

  private _sideBlocks: Block_3Match[] = [];

  private _check: number = 0;

  private moveStartPos: Vec2 = new Vec2(0, 0);


  // onLoad() {
  //   let checkType : ResourceType = ResourceType.Block1;
  //   for(let i = 0; i < this.spines.length; ++i){
  //     const resouce : ResourceData = Store.resources.find((val) => val.type === checkType);

  //     if(resouce){
  //       const skeletonData = new sp.SkeletonData();
  //       skeletonData.textures.push(resouce.texture);
  //       skeletonData.textureNames.push(resouce.name);
  //       skeletonData.atlasText = resouce.atals;
  //       skeletonData.skeletonJson = resouce.json as any;

  //       this.spines[i] = skeletonData;
  //     }

  //     checkType++;
  //   }
  // }

  protected start(): void {
    this.inputCollider.on(
      Node.EventType.TOUCH_START,
      (event: EventTouch): void => {
        if (Store.gameState !== GameState.Play) {
          return;
        }

        ActionManager_3Match.instance.emit(ActionType.select, this);
      }
    );

    this.inputCollider.on(
      Node.EventType.TOUCH_END,
      (event: EventTouch): void => {
        if (Store.gameState !== GameState.Play) {
          return;
        }

        ActionManager_3Match.instance.emit(ActionType.deselect);
      }
    );

    this.spine.setCompleteListener((entry) => {
      switch (entry.animation.name) {
        case BlockAni.Match:
        case BlockAni.ItemMatch:
          this.matchEnd();
          break;
        case BlockAni.Landing:
          this.fallEnd();
          break;
        case BlockAni.Link:
          // SoundManager.instance.playSfxOneShot(SfxNames_3Match.FourBlockItem);
          this.match(true);
          break;
        case BlockAni.In:
          this.idle();
          break;
      }
    });

    EventManager.instance.on(GameEvent.poolingAllObject, () => {
      EventManager.instance.emit(GameEvent.poolingBlock, this);
    });
  }

  protected update(deltaTime: number): void {
    if (Store.gameState === GameState.Play) {
      if (this.state === BlockState.Fall) {
        let y: number = this.node.position.y;
        y -= this.blockFallSpeed * deltaTime;
        this.node.setPosition(this.node.position.x, y);

        if (
          this.node.position.y <
          CellStartPos.y + blockDisatnce * this.index.y
        ) {
          this.landing();
        }
      }
    }
  }

  public reset() {
    this.idle();
    this.itemInfo.isItem = false;
    this.itemInfo.swapColor = 0;
    this.itemInfo.isHorizontal = false;
    this.highLightNode.active = false;
  }

  public createBlock(colorIDX: number, idx: Vec2, pos: Vec2): void {
    this.setPosition(pos);
    this.setColor(colorIDX);
    this.spine.setAnimation(0, BlockAni.Idle, true);
    this.index = idx;
  }

  public setColor(colorIdx: number): void {
    this.color = colorIdx;
    this.spine.skeletonData = this.spines[colorIdx];
  }

  public setPosition(pos: Vec2): void {
    this.node.setPosition(pos.x, pos.y);
  }

  public setSideBlock(way: BlockWay, block: Block_3Match): void {
    this._sideBlocks[way] = block;
  }

  public setMoveStartPos(): void {
    this.moveStartPos = new Vec2(this.node.position.x, this.node.position.y);
  }

  public moveTo(movePos: Vec2, t: number): void {
    let x: number = lerp(this.moveStartPos.x, movePos.x, t);
    let y: number = lerp(this.moveStartPos.y, movePos.y, t);

    this.node.setPosition(x, y);
  }

  public idle(): void {
    this.state = BlockState.Idle;
    this.spine.setAnimation(0, BlockAni.Idle, true);
  }

  public fall(): void {
    ActionManager_3Match.instance.countUp(ActionType.fall);
    this.spine.setAnimation(0, BlockAni.Idle, true);
    this.state = BlockState.Fall;
  }

  public landing(): void {
    this.state = BlockState.Landing;
    this.spine.setAnimation(0, BlockAni.Landing, false);
    const x: number = CellStartPos.x + blockDisatnce * this.index.x;
    const y: number = CellStartPos.y + blockDisatnce * this.index.y;
    this.setPosition(new Vec2(x, y));
  }

  public fallEnd() {
    this.idle();
    ActionManager_3Match.instance.countDown(ActionType.fall);
  }

  public link() {
    if (this.state === BlockState.Match) {
      return;
    }

    this.state = BlockState.Link;
    const track = this.spine.setAnimation(0, BlockAni.Link, false);
  }

  public match(isItem: boolean): void {
    if (this.state === BlockState.Match) {
      return;
    }

    if (isItem) {
      this.spine.setAnimation(0, BlockAni.ItemMatch, false);
    } else {
      // if (Store.combo < 4) {
      //   SoundManager.instance.playSfxOneShot(SfxNames_3Match.PopGem1 + Store.combo);
      // } else {
      //   SoundManager.instance.playSfxOneShot(SfxNames_3Match.PopGem5);
      // }

      this.spine.setAnimation(0, BlockAni.Match, false);
    }

    ActionManager_3Match.instance.countUp(ActionType.match);

    this.state = BlockState.Match;
  }

  public matchEnd(): void {
    ActionManager_3Match.instance.countDown(ActionType.match);
    EventManager.instance.emit(GameEvent.poolingBlock, this);
  }

  public upgrade(shape: BlockShape): void {
    SoundManager.instance.playSfxOneShot(SfxNames_3Match.MadeItemGem);

    switch (shape) {
      case BlockShape.FourMOneH:
        this.setItemBlock(BlockItemType.Buds);
        break;
      case BlockShape.FourMOneV:
        this.setItemBlock(BlockItemType.Watch);
        break;
      case BlockShape.FiveMOneH:
      case BlockShape.ThreeMThreeL:
        this.setItemBlock(BlockItemType.Flip);
        break;
      case BlockShape.FiveMOneV:
      case BlockShape.ThreeMThreeT:
      case BlockShape.FourMThree:
      case BlockShape.FiveMThree:
        this.setItemBlock(BlockItemType.Fold);
        break;
    }

    this.spine.setAnimation(0, BlockAni.In, false);
  }

  public setItemBlock(color: number): void {
    this.itemInfo.isItem = true;
    this.itemInfo.type = color;
    this.setColor(color);
  }

  public setSwapColor(swapColor: number): void {
    if (this.itemInfo.type != BlockItemType.Buds || !this._itemInfo.isItem) {
      return;
    }

    this._itemInfo.swapColor = swapColor;
  }

  public setDragWay(isHorizontal: boolean): void {
    if (this.itemInfo.type != BlockItemType.Watch || !this._itemInfo.isItem) {
      return;
    }

    this.itemInfo.isHorizontal = isHorizontal;
  }

  public setHighlight(active : boolean) {
    this.highLightNode.active = active;
  }

  public get color(): number {
    return this._color;
  }

  public set color(colorIdx: number) {
    this._color = colorIdx;
  }

  public get index(): Vec2 {
    return this._index;
  }

  public set index(idx: Vec2) {
    this._index = idx;
  }

  public get sideBlocks(): Block_3Match[] {
    return this._sideBlocks;
  }

  public set check(value: number) {
    this._check = value;
  }

  public get check(): number {
    return this._check;
  }

  public get itemInfo(): itemInfo {
    return this._itemInfo;
  }
}
