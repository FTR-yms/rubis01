import { Mission } from "./ingame/Mission";

export enum GAME_STATE {
    none,
    ready,
    start,
    end,
}

export const DEFAULT_SHOT_COUNT = 20;

export const BOARD_SIZE = {
    width: 6,
    height: 6,
};
export const MONSTER_COLOR = [ 'BU', 'GR', 'PK', 'RE', 'WH', 'YE' ];
export const JELLY_COLOR = [ 'blue', 'cyan', 'green', 'purple', 'red', 'yellow' ];

export const MONSTER_DISTANCE = 72;


export const wayToPosition = [ // 시계방향
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },

    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
]

export enum BOARD_STATE {
    none,
    select,
    process
}

export const MIN_NEED = 5;
export const MAX_NEED = 15;
export const BONUS_SHOT = 3;

export const MaxActionTime = 15;
export const ActionWarningTime = 5;

// export let gameState : GAME_STATE = GAME_STATE.none;

let gameState : GAME_STATE = GAME_STATE.none;

function setGameState(_gameState : GAME_STATE)
{
    gameState = _gameState;
}

export { gameState, setGameState };