import { GameState, ResourceData } from "./Config";

class Store {
  gameState: GameState = GameState.Ready;
  combo: number = 0;
  score: number = 0;
  langauge: string = "English";
  languageList: { key: string; content: string }[] = [];
  resources : ResourceData[] = [];
}

export default new Store();
