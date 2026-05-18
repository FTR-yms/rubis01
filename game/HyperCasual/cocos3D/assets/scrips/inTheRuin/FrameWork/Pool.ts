import { _decorator, Component, Node, Prefab, instantiate, CCString } from 'cc';
const { ccclass, property } = _decorator;

export enum PoolKey {
    stair = 'stair',
    startpoint = 'startpoint',
    background = 'background',
    player = 'char_1',
    item = 'item',
    landeff = 'landeff',
}

@ccclass('PrefabPool')
class PrefabPool{

    @property(Prefab)
    public prefab : Prefab;
    
    @property({type : CCString})
    public name : String = new String();
}

@ccclass('Pool')
export class Pool extends Component {

    @property(PrefabPool)
    prefab: Array<PrefabPool> = [];

    private static _instance : Pool = null;
    private objectPool : Map<String, Array<Node>>  = new Map<String, Array<Node>>();
    private prefabPool : Map<String, Prefab> = new Map<String, Prefab>();

    static get Instance() {
        if(Pool._instance === null)
        {
            console.log("not find Pool");
            return null
        }

        return Pool._instance;
    }

    onLoad() {
        Pool._instance = this;

        for(let i = 0; i < this.prefab.length; ++i)
        {
            this.prefabPool.set(this.prefab[i].name, this.prefab[i].prefab);
            this.objectPool.set(this.prefab[i].name,[]);
        }
    }

    getObject(key : string) : Node {
        let node : Node = null;

        if(!this.objectPool.get(key).length)
        {
            this.objectPool.get(key).push(instantiate(this.prefabPool.get(key)));
        }
        
        node = this.objectPool.get(key).shift();
        node.setParent(this.node);
        node.active = true;

        return node;
    }

    returnObject(key : string, object : Node) {
        if(!object)
        {
            return;
        }

        object.active = false;
        this.objectPool.get(key).push(object);
    }
}

