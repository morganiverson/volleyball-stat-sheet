import AthleteStats, { createAthleteStats } from "./AthleteStats.js";
import * as Util from "../util/Util.js"
export default class MatchStatDatabase {
    constructor(athleteList, history) {
        this.athletes = athleteList;
        this.history = (history == undefined) ? []: history;
        this.statTotals = getTotalsWithAthleteList(this.athletes);
    }

    updateStatByAtheleteId(athleteId, skill, value) {
        this.athletes = this.athletes.map(athlete => createAthleteStats(athlete));
        // console.log(this.athletes)
        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.updateSkill(skill, value))[0];

        this.statTotals = getTotalsWithAthleteList(this.athletes);
    }

    undoStatByAtheleteId(athleteId, skill) {
        // console.log(athleteId)
        this.athletes = this.athletes.map(athlete => createAthleteStats(athlete));

        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.removeSkill(skill))[0];
        this.statTotals = getTotalsWithAthleteList(this.athletes);
    }
}

class StatTotals {
    constructor(pass0, pass1, pass2, pass3, passAvg, attack0, attack1, attackK, attackAvg, serve0, serve1, serveA, serveAvg, errors) {
        this.pass0 = (pass0 == null) ? 0: pass0;
        this.pass1= pass1 == null ? 0 : pass1;
        this.pass2= pass2 == null ? 0 : pass2;
        this.pass3= pass3 == null ? 0 : pass3;
        this.attack0=attack0 == null ? 0 : attack0;
        this.attack1=attack1 == null ? 0 : attack1;
        this.attackK=attackK == null ? 0 : attackK;
        this.serve0=serve0 == null ? 0 : serve0;
        this.serve1=serve1 == null ? 0 : serve1;
        this.serveA=serveA == null ? 0 : serveA;
        this.errors=errors == null ? 0 : errors;

        this.attackAvg=attackAvg == null ? 0 : attackAvg;
        this.passAvg = passAvg == null ? 0 : passAvg;
        // this.totalPasses = 0;
        // this.sumPasses = 0;
        this.serveAvg = serveAvg == null ? 0 : serveAvg;
    }
}

function getTotalsWithAthleteList(athleteList) {
        var pass0 = 0;
        var pass1=0;
        var pass2=0;
        var pass3=0;
        var attack0=0;
        var attack1=0;
        var attackK=0;
        var serve0=0;
        var serve1=0;
        var serveA=0;
        var errors=0;

        var attackAvg=0;
        var passAvg = 0;
        var totalPasses = 0;
        var sumPasses = 0;
        var serveAvg = 0;

        athleteList.forEach(athlete => {
            athlete = (typeof athlete == AthleteStats) ? athlete : createAthleteStats(athlete)
            pass0+= athlete.getNumberOfSkillRatings("PASS", 0);
            // console.log("0=>", pass0)
            pass1+= athlete.getNumberOfSkillRatings("PASS", 1);
            pass2+= athlete.getNumberOfSkillRatings("PASS", 2);
            pass3+= athlete.getNumberOfSkillRatings("PASS", 3);
            sumPasses+= parseInt(athlete.getNumberOfSkillRatings("PASS", 1)) 
            + (2 * parseInt(athlete.getNumberOfSkillRatings("PASS", 2))) + 
            (3 * parseInt(athlete.getNumberOfSkillRatings("PASS", 3)));

            totalPasses+= (athlete.getNumberOfSkillRatings("PASS", 0) + athlete.getNumberOfSkillRatings("PASS", 1) + athlete.getNumberOfSkillRatings("PASS", 2) + athlete.getNumberOfSkillRatings("PASS", 3))
            
            attack0+= athlete.getNumberOfSkillRatings("ATTACK", 0);
            attack1+= athlete.getNumberOfSkillRatings("ATTACK", 1);
            attackK+= athlete.getNumberOfSkillRatings("ATTACK", "K");
            
            serve0+= athlete.getNumberOfSkillRatings("SERVE", 0);
            serve1+= athlete.getNumberOfSkillRatings("SERVE", 1);
            serveA+= athlete.getNumberOfSkillRatings("SERVE", "A");
            errors+= athlete.getNumberOfSkillRatings("ERROR", -1);
        });

        attackAvg= Util.round(((attackK + attack0 + attack1) == 0) ? 0 : (attackK - attack0) / (attackK + attack0 + attack1), 3);
        passAvg= Util.round((totalPasses == 0) ? 0 : sumPasses / totalPasses, 2);
        serveAvg= Util.round(((serveA + serve0 + serve1) == 0) ? 0 : (serveA - serve0) / (serveA + serve0 + serve1), 3);

        return new StatTotals(pass0, pass1, pass2, pass3, passAvg, attack0, attack1, attackK, attackAvg, serve0, serve1, serveA, serveAvg, errors)
}
