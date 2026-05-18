import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('Stair')
export class Stair extends Component {
    private pass : boolean = false;

    set Pass(pass : boolean) {
        this.pass = pass;
    }

    get Pass() {
        return this.pass;
    }
}