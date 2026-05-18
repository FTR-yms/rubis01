import { _decorator, Component, Label } from 'cc';
const {ccclass, property} = _decorator;

import {DEFAULT_SHOT_COUNT} from "../config";

@ccclass('Shot')
export default class Shot extends Component {
    @property(Label)
    private text : Label = null;

    private _shot: number = DEFAULT_SHOT_COUNT;
    get shot() {
        return this._shot;
    }
    set shot( shot: number ) {
        this._shot = Math.max( shot, 0 );
        this.text.string = this._shot.toString();

        // this.imageFont.setText( this._shot.toString().padStart( 2, '0' ) );
    }
    start () {
        this.reset();
    }
   // update (dt) {}
    reset() {
        this.shot = DEFAULT_SHOT_COUNT;
    }
}

