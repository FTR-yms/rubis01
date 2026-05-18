// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Prefab, Node, TextAsset, Vec2, Vec3, Button } from 'cc';
const { ccclass, property } = _decorator;

import { Pool } from "../../Common/Pool";
import { EventManager } from "../../Common/EventManager";
import {
    ScorePerAngle,
    CharacterHitTime,
    CoinDistanceMaxLevel,
    CoinMaxDistance,
    CoinMinDistance,
    GameEvent,
    GameState,
    HurdleDistance,
    MinSpeed,
    ScoreUpAngle,
    SpawnAngle,
    MaxSpeed,
    EnemyStartAngle,
    EnemyDistance,
    EnemySpeed,
    EnemyMinAngle, EnemyMaxAngle, EnemyHitSpeed, ScreenSize, IdCoinSpawnAngle, EnemyCatchAngle,
    AccPerSecond
} from "../utilScript/Config_CircleRun";
import Character_CircleRun from "./Character_CircleRun";
import Background_CircleRun from "./Background_CircleRun";
import Store from "../utilScript/Store_CircleRun";
import Coin_CircleRun from "./Coin_CircleRun";
import Hurdle_CircleRun from "./Hurdle_CircleRun";
import Pattern from "./Pattern";
import Enemy_CircleRun from "./Enemy_CircleRun";
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_CircleRun } from '../../Common/SoundNames';

@ccclass('Board_CircleRun')
export default class Board_CircleRun extends Component {
    @property(Pool) coinPool: Pool = null;
    @property(Pool) hurdlePool: Pool = null;
    @property(Character_CircleRun) character: Character_CircleRun = null;
    @property(Enemy_CircleRun) enemy: Enemy_CircleRun = null;
    @property(Background_CircleRun) background: Background_CircleRun = null;
    @property(Button) jumpButton: Button = null;

    @property(TextAsset) patternFiles: TextAsset[] = [];
    @property(TextAsset) feverPatternFiles: TextAsset[] = [];

    coins: Coin_CircleRun[] = null;
    hurdles: Hurdle_CircleRun[] = null;
    scoreAngle: number = 0;
    idCoinAngle: number = 0;
    patternAngle: number = 0;
    hurdleAngle: number = 0;
    hurdleIndex: number = 0;
    coinAngle: number = 0;
    coinIndex: number = 0;
    enemyAngle: number = 0;
    isHited: boolean = false;
    isCatched: boolean = false;
    hitTime: number = CharacterHitTime;
    patterns: Pattern[] = null;
    selectedPattern: Pattern = null;
    feverPatterns: Pattern[] = null;
    selectedFeverPattern: Pattern = null;
    feverPatternAngle: number = 0;
    feverCoinAngle: number = 0;
    feverCoinIndex: number = 0;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        Store.speed = 0;

