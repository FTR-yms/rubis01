import { _decorator, macro, Component, Node, Vec2, EventTouch, UITransform, Vec3, view, KeyCode, input, EventKeyboard } from 'cc';
import { Singleton } from './Singleton';
const { ccclass, property } = _decorator;

enum INPUT_STATE {
    none,
    start,
    stay,
    up
};

@ccclass('InputManager')
export default class InputManager extends Singleton<InputManager>() {
    private _keyArr: { keyCode: number, state: INPUT_STATE }[] = [];
    private _keys: {} = {};

    @property(UITransform) private canvas: UITransform = null;
    @property(Node) private screen: Node = null;

    @property
    private isScreenPoint: boolean = false;

    private _pointerState: INPUT_STATE = INPUT_STATE.none;
    private _pointerPosition: Vec2 = new Vec2();
    private frame: number = 0;
    private inputFrame: number = 0;

    private screenUITrans: UITransform;

    public ScreenWidth(): number {
        return this.canvas.width;
    }

    public ScreenWidthHalf(): number {
        return this.canvas.width / 2;
    }


    public onLoad() {
        super.init();

        if (this.screen) {
            this.screen.on(Node.EventType.MOUSE_DOWN, this._onMouseDown.bind(this));
            this.screen.on(Node.EventType.MOUSE_UP, this._onMouseUp.bind(this));
            this.screen.on(Node.EventType.MOUSE_MOVE, this._onMouseMove.bind(this));

            this.screen.on(Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
            this.screen.on(Node.EventType.TOUCH_END, this._onTouchEnd.bind(this));
            this.screen.on(Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this));
            this.screen.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel.bind(this));

            this.screenUITrans = this.screen.getComponent(UITransform);
        }
    }

    public onDestroy() {
        this.term();
    }

    public update(dt: number) {
        const count = this._keyArr.length;
        for (let i = 0; i < count; i++) {
            const key = this._keyArr[i];
            if (key.state === INPUT_STATE.start) {
                key.state = INPUT_STATE.stay;
            }
            else if (key.state === INPUT_STATE.up) {
                key.state = INPUT_STATE.none;
            }
        }

        if (this._pointerState === INPUT_STATE.start && this.inputFrame !== this.frame) {
            this._pointerState = INPUT_STATE.stay;
        }
        else if (this._pointerState === INPUT_STATE.up && this.inputFrame !== this.frame) {
            this._pointerState = INPUT_STATE.none;
        }

        this.frame++;
    }
    public getKeyStay(keyCode: number): boolean {
        if (this._keys[keyCode]) {
            return this._keys[keyCode].state === INPUT_STATE.stay;
        }
        return false;
    }
    public getKeyDown(keyCode: number): boolean {
        if (this._keys[keyCode]) {
            return this._keys[keyCode].state === INPUT_STATE.start;
        }
        return false;
    }
    public getKeyUp(keyCode: number): boolean {
        if (this._keys[keyCode]) {
            return this._keys[keyCode].state === INPUT_STATE.up;
        }
        return false;
    }
    public getPointerDown(): boolean {
        return this._pointerState === INPUT_STATE.start;
    }
    public getPointerStay(): boolean {
        return this._pointerState === INPUT_STATE.stay;
    }
    public getPointerUp(): boolean {
        return this._pointerState === INPUT_STATE.up;
    }
    public getPointerPosition(target: Vec2 | null = null): Vec2 | null {
        if (!target) {
            target = new Vec2();
        }
        target.set(this._pointerPosition);
        return target;
    }

    public getPointerPositionOrigin(): Vec2 {
        return this._pointerPosition;
    }
    public getPointerPositionWorld(): Vec3 {
        let uiPos: Vec2 = this.getPointerPosition();
        return this.screenUITrans.convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y));
    }


    private _onMouseDown(event: EventTouch) {
        if (this._pointerState === INPUT_STATE.none) {
            this.inputFrame = this.frame;
            this._pointerState = INPUT_STATE.start;
            this._updateScreenPosition(event);
        }
    }
    private _onMouseUp(event) {
        if (this._pointerState === INPUT_STATE.start || this._pointerState === INPUT_STATE.stay) {
            this.inputFrame = this.frame;
            this._pointerState = INPUT_STATE.up;
        }
    }
    private _onMouseMove(event: EventTouch) {
        this._updateScreenPosition(event);
    }
    private _onTouchStart(event: EventTouch) {
        if (this._pointerState === INPUT_STATE.none) {
            this.inputFrame = this.frame;
            this._pointerState = INPUT_STATE.start;
            this._updateScreenPosition(event);
        }
    }
    private _onTouchEnd(event) {
        if (this._pointerState === INPUT_STATE.start || this._pointerState === INPUT_STATE.stay) {
            this.inputFrame = this.frame;
            this._pointerState = INPUT_STATE.up;
        }
    }
    private _onTouchMove(event: EventTouch) {
        this._updateScreenPosition(event);
    }
    private _onTouchCancel(event) {
        if (this._pointerState === INPUT_STATE.start || this._pointerState === INPUT_STATE.stay) {
            this._pointerState = INPUT_STATE.up;
        }
    }
    private _updateScreenPosition(event: EventTouch) {
        if (this.screen) {
            if (!this.isScreenPoint) {
                let test = document.getElementById("GameCanvas") as HTMLCanvasElement;
                const pos = event.getLocation();
                let tempPos = pos.multiplyScalar(this.canvas.width / test.width);
                this._pointerPosition = tempPos;
            } else {
                const worldPoint = event.getUILocation();
                const pos = new Vec3(0, 0);
                this.canvas.convertToNodeSpaceAR(new Vec3(worldPoint.x, worldPoint.y, 0), pos);
                this._pointerPosition.set(pos.x, pos.y);
            }
        }
    }
}
