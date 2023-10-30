const STAT_KEY_DELIMITER = "-";
const SKILL = {
    PASS: "pass",
    SERVE: "serve",
    ATTACK: "attack",
    ERROR: "error",
    ACTIVE: "active"
}
const LOCAL_STG_DB_KEY = "db";

function averageList(list) {
    if (list.length == 0) return 0;
    var sum = list.reduce((a, b) => parseInt(a) + parseInt(b));
    return (sum == 0) ? sum : sum / list.length;
}

function getOverallRating(list, killAceKey) {
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

    // console.log(numAttempts, numErrors, numScoring)
    // console.log((numScoring - numErrors) / (numAttempts + numErrors + numScoring))
    // console.log(round((numScoring - numErrors) / (numAttempts + numErrors + numScoring), 3));

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
        return new AthleteStats(obj.name, obj.number, obj.id, obj.passRatingList, obj.serveRatingList, obj.attackRatingList, obj.errorCount, obj.active);
    }
}

class StatKey {
    constructor(athlete_number, athlete_name_abbv, skill, value) {
        // console.log(value)
        this.athlete_number = athlete_number;
        this.athlete_name_abbv = athlete_name_abbv;
        this.skill = skill;
        this.value = (typeof value == "string") ? value.toUpperCase() : value;
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
            this.serveAvg = getOverallRating(serveRatingList, "A");
        }

        if (attackRatingList == undefined || attackRatingList.length == 0) {
            this.attackRatingList = [];
            this.attackAvg = 0;
        } else {
            this.attackRatingList = attackRatingList;
            this.attackAvg = getOverallRating(attackRatingList, "K");
        }

        this.errorCount = (errorCount == undefined) ? 0 : errorCount;
        this.active = (active == undefined) ? false : active;
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

class MatchStatDatabase {
    constructor(athleteList, history) {
        this.athletes = athleteList;
        this.history = (history == undefined) ? []: history;
    }

    updateStatByAtheleteId(athleteId, skill, value) {
        this.athletes = this.athletes.map(athlete => UTILS.createAthleteStats(athlete));
        // console.log(this.athletes)
        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.updateSkill(skill, value))[0];
    }

    undoStatByAtheleteId(athleteId, skill, value) {
        // console.log(athleteId)
        this.athletes = this.athletes.map(athlete => UTILS.createAthleteStats(athlete));

        this.athletes.filter(athlete => athlete.getId() == athleteId)
        .map(currentAthlete => currentAthlete.removeSkill(skill))[0];
    }
}

class LocalStorageUtil {
    constructor(db) {
        if (db == null | db == undefined) {
            return;
        }
        localStorage.setItem(LOCAL_STG_DB_KEY, JSON.stringify(db));
    }
    
    undoLastUpdate() {
        // Get Data From Local Storage
        var jsonObj = JSON.parse(localStorage.getItem(LOCAL_STG_DB_KEY));
        var matchStatDB = new MatchStatDatabase(jsonObj["athletes"], jsonObj["history"]);
        if (matchStatDB.history.length == 0) {
            console.error("Stat Hiostroy is Empty!");
            return;
        }
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
        updateStatTable();
    }

    updateStatsByKey(statKeyString) {
        // Parse Stat Key
        var statKey = UTILS.parseKeyString(statKeyString);
        var skill = statKey.getSkill();
        
        var value = statKey.getValue();
        var dbKey = statKey.getDatabaseKey();
        // FInd & Update Athlete Object
        var jsonObj = JSON.parse(localStorage.getItem(LOCAL_STG_DB_KEY));
        var matchStatDB = new MatchStatDatabase(jsonObj["athletes"], jsonObj["history"]);
        matchStatDB.updateStatByAtheleteId(dbKey, skill, value);
        // console.log( matchStatDB)
        // Update Local Storage
        if (skill != "ACTIVE") {
            console.log ("Update ", statKeyString);
            matchStatDB.history.push(statKeyString);
        }
        localStorage.setItem(LOCAL_STG_DB_KEY, JSON.stringify(matchStatDB));
        updateStatTable();
    }

    getMatchStatDatabase() {
        var jsonString = localStorage.getItem(LOCAL_STG_DB_KEY);
        // console.log(jsonString)
        if (jsonString == null || jsonString == undefined) {
            return null;
        }
        var jsonObj = JSON.parse(jsonString);
    
        var matchStatDB = new MatchStatDatabase(jsonObj["athletes"], jsonObj["history"]);
        matchStatDB.athletes = matchStatDB.athletes.map(athlete => UTILS.createAthleteStats(athlete));
        return matchStatDB;
    }
}

function updateStats(statKey) {
    LOCAL_STG_UTIL.updateStatsByKey(statKey);
}

function undoLastStatEntry() {
    LOCAL_STG_UTIL.undoLastUpdate();
}

function updateStatTable() {
    var statSheet = document.getElementById("stat-sheet");
    statSheet.innerHTML = statTableBody();
}

