import { _decorator, Component, Node, Toggle } from 'cc';
import { SoundManager } from './SoundManager';
import userConfig from './UserConfig';
import { SOUND_MUTE_KEY } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('SoundToggle')
export class SoundToggle extends Component {
    @property(Toggle)
    private muteToggle: Toggle = null;

    protected onLoad(): void {
        if (this.muteToggle) {
            this.muteToggle.setIsCheckedWithoutNotify(!userConfig.isSoundOn);
        }
    }

    muteChanged(toggle: Toggle) {
        userConfig.isSoundOn = !toggle.isChecked;
        localStorage.setItem(SOUND_MUTE_KEY, toggle.isChecked ? '1' : '0');
        SoundManager.instance.soundToggle();
    }
}


