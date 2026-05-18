import Util from "../../Common/Util";

class Pattern {
    hurdleAngles: number[] = [];
    coinAngles: number[] = [];
    coinDistanceLevels: number[] = [];
    totalAngle: number = 0;

    constructor(csv: string) {
        let data = Util.csvParse(csv);

        this.totalAngle = parseInt(data[0].pattern_total_angle);

        for (let i = 0; i < data[0].hurdle_count; i++) {
            this.hurdleAngles.push(parseInt(data[i].hurdle_angles));
        }

        for (let i = 0; i < data[0].coin_count; i++) {
            this.coinAngles.push(parseInt(data[i].coin_angles));
        }

        for (let i = 0; i < data[0].coin_count; i++) {
            this.coinDistanceLevels.push(parseInt(data[i].coin_distance_level) - 1);
        }
    }
}

export default Pattern;