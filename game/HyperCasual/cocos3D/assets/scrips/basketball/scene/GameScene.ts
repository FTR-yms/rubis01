// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, TextAsset, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

import physics from "../ctrl/physics";
import store from "../data/store";
import Level from "../data/level";
import GameMnager from "../ctrl/gameManager";
import { SoundManager } from "../../Common/SoundManager";
import Util from '../../Common/Util';
import { GameStartIntro } from '../../Common/GameStartIntro';
import { GameEndOutro } from '../../Common/GameEndOutro';
import { ResultPopup } from '../../Common/ResultPopup';
import { ANIMATION_CONFIG } from '../../Common/Constants';
import { ScoreManager } from '../../Common/ScoreManager';

@ccclass('GameScene')
export default class GameScene extends Component {
    @property(TextAsset) levelCsv: TextAsset = null;
    @property(TextAsset) rangeCsv: TextAsset = null;

    @property(GameStartIntro)
    private startIntro: GameStartIntro = null;

    @property(GameEndOutro)
    private endOutro: GameEndOutro = null;

    @property(ResultPopup)
    private resultPopup: ResultPopup = null;

    private waitTween: Tween<Node> = null;

    onLoad() {
        // store.level = new Level();
        store.level = new Level(Util.csvParse(this.levelCsv.text), Util.csvParse(this.rangeCsv.text));

        GameMnager.Instance.node.on('goal', this.onGoal.bind(this));
        // GameMnager.Instance.node.on('out', this.onOut.bind(this));


        GameMnager.Instance.node.on('updateScore', (score: number) => {
            ScoreManager.instance.setScore(score);
        });
        GameMnager.Instance.node.on('gameOver', this.gameOver.bind(this));
    }

    start() {
        this.scheduleOnce(() => {
            this.readyGame();
        })
        // IFrame.Instance.ready();
    }

    readyGame() {
        GameMnager.Instance.readyGame();
        this.startIntro.play();

        this.scheduleOnce(() => {
            GameMnager.Instance.startGame();
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    gameOver(score: number) {
        this.endOutro.play();

        this.scheduleOnce(() => {
            this.resultPopup.open(score);
        }, ANIMATION_CONFIG.END_FX.TIME);
    }

    update(dt) {
        physics.update(dt);
    }

    onGoal() {
        if (this.waitTween) {
            this.waitTween.stop();
        }

        this.waitTween = tween(this.node)
            .delay(1)
            .call(() => {
                GameMnager.Instance.startTurn();
            })
            .start();
    }

    // onOut() {
    //     if (this.waitTween) {
    //         this.waitTween.stop();
    //     }

    //     this.waitTween = tween(this.node)
    //         .delay(1.5)
    //         .call(() => {
    //             //게임오버
    //             GameMnager.Instance.gameOver();
    //         })
    //         .start();
    // }

}