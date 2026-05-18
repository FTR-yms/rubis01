import { _decorator, Component, Node, Vec2, Color, UITransform, Sprite } from 'cc';
import store from '../Data/Store';
const { ccclass, property } = _decorator;

@ccclass('BlockSettings')
export class BlockSettings {
    protected goalContentSize : Vec2 = new Vec2(30, 30);
    protected goalColor = Color.WHITE;

    public get ContentSize() : Vec2
    {
        return this.goalContentSize;
    }


    protected initSettings() : void
    {
    }

    public changeImage(uiTransform : UITransform, sprite : Sprite)
    {
        this.initSettings();

        uiTransform.width = this.goalContentSize.x;
        uiTransform.height = this.goalContentSize.y;
        
        sprite.color = this.goalColor;  
    }
}


@ccclass('ShowBlockSettings')
export class ShowBlockSettings extends BlockSettings {
    protected initSettings(): void {
        this.goalContentSize = store.ShowBlockSize;
    }
}

@ccclass('ClickedBlockSettings')
export class ClickedBlockSettings extends BlockSettings {
    protected initSettings(): void {
        this.goalContentSize = store.ClickBlockSize;
    }
}


@ccclass('InsertBlockSettings')
export class InsertBlockSettings extends BlockSettings {
    
    protected initSettings(): void {
        this.goalContentSize = store.InsertBlockSize;
    }
}

@ccclass('InsertUnAbleBlockSettings')
export class InsertUnAbleBlockSettings extends BlockSettings {
    protected initSettings(): void {
        this.goalContentSize = new Vec2(58, 58);
        this.goalColor = new Color(255, 255, 255, 140);
    }
}