import { Texture2D } from "cc";

export const screenSize: { width: number; height: number } = {
  width: 540,
  height: 960,
};

export enum DevOption {
  Test,
  Local,
  Dev,
  Service,
}

export enum ResourceType {
  Logo,
  Block1 = 11,
  Block2,
  Block3,
  Block4,
  Block5,
  Block6,
  Block7,
  Block8,
  Block9,
  Block10,
  Effect1 = 21,
  Effect2,
}

export interface ResourceData {
  id : number,
  name : string,
  type: ResourceType;
  texture: Texture2D;
  atals: string;
  json: object;
}

export enum SoundState {
  Play,
  Pause,
}

export enum SFXSound {
  UI_Click = 0,
  UI_OpenPopup,
  UI_Toggle,
  Quiz_Correct,
  Quiz_Wrong,
  Quiz_Timer,
  Quiz_OpenItem,
  Quiz_GetItem,
  MoveGem,
  MoveErr,
  PopGem1,
  PopGem2,
  PopGem3,
  PopGem4,
  PopGem5,
  ShuffleGem,
  FallGem,
  MadeItemGem,
  FourBlockItem,
  FiveBlockItem,
  GameOver,
  HighScore,
}

export enum Bgm {
  Main = 0,
  InGame,
}

// Event
export const GameEvent = {
  poolingAllObject: "poolingAllObject",
  poolingBlock: "poolingBlock",

  setScriptLabel: "setScriptLabel",

  breakAllBlock: "breakAllBlock",

  addScore: "addScore",
  addPlayTime: "addPlayTime",
  addCombo: "addCombo",
  addQuizCount: "addQuizCount",

  onBonusScore: "onBonusScore",
  offBonusScore: "offBonusScore",

  createItemEffect: "createItemEffect",
  poolingItemEffect: "poolingItemEffect",

  showItemTextEffect: "showItemTextEffect",
  showQuizTextEffect: "showQuizTextEffect",

  playCharacterAni: "playCharacterAni",
  resetCharacterIdle: "resetCharacterIdle",

  pauseTimer: "pauseTime",
  resumeTimer: "resumeTimer",
  setQuizPoint: "setQuizPoint",

  pauseCombo: "pauseCombo",
  resumeCombo: "resumeCombo",

  openQuizBoard: "openQuizBoard",
  closeQuizBoard: "closeQuizBoard",
  openEndQuizBoard: "openEndQuizBoard",

  gameStart: "gameStart",
  gameOver: "gameOver",
} as const;
export type GameEvent = typeof GameEvent[keyof typeof GameEvent];

export const ActionType = {
  match: "match",
  fall: "fall",
  effect: "effect",
  select: "select",
  deselect: "deselect",
} as const;
export type ActionType = typeof ActionType[keyof typeof ActionType];

//Game
export enum GameState {
  Ready,
  Play,
  AD,
  Pause,
  AddTime,
  Quiz,
  End,
}

export const PlayTime: number = 60;
export const NormalComeSpeed: number = 5;
export const TimerBonusTime: number = 10;
export const ScoreBonusTime: number = 10;

export const ScoreBonusRate: number = 0.1;

export enum ItemType {
  Timer = 0,
  Score,
  ItemBlock,
}

export const ItemBlockCount = 3;
export const LinkBlockAniTime = 0.33;

// Effect
export const MaxCombo: number = 10;
export const ComboEffectTime: number = 0.3;
export const ComboMaxTime: number = 2;

export const ScoreEffectTime: number = 0.2;
export const ScorePlayTime: number = 0.7;


// Spine
export const ItemAniName = {
  WatchH: "eff_thunder_h",
  WatchV: "eff_thunder_v",
  Flip: "eff_wave_v7",
  Fold: "eff_wave_h7",
};

export const LogoAniName = {
  In: "t_01_title_in",
  Idle: "i_01_title_idle",
  Loop: "t_02_title_loop",
};

export const BLightAniName = {
  In: "t_01_blight_in",
  Idle: "i_01_blight_idle",
  Loop: "t_01_blight_loop",
};

export const CharacterAniName = {
  TitleIn: "t_01_char_in",
  TitleLoop: "t_02_char_loop",
  Idle: "i_01_char_idle",
  Good: "i_02_char_good",
  Bad: "i_03_char_bad",
  QuizIn: "i_04_char_qt_in",
  QuizLoop: "i_05_char_qt_loop",
  QuizO: "i_06_char_qt_o",
  QuizX: "i_06_char_qt_x",
};

// Quiz
//export enum quizDataOrder { No = 0, Category, Question, A1, A2, A3, A4, Correct };
export const QuizMaxCount: number = 20;

export const QuizPlayTime: number = 30;
export const QuizTime: number[] = [30, 1];
export const QuizPlusTime: number = 10;

export const EndQuizBonusRate: number = 0.01;
// export interface IQuizData {
//   No: string;
//   Category: string;
//   Question: string;
//   A1: string;
//   A2: string;
//   A3: string;
//   A4: string;
//   Correct: string;

//   isOXQUiz?: boolean;
// }

export interface IBingoItem {
  bingo_item_id: number;
  quiz: IQuizData;
}

export interface IQuizData {
  quiz_id: number;
  answer_count: number;
  lang: { content: string };
  answers: { content: string; num: number }[];
}

// board
export const BoardCellSize: { x: number; y: number } = {
  x: 7,
  y: 7,
};
export const CellStartPos: { x: number; y: number } = {
  x: -195,
  y: -195,
};

export const blockDisatnce: number = 65;

export const BoardMargin: { left: number; bottom: number } = {
  left: CellStartPos.x + screenSize.width / 2 - blockDisatnce / 2,
  bottom: CellStartPos.y + screenSize.height / 2 - blockDisatnce / 2,
  // 첫 번째 블록 위치 - 블록 거리 / 2
};

export enum BoardState {
  Normal,
  Start,
  Swap,
  SwapFail,
  Match,
  Fall,
  Effect,
  Shake,
}

// block
export enum BlockWay {
  Up,
  Down,
  Left,
  Right,
}

export enum BlockState {
  Fall,
  Landing,
  Idle,
  Link,
  Match,
  Select,
}

export const BlockAni = {
  In: "00_in",
  Idle: "01_idle",
  Landing: "02_lending",
  Match: "03_match_0",
  ItemMatch: "03_match_1",
  Link: "04_link",
};

export enum BlockShape {
  ThreeMOneV = "3x1 Vertical",
  ThreeMOneH = "3x1 Horizontal",
  FourMOneV = "4x1 Vertical",
  FourMOneH = "4x1 Horizontal",
  FiveMOneV = "5x1 Vertical",
  FiveMOneH = "5x1 Horizontal",
  ThreeMThreeL = "3x3 L",
  ThreeMThreeT = "3x3 T",
  FourMThree = "4x3",
  FiveMThree = "5x3",
}

export const BlockScore = 20;

export const BlockPoint = {
  three: 60,
  four: 80,
  five: 100,
  line: 180,
};

export const BonusRate = {
  three: 0,
  four: 1.2,
  five: 1.5,
  line: 4.5,
};

export const enum BlockItemType {
  Watch = 6,
  Buds,
  Flip,
  Fold,
}

export const ColorLength = 10;
export const NormalColorLength = 6;

export const HintBlockTime = 5;
