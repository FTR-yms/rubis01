//import * as cc from 'cc';
import {
  _decorator,
  Component,
  Node,
  Vec2,
  Prefab,
  Label,
  EventMouse,
  SpriteFrame,
  randomRangeInt,
  LightingStage,
  EventKeyboard,
  TextAsset,
  EventTouch,
  sp,
  view,
} from "cc";
import {
  ActionType,
  blockDisatnce,
  BlockPoint,
  BlockShape,
  BlockWay,
  BoardCellSize,
  BoardMargin,
  BoardState,
  BonusRate,
  CellStartPos,
  GameEvent,
  GameState,
  ItemBlockCount,
  BlockItemType,
  NormalColorLength,
  screenSize,
  Bgm,
  SFXSound,
  BlockScore,
  MaxCombo,
  ItemAniName,
  DevOption,
  CharacterAniName,
  LinkBlockAniTime,
  HintBlockTime,
} from "../Util/Config";
import { Block_3Match } from "./Block_3Match";
import { Pool } from "../../Common/Pool";
import Store from "../Util/Store";
import { EventManager } from "../../Common/EventManager";
import { ActionManager_3Match } from "./ActionManager_3Match";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_3Match } from "../../Common/SoundNames";

const { ccclass, property } = _decorator;

@ccclass("Board_3Match")
export class Board_3Match extends Component {
  @property({ type: Pool })
  private blockPool: Pool = new Pool();

  @property
  private swapTime: number = 0.15;

  @property({ type: TextAsset })
  private testBoard: TextAsset = null;

  private state: BoardState = BoardState.Start;

  private blockMap: Block_3Match[][] = [];
  private selectBlock: Block_3Match = null;
  private selectPos: Vec2 = new Vec2(0, 0);

  private swapBlocks: Block_3Match[] = [];
  private highlightBlocks: Block_3Match[] = [];
  private drag: boolean = false;
  private swapTimer: number = 0;

  private nonePlayTimer: number = 0;

  private matchGroups: Vec2[][] = [];

  private mousePos: Vec2 = new Vec2(0, 0);

