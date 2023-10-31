import { createAthleteStats } from "./AthleteStats.js";

export default class MatchStatDatabase {
    constructor(athleteList, history) {
        this.athletes = athleteList;
        this.history = (history == undefined) ? []: history;
    }

    updateStatByAtheleteId(athleteId, skill, value) {
        this.athletes = this.athletes.map(athlete => createAthleteStats(athlete));
        // console.log(this.athletes)
        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.updateSkill(skill, value))[0];
    }

    undoStatByAtheleteId(athleteId, skill, value) {
        // console.log(athleteId)
        this.athletes = this.athletes.map(athlete => createAthleteStats(athlete));

        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.removeSkill(skill))[0];
    }
}