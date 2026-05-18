/*
* Game
* */

export const ScreenSize = {
    width: 620,
    height: 960,
}
export const PatternHeight = 240;

export enum GameState {
    ready,
    start,
    end
}

export const GameEvent = {
    coinPooling: 'coinPooling',
    hurdlePooling: 'hurdlePooling',
    gameStart: 'gameStart',
    gameOver: 'gameOver',
    feverStart: 'feverStart',
    scoreUp: 'scoreUp',
    characterHit: 'characterHit',
};
/*
* Story
* */

/*
* Character
* */

export enum CharacterAnimations {
    tutorial,
    ready,
    run,
    jump,
    hit,
    gameOver
}

export enum CharacterState {
    ready,
    run,
    jump,
    hit,
    die,
}

export const CharacterJumpPower = 130;
export const CharacterJumpTime = 1;
export const CharacterHitTime = 0.5;

/*
* Coin
* */

export const CoinScore = 10;
export const CoinMaxDistance = 572;
export const CoinMinDistance = 422;
export const CoinDistanceMaxLevel = 5;
export const IdCoinRatio = 1 / 2;
export const IdCoinScore = 100;
export const IdCoinSpawnAngle = 1000;

/*
* Hurdle
* */

export enum HurdleAnimation {
    idle,
    hit,
}
export const HurdleHitTime = 2;
export const HurdleDistance = 594;

/*
* In Game
* */

export const ResultSceneLoadTime = 3;
// export const GoalScore = 100;
export const MinSpeed = 30;
export const MaxSpeed = 50;
export const FeverSpeed = 90;
export const AccPerSecond = 10;

export const ScoreUpAngle = 18;
export const ScorePerAngle = 1;

export const SpawnAngle = -60;

/*
* Fever
* */

export const FeverFirstScore = 80;
export const FeverNeedScore = 220;
export const FeverTime = 6;

/*
* Enemy
* */

export const EnemySpeed = 2;
export const EnemyHitSpeed = -30;
export const EnemyStartAngle = 27;
export const EnemyDistance = 554;
export const EnemyMinAngle = 0;
export const EnemyMaxAngle = 37;
export const EnemyCatchAngle = 7;

/*
* Background
* */

export const BackgroundSpeed = {
    ground: 1,
    brush: 0.7,
    mountain: 0.5,
    sky: 0.16,
}
export const DefaultSkySpeed = 1;
export const BackgroundFeverChangeTime = 0.5;
export const BackgroundSize = {
    width: 1280,
    height: 1280,
}

export const ShareUrl = 'https://www.samsungcard.com/personal/event/gmzn/UHPPBE3501M0.jsp';
// export const EVENT_LINK = 'https://www.samsungcard.com/personal/event/ing/UHPPBE1410P0.jsp?cms_id=271751';

export const KakaoShareTitle = '위너가 되고 싶나? 그럼 떠나!';
export const KakaoShareDescription = '떠날 수 있다면, 즐겨라! 즐기는 당신이 진정한 위너!';
export const KakaoShareButton = '위너 되러 가기';


/**
 * Api
 */

export const ApiBaseUrl = 'http://52.79.227.229:8380/api/v1/game';
// export const ApiBaseUrl = 'https://api.ssc-winners-game.com/api/v1/game';
export const GameId = '1';