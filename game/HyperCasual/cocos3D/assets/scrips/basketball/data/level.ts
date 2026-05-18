import Mathf from "../../Common/Mathf";

export default class Level {

    level: { turn: number, level_a: number, level_b: number, level_c: number, wlevel_0: number, wlevel_1: number, wlevel_2: number, wlevel_3: number }[] = [];
    lastLevel: { turn: number, level_a: number, level_b: number, level_c: number, wlevel_0: number, wlevel_1: number, wlevel_2: number, wlevel_3: number } = null;
    range: { minX: number, maxX: number, minY: number, maxY: number } = {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0
    };

    constructor(level, range) {
        for (let i = 0; i < level.length; i++) {
            const data = level[i];
            this.level[data['turn']] = {
                turn: parseInt(data['turn']),
                level_a: parseInt(data['level_a']),
                level_b: parseInt(data['level_b']),
                level_c: parseInt(data['level_c']),
                wlevel_0: parseInt(data['wlevel_0']),
                wlevel_1: parseInt(data['wlevel_1']),
                wlevel_2: parseInt(data['wlevel_2']),
                wlevel_3: parseInt(data['wlevel_3'])
            };

            if (i === level.length - 1) {
                this.lastLevel = this.level[data['turn']];
            }
        }

        for (let i = 0; i < range.length; i++) {
            const data = range[i];
            const l = data['level'];
            this.range[l] = {
                minX: parseInt(data['minX']),
                maxX: parseInt(data['maxX']),
                minY: parseInt(data['minY']),
                maxY: parseInt(data['maxY']),
            };
        }
    }

    getLevel(turn: number) {
        turn = turn || 1;
        if (turn > this.lastLevel.turn) {
            return this.lastLevel;
        }
        return this.level[turn];
    }

    getRange(level: string) {
        level = level || 'c';
        return this.range[level];
    }

    getRandomLevel(turn: number) {
        const data = this.getLevel(turn);
        const arr = [
            data['level_a'],
            data['level_b'],
            data['level_c']
        ];

        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        let random = Mathf.randomInt(0, sum);
        // for( let i = 0; i < arr.length; i++ ) {
        //     if( random < arr[i] ) {
        //         return this.getRange('');
        //     }
        // }

        if (random < arr[0]) {
            return this.getRange('a');
        }
        else if (random < arr[0] + arr[1]) {
            return this.getRange('b');
        }
        else {
            return this.getRange('c');
        }
    }

    getRandomWLevel(turn: number) {
        const data = this.getLevel(turn);
        const arr = [
            data['wlevel_0'],
            data['wlevel_1'],
            data['wlevel_2'],
            data['wlevel_3']
        ];

        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        let random = Mathf.randomInt(0, sum);
        if (random < arr[0]) {
            return 0;
        }
        else if (random < arr[0] + arr[1]) {
            return 1;
        }
        else if (random < arr[0] + arr[1] + arr[2]) {
            return 2;
        }
        else {
            return 3;
        }
    }
}