  protected start(): void {
    this.node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch): void => {
      this.mousePos = event.getUILocation();

      if (this.selectBlock) {
        this.drag = true;
      }
    });

    // this.node.on(Node.EventType.TOUCH_START, (event: EventTouch): void => {
    //   this.mousePos = event.getUILocation();

    //   console.log(this.mousePos);
    //   console.log(this.getWorldMousePos());
    // });

    EventManager.instance.on(GameEvent.poolingBlock, (block: Block_3Match) => {
      this.blockPool.return(block.node);
    });

    EventManager.instance.on(
      GameEvent.breakAllBlock,
      this.breakAllBlock.bind(this)
    );

    ActionManager_3Match.instance.on(ActionType.match, this.matchEnd.bind(this));
    ActionManager_3Match.instance.on(ActionType.effect, this.effectsEnd.bind(this));
    ActionManager_3Match.instance.on(ActionType.fall, this.fallEnd.bind(this));
    ActionManager_3Match.instance.on(ActionType.select, this.select.bind(this));
    ActionManager_3Match.instance.on(ActionType.deselect, this.deslect.bind(this));
  }

  protected update(deltaTime: number): void {
    if (Store.gameState === GameState.Play) {
      if (this.state === BoardState.Normal) {
        if (this.drag) {
          //let distance = this.getWorldMousePos().subtract(this.selectPos);

          let distance: Vec2 = this.getWorldMousePos().subtract(this.selectPos);

          let swapDistance = (blockDisatnce / 2) * 0.7;

          if (
            Math.abs(distance.x) > swapDistance ||
            Math.abs(distance.y) > swapDistance
          ) {
            let xIndex: number = this.selectBlock.index.x;
            let yIndex: number = this.selectBlock.index.y;

            let isHorizon: boolean = false;

            if (Math.abs(distance.x) > Math.abs(distance.y)) {
              isHorizon = true;
            }

            if (isHorizon) {
              if (distance.x < 0) {
                xIndex -= 1;
              } else {
                xIndex += 1;
              }
            } else {
              if (distance.y < 0) {
                yIndex -= 1;
              } else {
                yIndex += 1;
              }
            }

            SoundManager.instance.playSfxOneShot(SfxNames_3Match.MoveGem);
            this.swap(this.selectBlock, this.getBlockFromIndex(xIndex, yIndex));
            this.deslect();
          }
        }

        // 아무 동작 없을 경우 하이라이트
        if (this.highlightBlocks.length <= 0) {
          this.nonePlayTimer += deltaTime;

          if (this.nonePlayTimer >= HintBlockTime) {
            const matchableBlocks = this.getMatchableBlocks();
            if (matchableBlocks.length > 0) {
              matchableBlocks[randomRangeInt(0, matchableBlocks.length)].forEach((block) => {
                this.highlightBlocks.push(block);
                block.setHighlight(true);
              });
            }

            this.nonePlayTimer = 0;
          }
        }
      } else if (
        this.state === BoardState.Swap ||
        this.state === BoardState.SwapFail
      ) {
        this.swapTimer += deltaTime;

        let t = this.swapTimer / this.swapTime;

        for (let i = 0; i < this.swapBlocks.length; ++i) {
          let swapBlock = this.swapBlocks[i];
          swapBlock.moveTo(
            this.getPositionFromIndex(swapBlock.index.x, swapBlock.index.y),
            t
          );
        }

        if (t >= 1) {
          for (let i = 0; i < this.swapBlocks.length; ++i) {
            let swapBlock = this.swapBlocks[i];
            swapBlock.setPosition(
              this.getPositionFromIndex(swapBlock.index.x, swapBlock.index.y)
            );
          }

          if (this.state === BoardState.Swap) {
            this.swapEnd();
          } else if (this.state === BoardState.SwapFail) {
            this.swapFailEnd();
          }
        }
      }
    }
  }

  private getTestColorMap(): number[][] {
    let map: number[][] = [];
    let line: string[] = this.testBoard.text.split("\n");

    for (let x = 0; x < BoardCellSize.x; ++x) {
      map.push(new Array(BoardCellSize.y));

      for (let y = 0; y < BoardCellSize.y; ++y) {
        map[x][y] = 9;
      }
    }

    for (let y = 0; y < line.length; ++y) {
      let elements: string[] = line[line.length - y - 1].split(" ");

      for (let x = 0; x < elements.length; ++x) {
        map[x][y] = parseInt(elements[x]);
      }
    }

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let excludes: number[] = [];
        if (map[x][y] < 9) {
          continue;
        }

        if (x > 1 && map[x - 1][y] === map[x - 2][y]) {
          excludes.push(map[x - 1][y]);
        }

        if (y > 1 && map[x][y - 1] === map[x][y - 2]) {
          excludes.push(map[x][y - 1]);
        }

        if (excludes.length === 0) {
          map[x][y] = this.getRandomColor();
        } else {
          map[x][y] = this.getRandomColorExcludeSome(excludes);
        }
      }
    }

    return map;
  }

  public gameStart(isItem: boolean): void {
    this.reset(isItem);
  }

  private reset(isItem: boolean): void {
    this.createBlocks(isItem);
    this.state = BoardState.Start;
    this.selectBlock = null;
    this.swapBlocks = [];
    this.highlightBlocks = [];
    this.nonePlayTimer = 0;
  }

  private createBlocks(isItem: boolean): void {
    ActionManager_3Match.instance.reset(ActionType.fall);
    ActionManager_3Match.instance.reset(ActionType.match);
    ActionManager_3Match.instance.reset(ActionType.effect);

    let colorMap: number[][] =
      this.testBoard != null
        ? this.getTestColorMap()
        : this.getColorMap();

    for (let x = 0; x < BoardCellSize.x; ++x) {
      this.blockMap.push(new Array(BoardCellSize.y));
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.blockPool.get().getComponent(Block_3Match);

        const pos: Vec2 = this.getPositionFromIndex(x, y + BoardCellSize.y);
        this.scheduleOnce(() => {
          block.createBlock(colorMap[x][y], new Vec2(x, y), pos);
          block.reset();
          block.fall();

          if (
            this.testBoard != null &&
            block.color >= BlockItemType.Watch
          ) {
            block.setItemBlock(block.color);
          }
        }, 0)

        this.blockMap[x][y] = block;
      }
    }

    this.scheduleOnce(() => {
      this.setAllSideBlocks();

      if (this.getMatchableBlocks().length === 0) {
        this.shakeBlocks(true);
      }

      if (isItem) {
        let x: number = 0;
        let y: number = 0;
        let type: BlockItemType = BlockItemType.Watch;

        for (let i = 0; i < ItemBlockCount; ++i) {
          x = randomRangeInt(0, BoardCellSize.x);
          y = randomRangeInt(0, BoardCellSize.y);
          type = randomRangeInt(BlockItemType.Watch, BlockItemType.Fold + 1);

          this.blockMap[x][y].setItemBlock(type);
        }
      }
    }, 0)
  }

  private startTurn() {
    EventManager.instance.emit(GameEvent.pauseTimer);
  }

  private endTurn() {
    this.state = BoardState.Normal;
    EventManager.instance.emit(GameEvent.resumeTimer);
  }

  private fallBlocks() {
    if (this.state === BoardState.Effect) {
      return;
    }

    ActionManager_3Match.instance.reset(ActionType.fall);

    let dropCount: number[] = [];

    for (let x = 0; x < BoardCellSize.x; ++x) {
      dropCount[x] = 0;

      for (let y = 0; y < BoardCellSize.y; ++y) {
        if (!this.getBlockFromIndex(x, y)) {
          dropCount[x] += 1;
        }
      }
    }

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 1; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.getBlockFromIndex(x, y);

        if (block) {
          let y2: number = y - 1;
          for (; y2 >= 0; y2--) {
            if (this.getBlockFromIndex(x, y2)) {
              break;
            }
          }

          y2 += 1;

          if (y2 !== y) {
            this.blockMap[x][y] = null;
            this.blockMap[x][y2] = block;
            block.index = new Vec2(x, y2);
            block.fall();
          }
        }
      }
    }

    for (let x = 0; x < dropCount.length; ++x) {
      for (let i = 0; i < dropCount[x]; ++i) {
        let block: Block_3Match = this.blockPool.get().getComponent(Block_3Match);

        let y: number = BoardCellSize.y - dropCount[x] + i;
        this.blockMap[x][y] = block;

        block.index = new Vec2(x, y);
        block.setPosition(this.getPositionFromIndex(x, BoardCellSize.y + i));

        let down: Block_3Match = this.getBlockFromIndex(x, y - 1);
        let down2: Block_3Match = this.getBlockFromIndex(x, y - 2);

        if (down && down2 && down.color === down2.color) {
          block.setColor(this.getRandomColorExcludeSome([down.color]));
        } else {
          block.setColor(this.getRandomColor());
        }

        block.reset();
        block.fall();
      }
    }
  }

  private select(block: Block_3Match): void {
    if (this.state === BoardState.Normal) {
      this.selectBlock = block;
      this.selectPos = this.getPositionFromIndex(block.index.x, block.index.y);
    }
  }

  private deslect(): void {
    if (!this.selectBlock) {
      return;
    }

    this.selectBlock.idle();
    this.selectBlock = null;
    this.drag = false;
  }

  private fallEnd() {
    SoundManager.instance.playSfxOneShot(SfxNames_3Match.FallGem);

    if (this.state === BoardState.Start) {
      this.state = BoardState.Normal;
      EventManager.instance.emit(GameEvent.resumeTimer);
      return;
    }

    this.setAllSideBlocks();

    if (this.match()) {
      this.state = BoardState.Match;
      this.breakBlocks();
    } else {
      if (this.getMatchableBlocks().length === 0) {
        this.shakeBlocks();
      } else {
        this.endTurn();
      }
    }
  }

  private getColorMap(): number[][] {
    let map: number[][] = [];

    for (let x = 0; x < BoardCellSize.x; ++x) {
      map.push(new Array(7));
      for (let y = 0; y < BoardCellSize.y; ++y) {
        map[x][y] = -1;
      }
    }

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let excludes: number[] = [];

        if (x > 1 && map[x - 1][y] === map[x - 2][y]) {
          excludes.push(map[x - 1][y]);
        }

        if (y > 1 && map[x][y - 1] === map[x][y - 2]) {
          excludes.push(map[x][y - 1]);
        }

        if (excludes.length === 0) {
          map[x][y] = this.getRandomColor();
        } else {
          map[x][y] = this.getRandomColorExcludeSome(excludes);
        }
      }
    }

    return map;
  }

  private getRandomColorExcludeSome(excludes: number[]): number {
    let colors: number[] = [];
    //2 5
    for (let i = 0; i < NormalColorLength; ++i) {
      colors.push(i);
    }

    for (let i = 0; i < excludes.length; ++i) {
      let index = colors.findIndex((v) => v === excludes[i]);
      colors.splice(index, 1);
    }

    return colors[randomRangeInt(0, colors.length)];
  }

  private getRandomColor(): number {
    return randomRangeInt(0, NormalColorLength);
  }

  private setAllSideBlocks(): void {
    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        if (!this.getBlockFromIndex(x, y)) {
          continue;
        }

        this.setSideBlocks(x, y);
      }
    }
  }

  private setSideBlocks(xIdx: number, yIdx: number): void {
    if (xIdx === 0) {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(BlockWay.Left, null);
    } else {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(
        BlockWay.Left,
        this.getBlockFromIndex(xIdx - 1, yIdx)
      );
    }

    if (xIdx === BoardCellSize.x - 1) {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(BlockWay.Right, null);
    } else {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(
        BlockWay.Right,
        this.getBlockFromIndex(xIdx + 1, yIdx)
      );
    }

    if (yIdx === 0) {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(BlockWay.Down, null);
    } else {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(
        BlockWay.Down,
        this.getBlockFromIndex(xIdx, yIdx - 1)
      );
    }

    if (yIdx === BoardCellSize.y - 1) {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(BlockWay.Up, null);
    } else {
      this.getBlockFromIndex(xIdx, yIdx).setSideBlock(
        BlockWay.Up,
        this.getBlockFromIndex(xIdx, yIdx + 1)
      );
    }
  }

  private getMatchableBlocks() {
    let matchablePairs: Block_3Match[][] = [];

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.getBlockFromIndex(x, y);

        if (block.itemInfo.isItem && block.color >= 6) {
          matchablePairs.push([block]);
        }

        if (x !== BoardCellSize.x - 1) {
          let right: Block_3Match = block.sideBlocks[BlockWay.Right];

          if (right && block.color !== right.color) {
            let temp = block.color;
            block.color = right.color;
            right.color = temp;

            if (
              this.singleCheck(x, y) ||
              this.singleCheck(right.index.x, right.index.y)
            ) {
              let pair: Block_3Match[] = [];
              pair.push(block);
              pair.push(right);

              matchablePairs.push(pair);
            }

            temp = block.color;
            block.color = right.color;
            right.color = temp;
          }
        }

        if (y !== BoardCellSize.y - 1) {
          let up = block.sideBlocks[BlockWay.Up];

          if (up && block.color !== up.color) {
            let temp = block.color;
            block.color = up.color;
            up.color = temp;

            if (
              this.singleCheck(x, y) ||
              this.singleCheck(up.index.x, up.index.y)
            ) {
              let pair: Block_3Match[] = [];
              pair.push(block);
              pair.push(up);

              matchablePairs.push(pair);
            }

            temp = block.color;
            block.color = up.color;
            up.color = temp;
          }
        }
      }
    }

    return matchablePairs;
  }

  private startShake() {
    this.state = BoardState.Shake;

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.getBlockFromIndex(x, y);

        if (block) {
          block.match(false);
        }
      }
    }
  }

  private shakeBlocks(gameStart: boolean = false) {
    this.state = BoardState.Shake;

    ActionManager_3Match.instance.reset(ActionType.fall);
    EventManager.instance.emit(GameEvent.pauseTimer);

    let colorMap: number[][] = this.getColorMap();

    if (!gameStart) {
      for (let x = 0; x < BoardCellSize.x; ++x) {
        for (let y = 0; y < BoardCellSize.y; ++y) {
          let block: Block_3Match = this.getBlockFromIndex(x, y);

          if (block) {
            block.setColor(colorMap[x][y]);
            block.reset();
            block.setPosition(
              this.getPositionFromIndex(x, y + BoardCellSize.y)
            );
            block.fall();
          }
        }
      }
    }

    while (this.getMatchableBlocks().length === 0) {
      colorMap = this.getColorMap();
      for (let x = 0; x < BoardCellSize.x; ++x) {
        for (let y = 0; y < BoardCellSize.y; ++y) {
          let block: Block_3Match = this.getBlockFromIndex(x, y);

          if (block) {
            block.setColor(colorMap[x][y]);
            block.reset();
            block.fall();
          }
        }
      }
    }

    this.state = BoardState.Start;
    SoundManager.instance.playSfxOneShot(SfxNames_3Match.ShuffleGem);
  }

  public singleCheck(xIdx: number, yIdx: number): boolean {
    let block = this.getBlockFromIndex(xIdx, yIdx);

    let left: Block_3Match = block.sideBlocks[BlockWay.Left];
    let right: Block_3Match = block.sideBlocks[BlockWay.Right];
    let up: Block_3Match = block.sideBlocks[BlockWay.Up];
    let down: Block_3Match = block.sideBlocks[BlockWay.Down];

    if (
      left &&
      right &&
      block.color === left.color &&
      block.color === right.color
    ) {
      return true;
    }

    if (up && down && block.color === up.color && block.color === down.color) {
      return true;
    }

    if (left && block.color === left.color) {
      let left2 = left.sideBlocks[BlockWay.Left];
      if (left2 && left.color === left2.color) {
        return true;
      }
    }

    if (right && block.color === right.color) {
      let right2 = right.sideBlocks[BlockWay.Right];
      if (right2 && right.color === right2.color) {
        return true;
      }
    }

    if (up && block.color === up.color) {
      let up2 = up.sideBlocks[BlockWay.Up];
      if (up2 && up.color === up2.color) {
        return true;
      }
    }

    if (down && block.color === down.color) {
      let down2 = down.sideBlocks[BlockWay.Down];
      if (down2 && down.color === down2.color) {
        return true;
      }
    }

    return false;
  }

  private swap(selectBlock: Block_3Match, swapBlock: Block_3Match): void {
    if (!selectBlock || !swapBlock) {
      return;
    }

    this.swapBlocks = [];
    this.swapBlocks.push(selectBlock);
    this.swapBlocks.push(swapBlock);

    let index1: Vec2 = selectBlock.index;
    let index2: Vec2 = swapBlock.index;
    this.blockMap[index1.x][index1.y] = swapBlock;
    this.blockMap[index2.x][index2.y] = selectBlock;

    selectBlock.index = index2;
    swapBlock.index = index1;

    selectBlock.setMoveStartPos();
    swapBlock.setMoveStartPos();

    this.setSideBlocks(selectBlock.index.x, selectBlock.index.y);
    this.setSideBlocks(swapBlock.index.x, swapBlock.index.y);

    for (let i = 0; i < selectBlock.sideBlocks.length; ++i) {
      if (selectBlock.sideBlocks[i]) {
        this.setSideBlocks(
          selectBlock.sideBlocks[i].index.x,
          selectBlock.sideBlocks[i].index.y
        );
      }
    }

    for (let i = 0; i < swapBlock.sideBlocks.length; ++i) {
      if (swapBlock.sideBlocks[i]) {
        this.setSideBlocks(
          swapBlock.sideBlocks[i].index.x,
          swapBlock.sideBlocks[i].index.y
        );
      }
    }

    EventManager.instance.emit(GameEvent.resetCharacterIdle);
    this.swapTimer = 0;
    this.state = BoardState.Swap;

    // 하이라이트 초기화
    this.nonePlayTimer = 0;
    this.highlightBlocks.forEach(block => {
      block.setHighlight(false);
    });
    this.highlightBlocks = [];
  }

  private swapEnd(): void {
    if (this.match()) {
      this.startTurn();
      this.swapBlocks = [];
      this.state = BoardState.Match;
      this.breakBlocks();
    } else {
      this.swapFail();
    }
  }

  private swapFail(): void {
    SoundManager.instance.playSfxOneShot(SfxNames_3Match.MoveErr);
    this.swap(this.swapBlocks[0], this.swapBlocks[1]);
    this.state = BoardState.SwapFail;
  }

  private swapFailEnd(): void {
    this.state = BoardState.Normal;
  }

  private match(): boolean {
    this.checkClear();
    ActionManager_3Match.instance.reset(ActionType.match);
    ActionManager_3Match.instance.reset(ActionType.effect);
    let isMatch: boolean = false;

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.getBlockFromIndex(x, y);

        let up: Block_3Match = block.sideBlocks[BlockWay.Up];
        let down: Block_3Match = block.sideBlocks[BlockWay.Down];
        let left: Block_3Match = block.sideBlocks[BlockWay.Left];
        let right: Block_3Match = block.sideBlocks[BlockWay.Right];

        if (
          up &&
          up.color < 6 &&
          down &&
          down.color < 6 &&
          block.color === up.color &&
          block.color === down.color
        ) {
          isMatch = true;
          up.check++;
          block.check++;
          down.check++;
        }

        if (
          left &&
          left.color < 6 &&
          right &&
          right.color < 6 &&
          block.color === left.color &&
          block.color === right.color
        ) {
          isMatch = true;
          left.check++;
          block.check++;
          right.check++;
        }
      }
    }

    if (isMatch) {
      this.matchGroup();
    }

    let swapBlocks: Block_3Match[] = this.swapBlocks;

    for (let i = 0; i < swapBlocks.length; ++i) {
      switch (swapBlocks[i].color) {
        case BlockItemType.Watch:
          const dir: Vec2 = swapBlocks[i].index
            .clone()
            .subtract(swapBlocks[1 - i].index);
          swapBlocks[i].setDragWay(dir.x === 0 ? true : false);

          this.matchGroups.push([swapBlocks[i].index]);
          isMatch = true;
          break;
        case BlockItemType.Buds:
          if (
            (swapBlocks[i].color !== swapBlocks[1 - i].color &&
              !swapBlocks[i].itemInfo.isItem) ||
            !swapBlocks[1 - i].itemInfo.isItem
          ) {
            swapBlocks[i].setSwapColor(swapBlocks[1 - i].color);
            this.matchGroups.push([swapBlocks[i].index]);
            isMatch = true;
          }
          break;
        case BlockItemType.Flip:
        case BlockItemType.Fold:
          this.matchGroups = [];
          this.matchGroups.push([swapBlocks[i].index]);
          isMatch = true;
          break;
      }
    }

    return isMatch;
  }

  private matchEnd(): void {
    if (this.state === BoardState.Shake) {
      this.shakeBlocks();
    } else {
      this.fallBlocks();
    }
  }

  private checkClear(): void {
    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        this.blockMap[x][y].check = 0;
      }
    }

    this.matchGroups = [];
  }

  private matchGroup(): void {
    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.getBlockFromIndex(x, y);
        if (block.check === 0) {
          continue;
        }

        let checkIndexes: Vec2[] = [];
        let connectedList: Vec2[] = [];

        checkIndexes.push(block.index);
        block.check = 0;

        while (checkIndexes.length > 0) {
          let index: Vec2 = checkIndexes.pop();
          let checkBlock: Block_3Match = this.getBlockFromIndex(index.x, index.y);
          connectedList.push(index);

          let up: Block_3Match = checkBlock.sideBlocks[BlockWay.Up];
          let down: Block_3Match = checkBlock.sideBlocks[BlockWay.Down];
          let left: Block_3Match = checkBlock.sideBlocks[BlockWay.Left];
          let right: Block_3Match = checkBlock.sideBlocks[BlockWay.Right];

          if (up && up.check > 0 && checkBlock.color === up.color) {
            checkIndexes.push(up.index);
            up.check = 0;
          }

          if (down && down.check > 0 && checkBlock.color === down.color) {
            checkIndexes.push(down.index);
            down.check = 0;
          }

          if (left && left.check > 0 && checkBlock.color === left.color) {
            checkIndexes.push(left.index);
            left.check = 0;
          }

          if (right && right.check > 0 && checkBlock.color === right.color) {
            checkIndexes.push(right.index);
            right.check = 0;
          }
        }

        this.matchGroups.push(connectedList);
      }
    }
  }

  private breakBlocks(): void {
    for (let i = 0; i < this.matchGroups.length; ++i) {
      let matchGroup: Vec2[] = this.matchGroups[i];
      let randomIdx: Vec2 = new Vec2(-1, -1);

      let min: Vec2 = this.getGroupMinMax(matchGroup).min;
      let max: Vec2 = this.getGroupMinMax(matchGroup).max;
      let shape: BlockShape = this.getGroupShape(min, max);

      let centerPos: Vec2 = this.getPositionFromIndex(
        (min.x + max.x) / 2,
        (min.y + max.y) / 2
      );

      if (matchGroup.length >= 4) {
        randomIdx = matchGroup[randomRangeInt(0, matchGroup.length)];
      }

      let isItem: boolean = false;

      for (let j = 0; j < matchGroup.length; ++j) {
        let index: Vec2 = matchGroup[j];
        let block: Block_3Match = this.getBlockFromIndex(index.x, index.y);

        isItem = this.actionItem(block);

        if (randomIdx.equals(index)) {
          EventManager.instance.emit(
            GameEvent.playCharacterAni,
            CharacterAniName.Good,
            false
          );
          block.upgrade(shape);
        } else {
          if (isItem) {
            switch (block.itemInfo.type) {
              case BlockItemType.Buds:
                this.linkBlock(block);
                break;
            }
          } else {
            this.breakBlock(block);
          }
        }
      }

      if (!isItem) {
        EventManager.instance.emit(GameEvent.addCombo);
        let addScore: number =
          this.getShapeScore(shape, matchGroup.length) *
          Math.min(Store.combo, MaxCombo);
        EventManager.instance.emit(GameEvent.addScore, addScore, centerPos);
        if (Store.combo < 4) {
          SoundManager.instance.playSfxOneShot(SfxNames_3Match.PopGem1 + Store.combo);
        } else {
          SoundManager.instance.playSfxOneShot(SfxNames_3Match.PopGem5);
        }
      }
    }
  }

  private breakBlock(block: Block_3Match, isItem: boolean = false): void {
    if (!block) {
      return;
    }

    this.blockMap[block.index.x][block.index.y] = null;

    block.match(isItem);
  }

  public linkBlock(block: Block_3Match) {
    if (!block) {
      return;
    }

    this.blockMap[block.index.x][block.index.y] = null;

    block.link();
  }

  private breakSameBlock(block: Block_3Match, color: number, excludes: number[]) {
    block.link();

    let count: number = 0;

    for (let x = 0; x < BoardCellSize.x; ++x) {
      for (let y = 0; y < BoardCellSize.y; ++y) {
        let block: Block_3Match = this.getBlockFromIndex(x, y);

        if (block && block.color === color) {
          this.linkBlock(block);
          count++;
        }
      }
    }

    this.scheduleOnce(() => {
      SoundManager.instance.playSfxOneShot(SfxNames_3Match.FourBlockItem);
    }, LinkBlockAniTime);

    if (count <= 0) {
      excludes.push(color);
      this.breakSameBlock(
        block,
        this.getRandomColorExcludeSome(excludes),
        excludes
      );
      return;
    }

    EventManager.instance.emit(GameEvent.addCombo);
    let addScore: number = BlockScore * count;
    EventManager.instance.emit(GameEvent.addScore, addScore);
  }

  private breakLine(
    index: Vec2,
    isHorizontal: boolean,
    isAllBreak: boolean = false
  ) {
    let breakAll: boolean = false;
    if (!isAllBreak) {
      for (let i = 0; i < BoardCellSize.x; ++i) {
        let block: Block_3Match = isHorizontal
          ? this.getBlockFromIndex(i, index.y)
          : this.getBlockFromIndex(index.x, i);

        if (block) {
          if (block.itemInfo.isItem) {
            switch (block.itemInfo.type) {
              case BlockItemType.Flip:
                this.createAllBreakEffect(ItemAniName.Flip);
                breakAll = true;
                break;
              case BlockItemType.Fold:
                this.createAllBreakEffect(ItemAniName.Fold);
                breakAll = true;
                break;
            }
          }
        }
      }
    }

    if (breakAll) {
      return;
    }

    for (let i = 0; i < BoardCellSize.x; ++i) {
      let block: Block_3Match = isHorizontal
        ? this.getBlockFromIndex(i, index.y)
        : this.getBlockFromIndex(index.x, i);

      if (block) {
        if (
          block.itemInfo.isItem &&
          !block.index.equals(index) &&
          !isAllBreak
        ) {
          switch (block.itemInfo.type) {
            case BlockItemType.Watch:
              this.createLineEffect(block.index, !isHorizontal);
              break;
            case BlockItemType.Buds:
              this.breakSameBlock(block, this.getRandomColor(), []);
              break;
            case BlockItemType.Flip:
              this.createAllBreakEffect(ItemAniName.Flip);
              break;
            case BlockItemType.Fold:
              this.createAllBreakEffect(ItemAniName.Fold);
              break;
          }
        }

        this.breakBlock(block, true);
      }
    }

    EventManager.instance.emit(GameEvent.addCombo);
    SoundManager.instance.playSfxOneShot(SfxNames_3Match.FourBlockItem);
    let addScore: number = BlockScore * BonusRate.line * BoardCellSize.y;
    EventManager.instance.emit(GameEvent.addScore, addScore);
  }

  private breakAllBlock(type: string) {
    EventManager.instance.emit(GameEvent.createItemEffect, Vec2.ZERO, type);

    const center: number = Math.floor(BoardCellSize.x / 2);

    this.breakLine(
      this.getIndexFromPosition(Vec2.ZERO),
      type !== ItemAniName.Fold,
      true
    );


    // effectsEnd가 먼저 호출되야 함 => effect 연출 시간이 블록 사라지는 시간보다 짧아야함
    const aniTime = 100;

    for (let i = 1; i <= center; ++i) {
      if (type === ItemAniName.Flip) {
        setTimeout(() => {
          this.breakLine(new Vec2(center, center - i), true, true);
          this.breakLine(new Vec2(center, center + i), true, true);
        }, aniTime * i);
      } else if (type === ItemAniName.Fold) {
        setTimeout(() => {
          this.breakLine(new Vec2(center - i, center), false, true);
          this.breakLine(new Vec2(center + i, center), false, true);
        }, aniTime * i);
      }
    }

    // let addScore: number = BlockScore * BoardCellSize.x * BoardCellSize.y;
    // EventManager_3Match.instance.emit(GameEvent.addScore, addScore);
  }

  private createLineEffect(index: Vec2, isHorizontal: boolean) {
    this.state = BoardState.Effect;
    ActionManager_3Match.instance.countUp(ActionType.effect);

    EventManager.instance.emit(GameEvent.pauseCombo);
    EventManager.instance.emit(
      GameEvent.createItemEffect,
      this.getPositionFromIndex(index.x, index.y),
      isHorizontal ? ItemAniName.WatchH : ItemAniName.WatchV,
      this.breakLine.bind(this, index, isHorizontal, false)
    );
  }

  private createAllBreakEffect(type: string) {
    this.state = BoardState.Effect;
    ActionManager_3Match.instance.countUp(ActionType.effect);

    EventManager.instance.emit(GameEvent.pauseCombo);
    EventManager.instance.emit(
      GameEvent.showItemTextEffect,
      type,
      this.breakAllBlock.bind(this, type)
    );
  }

  private effectsEnd() {
    this.state = BoardState.Fall;
  }

  private getGroupMinMax(group: Vec2[]): { min: Vec2; max: Vec2 } {
    let min: Vec2 = new Vec2(BoardCellSize.x, BoardCellSize.y);
    let max: Vec2 = new Vec2(0, 0);

    for (let i = 0; i < group.length; ++i) {
      let index: Vec2 = group[i];

      if (min.x > index.x) {
        min.x = index.x;
      }

      if (min.y > index.y) {
        min.y = index.y;
      }

      if (max.x < index.x) {
        max.x = index.x;
      }

      if (max.y < index.y) {
        max.y = index.y;
      }
    }

    return { min: min, max: max };
  }

  private getGroupShape(min: Vec2, max: Vec2): BlockShape {
    if (min.x === max.x && min.y === max.y) {
      return;
    }

    let shape: BlockShape = BlockShape.ThreeMOneH;
    let xLen: number = max.x - min.x;
    let yLen: number = max.y - min.y;

    if (xLen > yLen) {
      switch (xLen) {
        case 2:
          shape = BlockShape.ThreeMOneH;
          break;
        case 3:
          shape = BlockShape.FourMOneH;

          if (yLen >= 2) {
            shape = BlockShape.FourMThree;
          }

          break;
        case 4:
          shape = BlockShape.FiveMOneH;

          if (yLen >= 2) {
            shape = BlockShape.FiveMThree;
          }
          break;
      }
      // 3, 1        5,4
    } else if (yLen > xLen) {
      switch (yLen) {
        case 2:
          shape = BlockShape.ThreeMOneV;
          break;
        case 3:
          shape = BlockShape.FourMOneV;

          if (xLen >= 2) {
            shape = BlockShape.FourMThree;
          }
          break;
        case 4:
          shape = BlockShape.FiveMOneV;

          if (xLen >= 2) {
            shape = BlockShape.FiveMThree;
          }
          break;
      }
    } else {
      shape = BlockShape.ThreeMThreeL;

      let centerPos: Vec2 = new Vec2(Math.ceil((min.x + max.x) / 2), Math.ceil((min.y + max.y) / 2));
      let checkBlock: Block_3Match = this.getBlockFromIndex(centerPos.x, centerPos.y);
      let left: Block_3Match = checkBlock.sideBlocks[BlockWay.Left];
      let right: Block_3Match = checkBlock.sideBlocks[BlockWay.Right];
      let up: Block_3Match = checkBlock.sideBlocks[BlockWay.Up];
      let down: Block_3Match = checkBlock.sideBlocks[BlockWay.Down];

      if (
        (checkBlock.color === left.color && checkBlock.color === right.color) ||
        (checkBlock.color === up.color && checkBlock.color === down.color)
      ) {
        shape = BlockShape.ThreeMThreeT;
      }
    }

    return shape;
  }

  private getShapeScore(shape: BlockShape, amount: number): number {
    let addScore: number = 0;

    switch (shape) {
      case BlockShape.ThreeMOneH:
      case BlockShape.ThreeMOneV:
        addScore += BlockScore * amount;
        break;
      case BlockShape.FourMOneH:
      case BlockShape.FourMOneV:
        addScore += BlockScore * BonusRate.four * amount * 2;
        break;
      case BlockShape.FiveMOneH:
      case BlockShape.FiveMOneV:
        addScore += BlockScore * BonusRate.five * amount * 3;
        break;
      case BlockShape.ThreeMThreeL:
      case BlockShape.ThreeMThreeT:
      case BlockShape.FourMThree:
      case BlockShape.FiveMThree:
        addScore += BlockScore * BonusRate.five * amount * 2.5;
        break;
    }

    return addScore;
  }

  private actionItem(block: Block_3Match): boolean {
    if (!block || !block.itemInfo.isItem) {
      return false;
    }

    switch (block.itemInfo.type) {
      case BlockItemType.Watch:
        this.createLineEffect(block.index, block.itemInfo.isHorizontal);
        break;
      case BlockItemType.Buds:
        this.breakSameBlock(block, block.itemInfo.swapColor, []);
        break;
      case BlockItemType.Flip:
        this.createAllBreakEffect(ItemAniName.Flip);
        break;
      case BlockItemType.Fold:
        this.createAllBreakEffect(ItemAniName.Fold);
        break;
    }

    return true;
  }

  private getWorldMousePos(): Vec2 {

    const screenSize = view.getVisibleSize();

    let mousePos: Vec2 = new Vec2(
      this.mousePos.x - screenSize.width / 2 - this.node.position.x,
      this.mousePos.y - screenSize.height / 2 - this.node.position.y
    );

    return mousePos;
  }

  private getBlockFromIndex(xIdx: number, yIdx: number): Block_3Match {

    if (
      xIdx < 0 ||
      yIdx < 0 ||
      xIdx > BoardCellSize.x - 1 ||
      yIdx > BoardCellSize.y - 1
    ) {
      return null;
    }

    return this.blockMap[xIdx][yIdx];
  }
  r;

  private getIndexFromMousePosition(): Vec2 {
    let xIndex: number = Math.floor(
      (this.mousePos.x - BoardMargin.left) / blockDisatnce
    );
    let yIndex: number = Math.floor(
      (this.mousePos.y - BoardMargin.bottom) / blockDisatnce
    );
    return new Vec2(xIndex, yIndex);
  }

  private getIndexFromPosition(pos: Vec2): Vec2 {
    let xIndex: number = Math.floor(
      (screenSize.width / 2 + pos.x - BoardMargin.left) / blockDisatnce
    );
    let yIndex: number = Math.floor(
      (pos.y + BoardMargin.bottom) / blockDisatnce
    );
    return new Vec2(xIndex, yIndex);
  }

  private getPositionFromIndex(xIdx: number, yIdx: number): Vec2 {
    let x: number = CellStartPos.x + blockDisatnce * xIdx;
    let y: number = CellStartPos.y + blockDisatnce * yIdx;
    return new Vec2(x, y);
  }
}
