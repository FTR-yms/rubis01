import { _decorator, Component, Node, sp, Enum, resources } from 'cc';
import { ResourceData, ResourceType } from '../Util/Config';
import Store from '../Util/Store';
const { ccclass, property } = _decorator;

@ccclass('ChangeResources')
export class ChangeResources extends Component {
    @property({type : Enum(ResourceType)})
    private type : ResourceType = ResourceType.Logo;

    start(){
        const spine = this.node.getComponent(sp.Skeleton);
        
        const resouce : ResourceData = Store.resources.find((val) => val.type === this.type)
        
        if(resouce){
            const startAni : string = spine.animation;
            let skeletonData = new sp.SkeletonData();
            
            skeletonData.textures.push(resouce.texture);
            skeletonData.textureNames.push(resouce.name);
            skeletonData.atlasText = resouce.atals;
            skeletonData.skeletonJson = resouce.json as any;

            spine.skeletonData = skeletonData;
            spine.setAnimation(0, startAni, false);
        }
        
    }
}

