import { _decorator, Component, Node } from "cc";
import { ActionType } from "../Util/Config";
const { ccclass, property } = _decorator;

class Action {
  public endAction: string;
  public count: number = 0;

  constructor(endAction: string) {
    this.endAction = endAction;
    this.reset();
  }

  public reset(): void {
    this.count = 0;
  }
}

@ccclass("ActionManager_3Match")
export class ActionManager_3Match extends Component {
  actions: Action[] = [];

  private static _instance: ActionManager_3Match = null;
  static get instance(): ActionManager_3Match {
    return ActionManager_3Match._instance;
  }

  protected onLoad(): void {
    ActionManager_3Match._instance = this;
  }

  public on(type: ActionType, callBack: Function, owner?: any): void {
    this.node.on(type, callBack, owner);
  }

  public off(type: ActionType, ...args: any): void {
    this.node.off(type, ...args);
  }

  public emit(type: ActionType, ...args: any): void {
    this.node.emit(type, ...args);
  }

  public addAction(type: ActionType, endAction: string): void {
    this.actions[type] = new Action(endAction);
  }

  public reset(type: ActionType): void {
    this.actions[type].reset();
  }

  public countUp(type: ActionType): void {
    this.actions[type].count += 1;
  }

  public getCount(type: ActionType): number {
    return this.actions[type].count;
  }

  public countDown(type: ActionType): void {
    this.actions[type].count -= 1;

    if (this.actions[type].count === 0) {
      this.emit(this.actions[type].endAction);
    }
  }
}
