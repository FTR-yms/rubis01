import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

class Store
{
    public readonly ShowBlockSize : Vec2 = new Vec2(35, 35);
    public readonly ClickBlockSize : Vec2 = new Vec2(35, 35);
    public readonly InsertBlockSize : Vec2 = new Vec2(45, 45);

    public readonly ClickBlockPadding : number = 10;

    public readonly levelRule : number[] = [ 2, 5 ];

    public readonly timeScore : number = 90;
    public level : number = 0;

    public gameCode : string = '';
}

const store : Store = new Store();
export default store;