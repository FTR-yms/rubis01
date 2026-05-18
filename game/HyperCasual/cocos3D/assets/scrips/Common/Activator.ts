import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Activator')
export class Activator extends Component {
    public setActiveStr(component : Component, active : string) {
        this.setActive(active === "true");
    }

    public setActive(active : boolean) {
        this.node.active = active;
    }
}


