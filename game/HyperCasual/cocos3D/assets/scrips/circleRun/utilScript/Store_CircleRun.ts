import { AudioClip } from "cc";
import {GameState} from "./Config_CircleRun";

class Store {
    gameState: GameState = GameState.ready;

    isPlaying: boolean = false;

    idCoinSpawnable: boolean = false;

    speed: number = 0;
    isFever: boolean = false;
    totalAngle: number = 0;
    feverCount: number = 0;
    goldCoinCount: number = 0;
    idCoinCount: number = 0;
    jewelCoinCount: number = 0;
    characterHitCount: number = 0;

    mute: boolean = false;
    lastScore: number = 0;
    selectedCharacter: number = 0;
    
    bgm: AudioClip = null;
    bgmPlayTime = 0;
    bgmPlayed: boolean = false;
    
    scoreImage: Blob[] = []; // 카카오공유 저장용

    /**
     * api
     */

    user_id: string = '';
    token: string = '';

    /**
     * ranking
     */

    isNewRecord: boolean = false;

    recentRanking: number = 0;
    ranking: number = 0;
    best_score: number = 0;
    participants: number = 0;
}

export default new Store();