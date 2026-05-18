import Level from "./level";
import Config from "./config";

class Store {
    config : Config = new Config();

    level : Level = null;

    score : number = 0;
    wind : number = 0;

    minX : number = 0;
    minY : number = 0;
    maxX : number = 0;
    maxY : number = 0;

    isFireBall : boolean = false;
    isPerfect : boolean = true;
    currentFireBallCount : number = 0;

    isGameOver = true;
    isGameStart = false;
    isActiveBall = false;
    isTimeOver = false;

    clear() {
        this.score = 0;
        this.wind = 2;
        this.isFireBall = false;
        this.isPerfect = true;
        this.isGameOver = false;
        this.isTimeOver = false;
        this.isGameStart = false;
        this.currentFireBallCount = 0;
    }
}

const store = new Store();
export default store;