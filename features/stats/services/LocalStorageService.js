import { LOCAL_STG_DB_KEY } from "../util/Constants.js";
import MatchStatDatabase from "../classes/MatchStatDatabase.js";
import { createAthleteStats } from "../classes/AthleteStats.js";
import * as Util from "../util/Util.js";
import { updateStatTable } from "./StatDisplayService.js";

export default class LocalStorageService {
    constructor(db) {
        if (db == null || db == undefined) {
            var existingData = localStorage.getItem(LOCAL_STG_DB_KEY);
            if (existingData != null || existingData == undefined) {
                this.db = JSON.stringify(existingData);
            }
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
        var statKey = Util.parseKeyString(statKeyString);
        var skill = statKey.getSkill();
        var dbKey = statKey.getDatabaseKey();
        // Update Athlete
        matchStatDB.undoStatByAtheleteId(dbKey, skill);
        // Update Local Storage
        localStorage.setItem(LOCAL_STG_DB_KEY, JSON.stringify(matchStatDB));
        updateStatTable();
    }

    updateStatsByKey(statKeyString, includeInHistory) {
        // Parse Stat Key
        var statKey = Util.parseKeyString(statKeyString);
        var skill = statKey.getSkill();
        
        var value = statKey.getValue();
        var dbKey = statKey.getDatabaseKey();
        // FInd & Update Athlete Object
        var jsonObj = JSON.parse(localStorage.getItem(LOCAL_STG_DB_KEY));
        var matchStatDB = new MatchStatDatabase(jsonObj["athletes"], jsonObj["history"]);
        matchStatDB.updateStatByAtheleteId(dbKey, skill, value);
        // console.log( matchStatDB)
        // Update Local Storage
        // if (skill != "ACTIVE") {
        
            // console.log ("Update ", statKeyString);
            matchStatDB.history.push(statKeyString);
        // }
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
        matchStatDB.athletes = matchStatDB.athletes.map(athlete => createAthleteStats(athlete));
        return matchStatDB;
    }
}