        this.coins = [];
        this.hurdles = [];
    }
    start() {
        EventManager.instance?.on(GameEvent.coinPooling, (coin: Coin_CircleRun) => {
            this.poolingCoin(coin);
        });

        EventManager.instance?.on(GameEvent.characterHit, () => {
            this.isHited = true;
            this.hitTime = 0;
            Store.speed = 0;
        });

        this.jumpButton.node.on(Node.EventType.TOUCH_START, () => {
            // SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Button);
            this.character.jump();
        });

        this.patterns = [];
        for (let i = 0; i < this.patternFiles.length; i++) {
            this.patterns.push(new Pattern(this.patternFiles[i].text));
        }

        this.feverPatterns = [];
        for (let i = 0; i < this.feverPatternFiles.length; i++) {
            this.feverPatterns.push(new Pattern(this.feverPatternFiles[i].text));
        }
        this.setEnemyAngle(EnemyStartAngle);
    }
    update(dt) {
        if (Store.gameState === GameState.start) {
            if (this.isCatched) {
                this.setEnemyAngle(this.enemyAngle + EnemyHitSpeed * dt);
                if (this.enemyAngle <= 0) {
                    EventManager.instance?.emit(GameEvent.gameOver);
                    this.enemy.catch();
                    this.character.node.active = false;
                    // this.character.die();
                }
                return;
            }

            if (this.isHited) {
                this.hitTime += dt;

                if (this.hitTime >= CharacterHitTime) {
                    this.isHited = false;
                    Store.speed = MinSpeed;
                }
            }

            if (!this.isHited && !Store.isFever) {
                Store.speed += AccPerSecond * dt;
                Store.speed = Math.min(Store.speed, MaxSpeed);
            }

            Store.totalAngle += Store.speed * dt;
            this.scoreAngle += Store.speed * dt;
            if (this.scoreAngle > ScoreUpAngle) {
                this.scoreAngle -= ScoreUpAngle;
                EventManager.instance?.emit(GameEvent.scoreUp, ScorePerAngle * (Store.isFever ? 2 : 1));
            }


            console.log(this.idCoinAngle);

            if (!Store.isFever) {
                if (!Store.idCoinSpawnable) {
                    this.idCoinAngle += Store.speed * dt;
                    if (this.idCoinAngle > IdCoinSpawnAngle) {
                        this.idCoinAngle = 0;
                        Store.idCoinSpawnable = true;
                    }
                }

                this.hurdleAngle += Store.speed * dt;
                if (this.hurdleIndex < this.selectedPattern.hurdleAngles.length && this.hurdleAngle > this.selectedPattern.hurdleAngles[this.hurdleIndex]) {
                    this.spawnHurdle();
                    this.hurdleIndex += 1;
                }

                this.coinAngle += Store.speed * dt;
                if (this.coinIndex < this.selectedPattern.coinAngles.length && this.coinAngle > this.selectedPattern.coinAngles[this.coinIndex]) {
                    this.spawnCoin(this.selectedPattern.coinDistanceLevels[this.coinIndex]);
                    this.coinIndex += 1;
                }

                this.patternAngle += Store.speed * dt;
                if (this.patternAngle > this.selectedPattern.totalAngle) {
                    this.patternAngle -= this.selectedPattern.totalAngle;
                    this.changePattern();
                }
            }
            else {
                this.feverCoinAngle += Store.speed * dt;
                if (this.feverCoinIndex < this.selectedFeverPattern.coinAngles.length && this.feverCoinAngle > this.selectedFeverPattern.coinAngles[this.feverCoinIndex]) {
                    this.spawnCoin(this.selectedFeverPattern.coinDistanceLevels[this.feverCoinIndex]);
                    this.feverCoinIndex += 1;
                }

                this.feverPatternAngle += Store.speed * dt;
                if (this.feverPatternAngle > this.selectedFeverPattern.totalAngle) {
                    this.feverPatternAngle -= this.selectedFeverPattern.totalAngle;
                    this.changeFeverPattern();
                }
            }

            if (this.isHited) {
                this.setEnemyAngle(this.enemyAngle + EnemyHitSpeed * dt);
                if (this.enemyAngle <= EnemyCatchAngle) {
                    this.isCatched = true;
                }
            }
            else {
                this.setEnemyAngle(this.enemyAngle + EnemySpeed * dt);
            }


            for (let i = 0; i < this.coins.length; i++) {
                if (this.coins[i].isPoped) {
                    continue;
                }
                this.coins[i].angle += Store.speed * dt;

                this.coins[i].node.angle = this.coins[i].angle;
                this.coins[i].node.setPosition(this.getAngleToPosition(this.coins[i].angle, CoinMaxDistance - (CoinMaxDistance - CoinMinDistance) / (CoinDistanceMaxLevel - 1) * this.coins[i].distanceLevel));
            }

            for (let i = 0; i < this.coins.length; i++) {
                if (this.coins[i].angle > -SpawnAngle) {
                    this.poolingCoin(this.coins[i]);
                }
            }

            for (let i = 0; i < this.hurdles.length; i++) {
                this.hurdles[i].angle += Store.speed * dt;

                this.hurdles[i].node.angle = this.hurdles[i].angle;
                this.hurdles[i].node.setPosition(this.getAngleToPosition(this.hurdles[i].angle, HurdleDistance));
            }

            for (let i = 0; i < this.hurdles.length; i++) {
                if (this.hurdles[i].angle > -SpawnAngle) {
                    this.poolingHurdle(this.hurdles[i]);
                }
            }
        }
    }

    refresh() {
        Store.totalAngle = 0;
        Store.feverCount = 0;
        Store.goldCoinCount = 0;
        Store.idCoinCount = 0;
        Store.jewelCoinCount = 0;
        Store.characterHitCount = 0;

        Store.idCoinSpawnable = false;
        Store.isFever = false;

        this.idCoinAngle = 0;
        this.scoreAngle = 0;

        this.isHited = false;
        this.isCatched = false;
        this.hitTime = CharacterHitTime;

        for (let i = 0; i < this.coins.length; i++) {
            this.poolingCoin(this.coins[i]);
        }

        for (let i = 0; i < this.hurdles.length; i++) {
            this.poolingHurdle(this.hurdles[i]);
        }

        this.character.node.active = true;
        this.character.ready();
        this.enemy.refresh();
        this.setEnemyAngle(EnemyStartAngle);
    }

    gameStart() {
        Store.speed = MinSpeed;

        this.character.run();

        this.changePattern();
        this.changeFeverPattern();

        this.setEnemyAngle(EnemyStartAngle);
    }

    gameOver() {
    }

    feverStart() {
        this.background.feverStart();
        for (let i = 0; i < this.hurdles.length; i++) {
            this.hurdles[i].hit();
        }
    }
    feverEnd() {
        this.background.feverEnd();
    }
    spawnCoin(distanceLevel: number) {
        let node = this.coinPool.get() as Node;
        let coin = node.getComponent(Coin_CircleRun);
        coin.reset(Store.isFever);
        coin.angle = SpawnAngle;
        coin.distanceLevel = distanceLevel;

        node.angle = SpawnAngle;
        node.setPosition(this.getAngleToPosition(SpawnAngle, CoinMaxDistance - (CoinMaxDistance - CoinMinDistance) / (CoinDistanceMaxLevel - 1) * coin.distanceLevel));
        this.coins.push(coin);
    }
    poolingCoin(coin: Coin_CircleRun) {
        this.coins.splice(this.coins.findIndex(item => item === coin), 1);
        this.coinPool.return(coin.node);
    }
    spawnHurdle() {
        let node = this.hurdlePool.get() as Node;
        let hurdle = node.getComponent(Hurdle_CircleRun);
        hurdle.reset();
        hurdle.angle = SpawnAngle;
        node.angle = SpawnAngle;
        node.setPosition(this.getAngleToPosition(SpawnAngle, HurdleDistance));
        this.hurdles.push(hurdle);
    }
    poolingHurdle(hurdle: Hurdle_CircleRun) {
        this.hurdles.splice(this.hurdles.findIndex(item => item === hurdle), 1);
        this.hurdlePool.return(hurdle.node);
    }
    getAngleToPosition(angle: number, distance) {
        let calcAngle = (angle - 90) / 180 * Math.PI;
        return new Vec3(Math.cos(calcAngle) * distance, Math.sin(calcAngle) * distance);
    }
    changePattern() {
        let index = Math.floor(Math.random() * this.patterns.length);
        this.selectedPattern = this.patterns[index];
        this.hurdleIndex = 0;
        this.hurdleAngle = 0;
        this.coinIndex = 0;
        this.coinAngle = 0;
    }
    changeFeverPattern() {
        this.selectedFeverPattern = this.feverPatterns[Math.floor(Math.random() * this.feverPatterns.length)];
        this.feverCoinIndex = 0;
        this.feverCoinAngle = 0;
    }
    setEnemyAngle(angle: number) {
        this.enemyAngle = angle;
        this.enemyAngle = Math.max(this.enemyAngle, EnemyMinAngle);
        this.enemyAngle = Math.min(this.enemyAngle, EnemyMaxAngle);
        this.enemy.node.angle = this.enemyAngle;
        this.enemy.node.setPosition(this.getAngleToPosition(this.enemyAngle, EnemyDistance));
    }
}
