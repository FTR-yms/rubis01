import { _decorator, Component, Label } from 'cc';
const {ccclass, property} = _decorator;

import { ScoreManager } from '../../Common/ScoreManager';

@ccclass('Score')
export default class Score extends Component {
    private _score: number = 0;
    get score() {
        return this._score;
    }
    set score( score: number ) {
        this._score = score;
        ScoreManager.instance.setScore(score);

        // this.label.setPivot( 0, 0.5 );
        this.scoreLabel.string = this._score.toString();
    }

    @property(Label)
    private scoreLabel : Label = null;
    onLoad () {
    }
    start () {
    }
   // update (dt) {}
    reset() {
        this.score = 0;
    }
}
