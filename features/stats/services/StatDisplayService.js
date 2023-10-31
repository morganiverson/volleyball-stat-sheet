import LocalStorageService, { LOCAL_STORAGE_SERVICE } from "./LocalStorageService.js";
import { STAT_KEY_DELIMITER, SKILL } from "../util/Constants.js";
import StatKey from "../classes/StatKey.js";

function updateStatTable() {
    var statSheet = document.getElementById("stat-sheet");
    statSheet.innerHTML = statTableBody();
}

function statTableBody() {
    var db = LOCAL_STORAGE_SERVICE.getMatchStatDatabase();
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
    var db = LOCAL_STORAGE_SERVICE.getMatchStatDatabase();
    var tableString = "";
    console.log("input body")

    db.athletes.map(ath => {
        var rowKey = [ath.getId(), "row"].join(STAT_KEY_DELIMITER);

        // console.log(ath.getNumber(), ath.isActive())
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

export { updateStatTable, updateInputTable }