function statTableBody() {
    var db = LOCAL_STG_UTIL.getMatchStatDatabase();
    var tableString = "";

    db.athletes.map(ath => {
        // console.log(ath)
       tableString+= ("<tr><td>" + 
       ath.getNumber() + "</td><td>" + 
       ath.getName() + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 0) + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 1) + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 2) + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 3) + "</td><td>" + 
        ath.passingAvg + "</td><td>" + 

        ath.getNumberOfSkillRatings("ATTACK", 0) + "</td><td>" + 
        ath.getNumberOfSkillRatings("ATTACK", 1) + "</td><td>" + 
        ath.getNumberOfSkillRatings("ATTACK", "K") + "</td><td>" + 
        ath.attackAvg + "</td><td>" + 

        ath.getNumberOfSkillRatings("SERVE", 0) + "</td><td>" + 
        ath.getNumberOfSkillRatings("SERVE", 1) + "</td><td>" + 
        ath.getNumberOfSkillRatings("SERVE", "A") + "</td><td>" + 
        ath.serveAvg + "</td><td>" + 

        ath.getNumberOfSkillRatings("ERROR", -1) +  "</td></tr>");
    });
    return tableString;
}


function updateInputTable() {
    var inputTable = document.getElementById("input-table");
    inputTable.innerHTML = inputTableBody();
}

function inputTableBody() {
    var db = LOCAL_STG_UTIL.getMatchStatDatabase();
    var tableString = "";
    // console.log("input body")

    db.athletes.map(ath => {
        var rowKey = [ath.getId(), "row"].join(STAT_KEY_DELIMITER);

        // console.log(ath)
       tableString+= ("<tr id='" + rowKey + "'><td>" + 
       ath.getNumber() + "</td><td>" + 
       ath.getName() + "</td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 0).getKey() + "')>0</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 1).getKey() + "')>1</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 2).getKey() + "')>2</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 3).getKey() + "')>3</button></td><td>" + 

       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ATTACK, 0).getKey() + "')>0</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ATTACK, 1).getKey() + "')>1</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ATTACK, "K").getKey() + "')>K</button></td><td>" + 

       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.SERVE, 0).getKey() + "')>0</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.SERVE, 1).getKey() + "')>1</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.SERVE, "A").getKey() + "')>A</button></td><td>" + 

       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ERROR, 0).getKey() + "')>E</button></td><td>" +
       "<input type='checkbox' rowId='" + rowKey + "' active =" + ath.isActive() + " statkeyprefix='" + [ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(),SKILL.ACTIVE].join(STAT_KEY_DELIMITER) +"'></td>");
    });
    return tableString;
}

async function loadRoster(jsonFilePath) {
    return fetch(jsonFilePath).then(res=> res.json());
}

const UTILS = new Utils();
var athleteList = [];
var LOCAL_STG_UTIL = new LocalStorageUtil();




window.addEventListener("load", () => {

    console.log("reload")
    var existingData = LOCAL_STG_UTIL.getMatchStatDatabase();

    if (existingData == null) {
        loadRoster("./roster/lghs_2023_varsity.json")
            .then(json => json.map(athleteJson => new AthleteStats(athleteJson.name, athleteJson.number)))
            .then(athleteJsonList => {
                // console.log(athleteJsonList)
                LOCAL_STG_UTIL = new LocalStorageUtil(new MatchStatDatabase(athleteJsonList, []));
                return Promise.resolve();
            })
            .then(() => {
                updateStatTable();
                updateInputTable();
            })
            .then(() => {
                var checkboxes = document.querySelectorAll("input[type='checkbox']");
                // console.log(checkboxes)
                checkboxes.forEach(box => {
                    var rowId = box.getAttribute("rowId");
                    highlightRowIfActive(rowId)
                    box.addEventListener("change", (e) => highlightRowIfActive(rowId));
                })
            });
    } else {
        populateTables().then(() => {
            var checkboxes = document.querySelectorAll("input[type='checkbox']");
            // console.log(checkboxes)
            checkboxes.forEach(box => {
                var rowId = box.getAttribute("rowId");
                highlightRowIfActive(rowId)
                box.addEventListener("change", (e) => {
                    highlightRowIfActive(rowId);
                });
            }) 
        })
    }
    
});




    function populateTables() {
        updateStatTable();
        updateInputTable();
        return Promise.resolve();
    }

    function highlightRowIfActive(rowId) {
        var row = document.getElementById(rowId);
        // console.log(rowId);
        var box = row.querySelector("input[type='checkbox']");
        // console.log(box)
        var table = row.parentNode
        var childIndex = Array.from(table.children).indexOf(row) + 1;
        if (box.getAttribute("active") != null) {
            box.checked = (box.getAttribute("active") == "TRUE");
            box.removeAttribute("active");
        }

        LOCAL_STG_UTIL.updateStatsByKey([box.getAttribute("statkeyprefix"),box.checked].join(STAT_KEY_DELIMITER))
        if (box.checked) {
            row.style.backgroundColor = "orange";
        } else {
            row.style.backgroundColor = (childIndex % 2 == 0) ? "lightgrey": "inherit";
        }
    }

    // function checkboxIfHighlightedAfter