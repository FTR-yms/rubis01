import { _decorator, Component, Node, Prefab, instantiate, Vec2, v3 } from 'cc';
import { Block_2048 } from "./Block_2048";
import { BlockDefaultPosition, BlockInterval, BoardSize } from "../util/Config_2048";
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_2048 } from '../../Common/SoundNames';

const { ccclass, property } = _decorator;

@ccclass('Board_2048')
export default class Board_2048 extends Component {
    @property(Prefab) blockPrefab: Prefab = null!;

    private blockList: Block_2048[] = []; // 전체 관리 리스트
    private map: (Block_2048 | null)[] = []; // 현재 보드 상태 (활성 블록)

    onLoad() {
        // 1. 블록을 32개로 늘려 생성 (16칸 + 연출용 여유분)
        // 연타 시 '사라지는 중'인 블록이 많아지므로 넉넉해야 합니다.
        for (let i = 0; i < 32; i++) {
            const node = instantiate(this.blockPrefab);
            const block = node.getComponent(Block_2048);
            if (block) {
                this.node.addChild(node);
                block.node.active = false;
                this.blockList.push(block);
            }
        }
        // map은 보드 크기만큼 초기화
        this.map = new Array(BoardSize.count).fill(null);
    }

    reset() {
        this.map.fill(null);
        this.blockList.forEach(b => {
            b.reset();
            b.node.active = false;
        });
    }

    private getBlockFromPool(): Block_2048 | null {
        // 1순위: 완전히 비활성화된 블록
        let block = this.blockList.find(b => !b.node.active);
        if (block) return block;

        // 2순위: 맵에는 없지만 아직 '사라지는 연출(upgradeOut)' 중인 블록 가로채기
        // 연타 시에는 이 로직이 있어야 블록 부족 현상이 없습니다.
        block = this.blockList.find(b => this.map.indexOf(b) < 0);
        if (block) {
            block.stopAction(); // 진행 중인 애니메이션 즉시 중단
            return block;
        }

        return null;
    }

    /** 2. 사용 끝난 블록 풀로 반납 */
    private returnBlockToPool(block: Block_2048) {
        block.reset();
        block.node.active = false;
    }

    move(direction: 'left' | 'right' | 'top' | 'bottom') {
        this.cancelMoveAllBlock(); // 이동 전 이전 턴 애니메이션 정리

        let isMoved = false;
        let isMerged = false;
        let totalScore = 0;

        const delta = this.getDelta(direction);
        const isVertical = direction === 'top' || direction === 'bottom';
        const isForward = direction === 'right' || direction === 'top';
        const mergedBlocks = new Set<Block_2048>();

        for (let i = 0; i < 4; i++) {
            const indices = isForward ? [3, 2, 1, 0] : [0, 1, 2, 3];
            for (const j of indices) {
                const x = isVertical ? i : j;
                const y = isVertical ? j : i;
                const currIdx = this.index2to1(x, y);
                const currBlock = this.map[currIdx];

                if (!currBlock) continue;

                let checkX = x;
                let checkY = y;

                while (true) {
                    const nextX = checkX + delta.x;
                    const nextY = checkY + delta.y;
                    if (nextX < 0 || nextX >= 4 || nextY < 0 || nextY >= 4) break;

                    const nextIdx = this.index2to1(nextX, nextY);
                    const nextBlock = this.map[nextIdx];

                    if (nextBlock === null) {
                        this.map[nextIdx] = currBlock;
                        this.map[this.index2to1(checkX, checkY)] = null;
                        checkX = nextX;
                        checkY = nextY;
                        isMoved = true;
                    } else {
                        // 합치기 조건: 값 같음 + 타겟이 이번 턴에 합쳐진 적 없음 + 타겟이 대기중인 상태
                        if (currBlock.value === nextBlock.value && !mergedBlocks.has(nextBlock) && !nextBlock.upgraded) {
                            this.map[this.index2to1(checkX, checkY)] = null;
                            if(currBlock.value >= 1024) {
                                SoundManager.instance.playSfxOneShot(SfxNames_2048.Merge_1024);
                            }

                            totalScore += currBlock.value * 2;

                            nextBlock.node.setSiblingIndex(10);
                            currBlock.node.setSiblingIndex(5);

                            nextBlock.upgrade();
                            // 사라지는 블록은 map에서 즉시 제거되었으므로, upgradeOut만 실행
                            currBlock.upgradeOut(this.indexToVector(nextX, nextY), () => {
                                this.returnBlockToPool(currBlock);
                            });

                            mergedBlocks.add(nextBlock);
                            isMerged = true;
                        }
                        break;
                    }
                }
            }
        }

        if (isMoved || isMerged) {
            this.moveAllBlock();
            this.endTurn();
        }
        return { result: isMoved || isMerged, score: totalScore };
    }

    private getDelta(dir: string) {
        if (dir === 'left') return { x: -1, y: 0 };
        if (dir === 'right') return { x: 1, y: 0 };
        if (dir === 'top') return { x: 0, y: 1 };
        return { x: 0, y: -1 };
    }

    cancelMoveAllBlock() {
        this.map.forEach((block, i) => {
            if (block) {
                block.stopAction();
                const pos = this.indexToVectorFromIdx(i);
                block.node.setPosition(pos.x, pos.y, 0);
            }
        });

        // 맵에 없는 블록들(연출 중이거나 남겨진 것들) 정리
        this.blockList.forEach(b => {
            if (this.map.indexOf(b) < 0) {
                // upgradeMoved 중인 것은 놔두거나, 연타 시각화를 위해 즉시 꺼버릴 수 있습니다.
                // 여기서는 연타 안정성을 위해 맵에 없으면 즉시 정리합니다.
                if (!b.upgradeMoved) {
                    this.returnBlockToPool(b);
                }
            }
        });
    }

    moveAllBlock() {
        this.map.forEach((block, i) => {
            if (block) block.playMoveAction(this.indexToVectorFromIdx(i));
        });
    }

    addBlock() {
        const blanks = this.map.map((v, i) => v === null ? i : -1).filter(v => v !== -1);
        if (blanks.length === 0) return;

        const block = this.getBlockFromPool();
        if (block) {
            const targetIdx = blanks[Math.floor(Math.random() * blanks.length)];
            this.map[targetIdx] = block;
            block.node.active = true; // 활성화
            block.setNumber(Math.random() < 0.9 ? 2 : 4);
            block.setPosition(this.indexToVectorFromIdx(targetIdx));
            block.in();
        }
    }

    get checkGameOver(): boolean {
        if (this.map.indexOf(null) >= 0) return false;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const curr = this.map[this.index2to1(x, y)];
                if (!curr) continue;
                for (const d of [{ x: 1, y: 0 }, { x: 0, y: 1 }]) {
                    const nx = x + d.x, ny = y + d.y;
                    if (nx < 4 && ny < 4) {
                        const next = this.map[this.index2to1(nx, ny)];
                        if (next && next.value === curr.value) return false;
                    }
                }
            }
        }
        return true;
    }

    gameOver() { this.map.forEach(b => b?.gameOver()); }
    endTurn() { this.blockList.forEach(b => b.endTurn()); }
    index2to1(x: number, y: number) { return x + y * 4; }
    indexToVector(x: number, y: number) {
        return new Vec2(BlockDefaultPosition.x + x * BlockInterval.x, BlockDefaultPosition.y + y * BlockInterval.y);
    }
    indexToVectorFromIdx(i: number) {
        return this.indexToVector(i % 4, Math.floor(i / 4));
    }
}