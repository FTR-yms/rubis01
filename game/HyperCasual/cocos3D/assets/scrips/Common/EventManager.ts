// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component } from 'cc';
import { Singleton } from './Singleton';
const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager extends Singleton<EventManager>() {
    public on(name: string, func: Function, owner?: any) {
        this.node.on(name, func, owner);
    }

    public off(name: string, func: Function, owner?: any) {
        this.node.off(name, func, owner);
    }

    public emit(name: string, ...args: any) {
        this.node.emit(name, ...args);
    }
}
