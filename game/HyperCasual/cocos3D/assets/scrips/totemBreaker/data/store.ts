import Config from "./config";
import { GameState } from "./const";

class Store {
    config : Config = new Config();
    tileData = null;
    generateTotemInfo = null;
    gradeToIndex = null;

    state : GameState = GameState.none;
    score : number = 0;
    gauge : number = 0;
    freezeTime : number = 0;
    grade : number = 0;
    
    isPlay : boolean = false;
    isGameover : boolean = false;

    clear() {
        GameState.none;
        this.grade = 0;
        this.score = 0;
        this.gauge = this.config.maxCurseGauge;
        this.freezeTime = 0;
    }
}

const store = new Store();
export default store;