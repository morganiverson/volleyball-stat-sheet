const STAT_KEY_DELIMITER = "-";
const SKILL = {
    PASS: "pass",
    SERVE: "serve",
    ATTACK: "attack",
    ERROR: "error"
}
const LOCAL_STG_DB_KEY = "db";

function averageList(list) {
    if (list.length == 0) return 0;
    var sum = list.reduce((a, b) => a + b);
    return (sum == 0) ? sum : sum / list.length;
}

function getOverallRating(list, killAceKey) {
    var numErrors = 0;
    var numAttempts = 0;
    var numScoring = 0;

    console.log(list)
    list.forEach(value => {
        switch (value) {
            case killAceKey: numScoring+=1; break;
            case "0": numErrors+=1; break;
            default: numAttempts+=1; break;
        }
    });

    console.log(numScoring, numErrors, numAttempts)

    console.log((numScoring - numErrors) / (numAttempts + numErrors + numScoring))
    return round((numScoring - numErrors) / (numAttempts + numErrors + numScoring), 3);
}

function round(num, numDigits) {
    return Number.parseFloat(num).toFixed(numDigits);
}


class Utils {
    constructor() {}

    parseKeyString(statKeyString) {
        var statKeyArray = statKeyString.split(STAT_KEY_DELIMITER);
        if (statKeyArray.length != 4) {
            console.error("Invalid StatKey String: " + statKeyString);
            throw new Exception("Invalid StatKey String: " + statKeyString);
        }
        return new StatKey(statKeyArray[0], statKeyArray[1], statKeyArray[2], statKeyArray[3]);
    }

    getSkill(skillString) {
        var index = Object.values(SKILL).indexOf(skillString);
        try {
            return Object.keys(SKILL)[index];
        } catch (error) {
            console.error("Invalid Skill Value: " + skillString);
            throw new Exception("Invalid Skill Value: " + skillString)
        }
    }

    createAthleteStats(obj) {
        return new AthleteStats(obj.name, obj.number, obj.id, obj.passRatingList, obj.serveRatingList, obj.attackRatingList, obj.errorCount);
    }
}

class StatKey {
    constructor(athlete_number, athlete_name_abbv, skill, value) {
        this.athlete_number = athlete_number;
        this.athlete_name_abbv = athlete_name_abbv;
        this.skill = skill;
        this.value = value.toUpperCase();
        this.util = new Utils();
    }

    getKey() {
        return [this.athlete_number, this.athlete_name_abbv, this.skill, this.value].join(STAT_KEY_DELIMITER);
    }

    getValue() {
        return this.value;
    }

    getSkill() {
        return this.util.getSkill(this.skill);
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

class AthleteStats {
    constructor(name, number, id, passRatingList, serveRatingList, attackRatingList, errorCount) {
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
            getOverallRating(serveRatingList, "A");
        }

        if (attackRatingList == undefined || attackRatingList.length == 0) {
            this.attackRatingList = [];
            this.attackAvg = 0;
        } else {
            this.attackRatingList = attackRatingList;
            this.attackAvg = getOverallRating(attackRatingList, "K");
        }

        this.errorCount = (errorCount == undefined) ? 0 : errorCount;
    }

    getId() {
        return this.id;
    }

    updateSkill(skill, value) {
        console.log(skill)
        switch (skill) {
            case "PASS": this.passRatingList.push(value); 
                this.passingAvg = round(averageList(this.passRatingList), 2); 
                break;
            case "ATTACK": this.attackRatingList.push(value); 
                this.attackAvg = getOverallRating(this.attackRatingList, "K");
                break;
            case "SERVE": this.serveRatingList.push(value); 
                this.serveAvg = getOverallRating(this.serveRatingList, "A");
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
                this.attackAvg = getOverallRating(this.attackRatingList, "K");
                break;
            case "SERVE": this.serveRatingList.pop(); 
                this.serveAvg = getOverallRating(this.attackRatingList, "A");
                break;
            case "ERROR": this.errorCount-=1;
        }
        return this;
    }
}

class MatchStatDatabase {
    constructor(athleteList, history) {
        this.athletes = athleteList;
        this.history = (history == undefined) ? []: history;
    }

    updateStatByAtheleteId(athleteId, skill, value) {
        this.athletes = this.athletes.map(athlete => UTILS.createAthleteStats(athlete));
        console.log(this.athletes)
        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.updateSkill(skill, value))[0];
    }

    undoStatByAtheleteId(athleteId, skill, value) {
        console.log(athleteId)
        this.athletes = this.athletes.map(athlete => UTILS.createAthleteStats(athlete));

        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.removeSkill(skill))[0];
    }
}

class LocalStorageUtil {
    constructor(db) {
        localStorage.setItem(LOCAL_STG_DB_KEY, JSON.stringify(db));
    }
    
    undoLastUpdate() {
        // Get Data From Local Storage
        var jsonObj = JSON.parse(localStorage.getItem(LOCAL_STG_DB_KEY));
        var matchStatDB = new MatchStatDatabase(jsonObj["athletes"], jsonObj["history"]);
        var statKeyString = matchStatDB.history.pop();
        
        console.log ("Undo ", statKeyString)

        // Parse Stat Key
        var statKey = UTILS.parseKeyString(statKeyString);
        var skill = statKey.getSkill();
        var dbKey = statKey.getDatabaseKey();
        // Update Athlete
        matchStatDB.undoStatByAtheleteId(dbKey, skill);
        // Update Local Storage
        localStorage.setItem(LOCAL_STG_DB_KEY, JSON.stringify(matchStatDB));
    }

    updateStatsByKey(statKeyString) {
        console.log ("Update ", statKeyString)
        // Parse Stat Key
        var statKey = UTILS.parseKeyString(statKeyString);
        var skill = statKey.getSkill();
        var value = statKey.getValue();
        var dbKey = statKey.getDatabaseKey();
        // FInd & Update Athlete Object
        var jsonObj = JSON.parse(localStorage.getItem(LOCAL_STG_DB_KEY));
        var matchStatDB = new MatchStatDatabase(jsonObj["athletes"], jsonObj["history"]);
        matchStatDB.updateStatByAtheleteId(dbKey, skill, value);
        console.log( matchStatDB)
        // Update Local Storage
        matchStatDB.history.push(statKeyString);
        localStorage.setItem(LOCAL_STG_DB_KEY, JSON.stringify(matchStatDB));
    }
}


const UTILS = new Utils();

athlete = new AthleteStats("Morgan I.", 1);

const LOCAL_STG_UTIL = new LocalStorageUtil(new MatchStatDatabase([athlete], []));

function updateStats(statkey) {
    LOCAL_STG_UTIL.updateStatsByKey(statkey);
}

function undoLastStatEntry() {
    LOCAL_STG_UTIL.undoLastUpdate();
}


