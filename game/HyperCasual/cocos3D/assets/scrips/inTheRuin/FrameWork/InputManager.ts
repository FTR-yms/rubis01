import { _decorator, Component, Node, input, Input, EventTouch, EventKeyboard, KeyCode, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component {

    private static _instance : InputManager = null;
    private upKey : {} = {};
    private downKey : {} = {};
    private pressingKey : {} = {};
    private isPress : boolean = false;
    private isSetKey : boolean = false;

    private curKey : KeyCode = null;

    static get Instance() { 
        if(!InputManager._instance)
        {
            console.log("not find InputManager");
        }

        return InputManager._instance;
    }

    setKey(key : KeyCode, is : boolean = true) {
        this.curKey = key;
        this.downKey[key] = is;
    }

    getKeyDown(key : KeyCode) : boolean {
        let value = this.downKey[key];
        if(value)
        {
            this.downKey[key] = false;
        }
        return value;
    }
 
    getKeyUp(key : KeyCode) : boolean {
        let value = this.upKey[key];
        if(value)
        {
            this.upKey[key] = false;
        }
        return value;
    }

    getKeyPressing(key : KeyCode) : boolean {
        return this.pressingKey[key];
    }

    onLoad() {
        InputManager._instance = this;

        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseDown(e : EventMouse) {

    }

    onMouseUp(e : EventMouse) {

    }

    onTouchStart(e: EventTouch) {
    }

    onTouchCancel(e: EventTouch) {

    }

    onTouchEnd(e: EventTouch) {

    }

    onKeyDown(e: EventKeyboard) {
        this.downKey[e.keyCode] = true;
    }

    onKeyUp(e: EventKeyboard) {
        this.upKey[e.keyCode] = true;
        this.downKey[e.keyCode] = false;
        this.pressingKey[e.keyCode] = false;
        this.isPress = false;
    }

    onKeyPressing(e: EventKeyboard) {
        this.pressingKey[e.keyCode] = true;
        this.isPress = true;
    }
}

