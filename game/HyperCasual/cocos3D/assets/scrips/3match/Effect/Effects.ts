import { _decorator, Component, Node, Prefab, Vec2 } from 'cc';
import { EventManager } from '../../Common/EventManager';
import { Pool } from '../../Common/Pool';
import { ItemEffect } from '../Effect/ItemEffect';
import { ScoreEffect } from '../Effect/ScoreEffect';
import { GameEvent } from '../Util/Config';
const { ccclass, property } = _decorator;

@ccclass('Effects')
export class Effects extends Component {
    @property({ type: Pool })
    private itemEffect: Pool = null;

    start() {
        EventManager.instance.on(GameEvent.createItemEffect, this.craeteItemEffect.bind(this));
        EventManager.instance.on(GameEvent.poolingItemEffect, this.poolingItemEffect.bind(this));
    }

    private craeteItemEffect(pos: Vec2, type: string, callBack: Function): void {
        let effect: ItemEffect = this.itemEffect.get().getComponent(ItemEffect);
        effect.setEffect(pos, type, callBack);
    }

    private poolingItemEffect(effect: ItemEffect) {
        this.itemEffect.return(effect.node);
    }
}

