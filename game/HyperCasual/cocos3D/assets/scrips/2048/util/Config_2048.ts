/*
* Game
* */

export enum GameState{
    loading = 0,
    ready,
    start,
    gameOver
}

export const GameOverSignalDelay = 1.5;
export const GameOverBoardDelay = 0.2;

/*
* Block
* */

export const BlockDefaultValue = 2;

export const BlockAnimation = {
    in: 'block_in',
    idle: 'block_idle',
    merged: 'block_merge',
    move: 'block_move',
}

/*
* Board
* */

export const BlockInterval = {
    x: 119.5,
    y: 119,
};

export const BlockDefaultPosition = {
    x: 0,
    y: 0,
}

export const BoardSize = {
    width: 4,
    height: 4,
    count: 16,
}