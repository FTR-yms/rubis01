import { _decorator, Component, Node, Vec2, Rect } from 'cc';
const {ccclass, property} = _decorator;

import Mathf from '../../Common/Mathf';

@ccclass('Following')
export default class Following extends Component {
    @property(Node) target: Node = null;
    @property(Vec2) private offset : Vec2 = new Vec2();

    private scale : number = 1;
    private deltaRate : number = 0.24;
    private bounds : Rect = new Rect( 0, 0, 0, 0 );
    start () {
        this.bounds.xMin = -Infinity;
        this.bounds.xMax = Infinity;
        this.bounds.yMin = -Infinity;
        this.bounds.yMax = Infinity;
    }
    update ( dt : number ) {

        if( this.target ) {
        this.setPosition( (this.target.position.x * this.scale) - this.offset.x, (this.target.position.y * this.scale) - this.offset.y, dt);
        }

    }
    setPosition(x : number, y : number, delta : number)
    {
        var t = delta / this.deltaRate;
        if( t > 1 ) {
        t = 1;
        }
     
        let posX = Mathf.lerp(this.node.position.x, x, t);
        let posY = Mathf.lerp(this.node.position.y, y, t);
       //this.position.x = x;
       //this.position.y = y;
        if( posX < this.bounds.xMin )
        {
            posX = this.bounds.xMin;
        }
        else if( posX > this.bounds.xMax )
        {
            posX = this.bounds.xMax;
        }
        if( posY < this.bounds.yMin )
        {
            posY = this.bounds.yMin;
        }
        else if( posY > this.bounds.yMax )
        {
            posY = this.bounds.yMax;
        }
        this.node.setPosition( posX, posY );
    }
}
