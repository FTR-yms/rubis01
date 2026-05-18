import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { SOUND_MUTE_KEY } from './Constants';
import userConfig from './UserConfig';
const { ccclass, property } = _decorator;

class SfxSoundInfo {
    constructor(source: AudioSource, volume: number) {
        this.source = source;
        this.volume = volume;
    }

    public source: AudioSource = null;
    public volume: number = 1;
}

@ccclass("SoundManager")
export class SoundManager extends Component {
    @property(AudioSource)
    private bgm: AudioSource = null;

    @property([AudioClip])
    private sfxClips: AudioClip[] = [];

    private bgmVolume: number = 1;

    private sfxSoundInfo: Map<number, SfxSoundInfo> = new Map();

    private static _instance: SoundManager;

    public static get instance(): SoundManager {
        // if (!SoundManager._instance) {
        //   const node = new Node("SoundManager");
        //   SoundManager._instance = node.addComponent(SoundManager);
        // }

        return SoundManager._instance;
    }

    protected onLoad() {
        SoundManager._instance = this;

        userConfig.isSoundOn = (localStorage.getItem(SOUND_MUTE_KEY) || '0') === '0';

        if (this.bgm) {
            this.bgmVolume = this.bgm.volume;
        }

        for (let i = 0; i < this.sfxClips.length; ++i) {
            const node = new Node(this.sfxClips[i].name);
            node.setParent(this.node);
            const source = node.addComponent(AudioSource);
            source.clip = this.sfxClips[i];
            source.playOnAwake = false;
            source.loop = false;

            this.sfxSoundInfo.set(i, new SfxSoundInfo(source, 1));
        }

        this.soundToggle();
    }

    protected start(): void {
        this.playBgm();
    }

    public playBgm() {
        this.bgm?.play();
    }

    public stopBgm() {
        this.bgm?.stop();
    }

    public pauseBgm() {
        this.bgm?.pause();
    }

    public resumeBgm() {
        this.bgm?.play();
    }

    public playSfxOneShot(index: number) {
        const source = this.sfxSoundInfo.get(index)?.source;
        if (source) {
            source.playOneShot(this.sfxClips[index]);
        }
    }

    public playSfx(index: number, loop: boolean = false) {
        const source = this.sfxSoundInfo.get(index)?.source;
        if (source) {
            source.loop = loop;
            source.play();
        }
    }

    public setVolume(index: number, volume: number) {
        if (!userConfig.isSoundOn) {
            return;
        }

        const info = this.sfxSoundInfo.get(index);
        if (info) {
            info.source.volume = volume;
            info.volume = volume;
        }
    }

    public stopSfx(index: number) {
        const source = this.sfxSoundInfo.get(index)?.source;
        if (source) {
            source.loop = false;
            source.stop();
        }
    }

    public stopAllSfx() {
        this.sfxSoundInfo.forEach((v, k) => {
            v.source.loop = false;
            v.source.stop();
        })
    }

    // public playSfx(index: number) {
    //   this.sfx.playOneShot(this.sfxClips[index]);
    // }

    public soundToggle() {
        if (userConfig.isSoundOn) {
            if (this.bgm) {
                this.bgm.volume = this.bgmVolume;
            }
            this.sfxSoundInfo.forEach((info) => {
                info.source.volume = info.volume;
            });
        } else {
            if (this.bgm) {
                this.bgm.volume = 0;
            }
            this.sfxSoundInfo.forEach((info) => {
                info.source.volume = 0;
            });
        }
    }
}



