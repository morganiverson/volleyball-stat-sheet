import { round } from "../util/Util.js";

class AthleteStats {
    constructor(name, number, id, passRatingList, serveRatingList, attackRatingList, errorCount, active) {
        this.name = name;
        this.number = number;
        if (id == undefined) {
            this.id = [number, name.toLowerCase().substring(0, 3)].join(STAT_KEY_DELIMITER);
        } else {
            this.id = id;
        }

        if (passRatingList == undefined || passRatingList.length == 0) {
            this.passRatingList = [];
            this.passingAvg = 0;
        } else {
            this.passRatingList = passRatingList;
            this.passingAvg = round(averageList(this.passRatingList), 2);
        }
        
        if (serveRatingList == undefined || serveRatingList.length == 0) {
            this.serveRatingList = [];
            this.serveAvg = 0;
        } else {
            this.serveRatingList = serveRatingList;
            this.serveAvg = getOverallSkillRating(serveRatingList, "A");
        }

        if (attackRatingList == undefined || attackRatingList.length == 0) {
            this.attackRatingList = [];
            this.attackAvg = 0;
        } else {
            this.attackRatingList = attackRatingList;
            this.attackAvg = getOverallSkillRating(attackRatingList, "K");
        }

        this.errorCount = (errorCount == undefined) ? 0 : errorCount;
        // console.log("set active:", active)
        this.active = active;
    }

    getId() {
        return this.id;
    }

    getNumber() {
        return this.number;
    }

    getName() {
        return this.name;
    }

    isActive() {
        return this.active;
    }

    updateSkill(skill, value) {
        switch (skill) {
            case "ACTIVE": this.active = value; break;
            case "PASS": this.passRatingList.push(value); 
                this.passingAvg = round(averageList(this.passRatingList), 2); 
                break;
            case "ATTACK": this.attackRatingList.push(value); 
                this.attackAvg = getOverallSkillRating(this.attackRatingList, "K");
                break;
            case "SERVE": this.serveRatingList.push(value); 
                this.serveAvg = getOverallSkillRating(this.serveRatingList, "A");
                break;
            case "ERROR": this.errorCount+=1;
        }
        return this;
    }

    removeSkill(skill) {
        switch (skill) {
            case "PASS": this.passRatingList.pop(); 
                this.passingAvg = round(averageList(this.passRatingList)); 
                break;
            case "ATTACK": this.attackRatingList.pop(); 
                this.attackAvg = getOverallSkillRating(this.attackRatingList, "K");
                break;
            case "SERVE": this.serveRatingList.pop(); 
                this.serveAvg = getOverallSkillRating(this.attackRatingList, "A");
                break;
            case "ERROR": this.errorCount-=1;
        }
        return this;
    }

    getNumberOfSkillRatings(skill, value) {
        var count = 0;
        switch (skill) {
            case "PASS": count = this.passRatingList.filter(rating => rating == value).length; 
                break;
            case "ATTACK": count = this.attackRatingList.filter(rating => rating == value).length; break;
            case "SERVE": count = this.serveRatingList.filter(rating => rating == value).length; break;
            case "ERROR": return this.errorCount;
        }
        return count;
    }
}
function createAthleteStats(obj) {
    // console.log(obj.active)
    return new AthleteStats(obj.name, obj.number, obj.id, obj.passRatingList, obj.serveRatingList, obj.attackRatingList, obj.errorCount, obj.active);
}

function averageList(list) {
    if (list.length == 0) return 0;
    var sum = list.reduce((a, b) => parseInt(a) + parseInt(b));
    return (sum == 0) ? sum : sum / list.length;
}

function getOverallSkillRating(list, killAceKey) {
    var numErrors = 0;
    var numAttempts = 0;
    var numScoring = 0;

    list.forEach(value => {
        switch (value) {
            case killAceKey: numScoring+=1; break;
            case "0": numErrors+=1; break;
            default: numAttempts+=1; break;
        }
    });
    return Util.round((numScoring - numErrors) / (numAttempts + numErrors + numScoring), 3);
}

export default AthleteStats;
export { createAthleteStats };