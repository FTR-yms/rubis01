import { GameState } from "./Config";
import { PoolKey } from "./Pool";

class Store {
    gameState: GameState = GameState.READY;
    charactor : PoolKey = PoolKey.player;
}

export default new Store()