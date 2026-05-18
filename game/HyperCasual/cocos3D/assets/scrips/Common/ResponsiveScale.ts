import { _decorator, Component, math, Node, Vec3, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ResponsiveScale")
export class ResponsiveScale extends Component {
    private defaultPos: Vec3 = new Vec3();
    private defaultScale: Vec3 = new Vec3();

    private defaultResolution: math.Size = new math.Size();
    private pos: Vec3 = new Vec3();
    private scale: Vec3 = new Vec3();

    private aspect: number = 0;

    private resizeCallback = null;

    protected onLoad(): void {
        this.defaultPos = this.node.position.clone();
        this.defaultScale = this.node.scale.clone();

        this.defaultResolution = view.getDesignResolutionSize();
        this.aspect = this.defaultResolution.x / this.defaultResolution.y;

        this.resizeCallback = this.resize.bind(this);

        window.addEventListener("resize", this.resizeCallback);
        this.resize();
    }

    protected onDestroy(): void {
        window.removeEventListener("resize", this.resizeCallback);
    }

    public resize() {
        let curAspect = view.getVisibleSize().x / view.getVisibleSize().y;
        if (this.aspect > curAspect) {
            this.scale.x = (curAspect / this.aspect) * this.defaultScale.x;
            this.scale.y = (curAspect / this.aspect) * this.defaultScale.y;

            // let heightDifference =
            //   view.getVisibleSize().y - this.defaultResolution.y * this.scale.y;
            // this.pos.y = this.defaultPos.y + heightDifference * 0.5;
        } else {
            // this.pos.y = this.defaultPos.y;

            this.scale.x = this.defaultScale.x;
            this.scale.y = this.defaultScale.y;
        }

        this.node.setScale(this.scale.x, this.scale.y);
        //   this.node.setScale(this.scale);
    }
}
