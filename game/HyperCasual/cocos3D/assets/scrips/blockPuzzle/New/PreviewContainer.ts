import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, SpriteFrame } from 'cc';
import { NormalBlock } from '../Block/NormalBlock';
import { Singleton } from '../../Common/Singleton';
import { Pool } from '../../Common/Pool';
const { ccclass, property } = _decorator;

@ccclass('PreviewContainer')
export class PreviewContainer extends Singleton<PreviewContainer>() {
    @property(Node)
    private map: Node = null;

    @property(SpriteFrame)
    private previewBlockSpriteFrame: SpriteFrame = null;

    @property(Pool)
    private pool: Pool = null;

    private usePreviewBlocks: Node[] = new Array<Node>(0);

    public reStart(): void {
        this.previewClear();
        this.insertClear();

    }

    public previewClear() {
        for (let i = 0; i < 100; ++i) {
            let block = this.usePreviewBlocks.pop();

            if (block == null) {
                break;
            }

            this.pool.return(block);
        }
    }

    public insertClear() {
        for (let i = this.pool.enableParent.children.length - 1; i >= 0; --i) {
            let block = this.pool.enableParent.children[i];

            this.pool.return(block);
        }
    }

    public getPreViewBlock(): Node {
        return this.getPullBlock(this.previewBlockSpriteFrame, 0.4, this.usePreviewBlocks);
    }

    public getInsertBlock(spriteFrame: SpriteFrame): Node {
        return this.getPullBlock(spriteFrame, 1, null);
    }

    private getPullBlock(spriteFrame: SpriteFrame, alphaValue: number, usePull: Node[]): Node {
        const block = this.pool.get().getComponent(NormalBlock);
        block.setPool(this.pool);
        block.setSprite(spriteFrame, alphaValue);
        usePull?.push(block.node);
        return block.node;
    }

}

