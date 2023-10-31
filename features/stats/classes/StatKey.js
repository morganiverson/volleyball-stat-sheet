import { STAT_KEY_DELIMITER } from "../util/Constants.js";
import * as Util from "../util/Util.js";

export default class StatKey {
    constructor(athlete_number, athlete_name_abbv, skill, value) {
        // console.log(value)
        this.athlete_number = athlete_number;
        this.athlete_name_abbv = athlete_name_abbv;
        this.skill = skill;
        this.value = (typeof value == "string") ? value.toUpperCase() : value;
    }

    getKey() {
        return [this.athlete_number, this.athlete_name_abbv, this.skill, this.value].join(STAT_KEY_DELIMITER);
    }

    getValue() {
        return this.value;
    }

    getSkill() {
        return Util.getSkill(this.skill);
    }

    getDatabaseKey() {
        var statKeyArray = this.getKey().split(STAT_KEY_DELIMITER);
        if (statKeyArray.length != 4) {
            console.error("Invalid StatKey String: " + statKeyString);
            throw new Exception("Invalid StatKey String: " + statKeyString);
        }
        return [statKeyArray[0], statKeyArray[1]].join(STAT_KEY_DELIMITER);
    }

}
