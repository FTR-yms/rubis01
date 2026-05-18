import { _decorator, Component, instantiate, Prefab, Node, screen, EventTouch, clamp, EventHandler, Vec3, view, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import { BOARD_SIZE, BOARD_STATE, GAME_STATE, MONSTER_DISTANCE, gameState, wayToPosition } from "../config";
import { EventManager } from "../../Common/EventManager";
import { Jelly } from './Jelly';
import { Missions } from './Missions';
import Score from './Score';
import Points from './Points';
import { SfxNames_YummyJelly } from '../../Common/SoundNames';
import { SoundManager } from '../../Common/SoundManager';
import Mathf from '../../Common/Mathf';

@ccclass('Board')
export default class Board extends Component {
    @property(Prefab) monster: Prefab = null;

    @property(Node)
    private jellyParentNode: Node = null;

    @property(Node)
    private lineParentNode: Node = null;

    @property(EventHandler)
    private attack: EventHandler[] = [];

    @property(EventHandler)
    private gameOverCheck: EventHandler[] = [];

    @property(Missions)
    private missions: Missions = null;

    @property(Score)
    private score: Score = null;

    @property(Points)
    private points: Points = null;

    monsters: Jelly[][] = [];

    selectedMonsters: Jelly[] = [];
    diedMonsters: Jelly[] = [];

    magicEndCount = 0;
    dieEndCount = 0;
    moveMaxCount = 0;
    moveEndCount = 0;

    pointMaxCount = 0;
    pointEndCount = 0;

    // game: Game;

    state: BOARD_STATE;

    htmlCanvas: HTMLCanvasElement;

    onLoad() {
        for (let x = 0; x < BOARD_SIZE.width; x++) {
            this.monsters[x] = [];

            for (let y = 0; y < BOARD_SIZE.height; y++) {

                let monsterNode = instantiate(this.monster);

                let monster = monsterNode.getComponent(Jelly);
                monster.lineParent = this.lineParentNode;

                monsterNode.on(Node.EventType.TOUCH_START, () => {
                    this.selectMonster(monster);
                });
                this.node.addChild(monsterNode);

                // let magicNode = instantiate(this.magic);
                // let magic = magicNode.getComponent(Magic);
                // this.node.getChildByName('magic_board').addChild(magicNode);

                this.jellyParentNode.addChild(monster.node);

                // monster.magic = magic;
                // monster.reset();
                this.monsters[x][y] = monster;
            }
        }
        this.htmlCanvas = document.getElementById("GameCanvas") as HTMLCanvasElement;

        this.node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            let pos = event.touch.getUILocation();
            const screenSize = view.getVisibleSize();

            let mousePos: Vec2 = new Vec2(
                pos.x - screenSize.width / 2 - this.node.position.x,
                pos.y - screenSize.height / 2 - this.node.position.y - 17
            );

            let adjustPos = new Vec2(
                mousePos.x + (BOARD_SIZE.width * 0.5 * MONSTER_DISTANCE),
                (-mousePos.y) + (BOARD_SIZE.height * 0.5 * MONSTER_DISTANCE)
            );

            let mapX = Math.floor(adjustPos.x / MONSTER_DISTANCE);
            let mapY = Math.floor(adjustPos.y / MONSTER_DISTANCE);

            if (mapX < 0 || mapX >= BOARD_SIZE.width || mapY < 0 || mapY >= BOARD_SIZE.height) {
                return;
            }
            if (this.monsters[mapX][mapY] != null) {
                // if (Math.sqrt(Math.pow(x - mapX * monsterDis, 2) + Math.pow(-y - mapY * monsterDis, 2)) <= monsterDis / 2) {
                this.selectAddMonster(this.monsters[mapX][mapY]);
                // }
            }
        });

        this.node.on(Node.EventType.TOUCH_END, () => {
            if (this.state == BOARD_STATE.select) {
                this.selectEnd();
            }
        });

        this.node.on(Node.EventType.TOUCH_CANCEL, () => {
            if (this.state == BOARD_STATE.select) {
                this.selectEnd();
            }
        });

        this.node.getChildByName('magic_board').setSiblingIndex(99);
    }
    start() {
        let em = EventManager.instance;
        em.on('attackEnd', () => {
            this.magicEndCount += 1;
            if (this.diedMonsters.length == this.magicEndCount) {
                for (let i = 0; i < this.diedMonsters.length; i++) {
                    let index = -1;
                    // this.game = Game.Instance;

                    for (let j = 0; j < this.missions.colors.length; j++) {
                        if (this.diedMonsters[i].color == this.missions.colors[j]) {
                            index = j;
                        }
                    }

                    if (index == -1) {
                        this.diedMonsters[i].die();
                    }
                    else {
                        this.diedMonsters[i].trancePoint(this.missions.missions[index].node, index);
                    }
                }
            }
        });

        em.on('dieEnd', () => {
            this.dieEndCount += 1;
            if (this.diedMonsters.length == this.dieEndCount) {
                this.fallMonsters();
            }
        });

        em.on('trancePointEnd', (pos: Vec3, target: Node, index: number, color: number) => {
            this.points.addNewPoint(pos, target, index, color);

            this.dieEndCount += 1;

            if (this.diedMonsters.length == this.dieEndCount) {
                this.fallMonsters();
            }

            this.pointMaxCount += 1;

            // this.missions.countDown(index);
            // this.pointEndCount += 1;
            // if (this.pointMaxCount == this.pointEndCount) {
            //     this.missions.newNeed(index);

            //     this.gameOverCheck.forEach(event => {
            //         event.emit([event.customEventData]);
            //     });

            //     this.state = BOARD_STATE.none;
            // }
        });

        em.on('pointEnd', (_, index) => {
            // this.game = Game.Instance;
            this.missions.countDown(index);
            this.pointEndCount += 1;
            if (this.pointMaxCount == this.pointEndCount) {
                this.missions.newNeed(index);

                this.gameOverCheck.forEach(event => {
                    event.emit([event.customEventData]);
                });

                this.state = BOARD_STATE.none;
            }
        });

        em.on('moveEnd', () => {
            this.moveEndCount += 1;
            if (this.moveMaxCount == this.moveEndCount) {
                this.newMonsters();
            }
        });
    }
    reset() {
        for (let i = 0; i < BOARD_SIZE.width; i++) {
            for (let j = 0; j < BOARD_SIZE.height; j++) {
                this.monsters[i][j].node.active = false;
            }
        }
    }

    gameStart() {
        this.resetMap();
        this.startMapAction();
        this.state = BOARD_STATE.none;
    }
    gameOver() {
        for (let i = 0; i < BOARD_SIZE.width; i++) {
            for (let j = 0; j < BOARD_SIZE.height; j++) {
                this.monsters[i][j].gameOver();
            }
        }
    }
    resetMap() {
        for (let i = 0; i < BOARD_SIZE.width; i++) {
            for (let j = 0; j < BOARD_SIZE.height; j++) {
                this.monsters[i][j].node.active = true;
                this.monsters[i][j].setColor(this.getRandomColor());
            }
        }
    }
    startMapAction() {
        for (let x = 0; x < BOARD_SIZE.width; x++) {
            for (let y = 0; y < BOARD_SIZE.height; y++) {
                this.monsters[x][y].setPosition(x, y);
                this.monsters[x][y].appear();
            }
        }
    }
    selectMonster(monster: Jelly) {
        // this.game = Game.Instance;
        if (gameState != GAME_STATE.start || this.state != BOARD_STATE.none) {
            return;
        }
        // this.game.magician.binding();

        SoundManager.instance.playSfxOneShot(SfxNames_YummyJelly.Click);

        let { x, y } = monster.cellPos;

        this.state = BOARD_STATE.select
        this.selectedMonsters.push(this.monsters[x][y]);
        this.monsters[x][y].bind(-1, null);
    }
    selectAddMonster(monster: Jelly) {
        if (gameState != GAME_STATE.start || this.state != BOARD_STATE.select) {
            return;
        }
        if (this.state == BOARD_STATE.select) {
            const lastSelectedMonster = this.selectedMonsters[this.selectedMonsters.length - 1];

            
            let { x, y } = monster.cellPos;
            
            const way = this.isNextMonster(x, y);
            if (way != -1) {
                SoundManager.instance.playSfxOneShot(SfxNames_YummyJelly.Drag);
                this.monsters[x][y].bind(way, lastSelectedMonster.node.position);
                this.selectedMonsters.push(this.monsters[x][y]);
            }
            else if (this.isBeforeMonster(x, y)) {
                SoundManager.instance.playSfxOneShot(SfxNames_YummyJelly.Drag);
                this.selectedMonsters[this.selectedMonsters.length - 1].bindCancel();
                this.selectedMonsters.pop();
            }

        }
    }
    test(target: any): boolean {
        for (let i = 0; i < this.selectedMonsters.length; ++i) {
            if (this.selectedMonsters[i] == target) {
                return true;
            }
        }

        return false;
    }
    isNextMonster(x: number, y: number) {
        const lastSelectedMonster = this.selectedMonsters[this.selectedMonsters.length - 1];

        for (let i = 0; i < wayToPosition.length; i++) {
            if (
                !this.test(this.monsters[x][y]) &&
                this.monsters[x][y].color == this.selectedMonsters[0].color &&
                lastSelectedMonster.cellPos.x + wayToPosition[i].x == x &&
                lastSelectedMonster.cellPos.y + wayToPosition[i].y == y
            ) {
                return (8 + i - 4) % 8;
            }
        }

        return -1;
    }
    isBeforeMonster(x: number, y: number) {
        const monster = this.selectedMonsters[this.selectedMonsters.length - 2] || null;
        return monster != null && x == monster.cellPos.x && y == monster.cellPos.y;
    }
    selectEnd() {
        // this.game = Game.Instance;
        if (this.selectedMonsters.length == 1) {
            this.state = BOARD_STATE.none;
            this.selectedMonsters[0].bindCancel();
            // this.game.magician.idle();
        }
        else {
            this.state = BOARD_STATE.process;
            this.magicAttack();


            this.attack.forEach(val => {
                val.emit([val.customEventData]);
            });
        }

        this.selectedMonsters = [];
    }
    magicAttack() {
        this.magicEndCount = 0;
        this.dieEndCount = 0;
        this.pointMaxCount = 0;
        this.pointEndCount = 0;


        for (let i = 0; i < this.selectedMonsters.length; i++) {
            this.diedMonsters.push(this.selectedMonsters[i]);
        }

        // Delay
        for (let i = 0; i < this.selectedMonsters.length; i++) {
            this.selectedMonsters[i].magicAttack();
        }

    }
    fallMonsters() {
        for (let i = 0; i < this.diedMonsters.length; i++) {
            this.monsters[this.diedMonsters[i].cellPos.x][this.diedMonsters[i].cellPos.y] = null;
        }
        this.moveMaxCount = 0;
        this.moveEndCount = 0;


        for (let x = 0; x < BOARD_SIZE.width; x++) {
            for (let y = BOARD_SIZE.height - 1; y > 0; y--) {
                if (this.monsters[x][y] == null) {
                    for (let i = y - 1; i >= 0; i--) {
                        if (this.monsters[x][i] != null) {
                            this.monsters[x][y] = this.monsters[x][i];
                            this.monsters[x][i] = null;

                            this.moveMaxCount += 1;

                            this.monsters[x][y].movePosition(x, y);
                            break;
                        }
                    }
                }
            }
        }

        if (this.moveEndCount == this.moveMaxCount) {
            this.newMonsters();
        }
    }
    newMonsters() {
        // this.game = Game.Instance;
        this.score.score += Math.max(this.diedMonsters.length - 2, 1) * 5 * this.diedMonsters.length * 3;



        for (let x = 0; x < BOARD_SIZE.width; x++) {
            for (let y = 0; y < BOARD_SIZE.height; y++) {
                if (this.monsters[x][y] == null) {
                    this.monsters[x][y] = this.diedMonsters.pop();
                    this.monsters[x][y].reset();
                    this.monsters[x][y].setColor(this.getRandomColor());
                    this.monsters[x][y].setPosition(x, y);
                    this.monsters[x][y].appear();
                }
            }
        }

        // this.game = Game.Instance;
        if (this.pointMaxCount == 0) {
            this.gameOverCheck.forEach(event => {
                event.emit([event.customEventData]);
            });

            this.state = BOARD_STATE.none;
        }

        this.diedMonsters = [];
    }
    logMap() {
        for (let y = 0; y < BOARD_SIZE.height; y++) {
            let text = '';
            for (let x = 0; x < BOARD_SIZE.width; x++) {
                text += this.monsters[x][y].color + ' ';
            }
        }
    }

    getRandomColor() {
        return Mathf.randomInt(0, 6);
    }
}

