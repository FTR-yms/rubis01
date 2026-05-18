import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export class Pool extends Component {
    @property({ type: Prefab })
    private prefab: Prefab;

    @property(Node)
    private parentNode: Node = null;

    @property(Node)
    private disableContainer : Node = null;

    public get enableParent() {
        return this.parentNode || this.node;
    }

    private pool: NodePool = new NodePool();

    public get(): Node {
        let node: Node = null;

        if (this.pool.size() <= 0) {
            this.pool.put(instantiate(this.prefab));
        }

        node = this.pool.get();
        node.active = true;

        if (this.parentNode) {
            this.parentNode.addChild(node);
        } else {
            this.node.addChild(node);
        }

        return node;
    }

    public return(node: Node): void {
        if(this.disableContainer) {
            node.setParent(this.disableContainer);
        }

        node.active = false;
        this.pool.put(node);
    }
}


