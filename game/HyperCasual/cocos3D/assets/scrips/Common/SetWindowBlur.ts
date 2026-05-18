import { Component, _decorator, game } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class SetWindowBlur extends Component {

    private onFocuscall : any = this.onFocus.bind(this);
    private onBlurCall : any = this.onBlur.bind(this);

    onLoad () {
        window.addEventListener( 'focus', this.onFocuscall );
        window.addEventListener( 'blur', this.onBlurCall );
    }

    onFocus() {
        game.resume();
    }

    onBlur() {
        game.pause();
    }

    onDestroy() {
        window.removeEventListener( 'focus', this.onFocuscall );
        window.removeEventListener( 'blur', this.onBlurCall );
    }
}
