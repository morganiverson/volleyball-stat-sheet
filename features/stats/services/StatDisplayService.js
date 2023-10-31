import LocalStorageService, { LOCAL_STORAGE_SERVICE } from "./LocalStorageService.js";
import { STAT_KEY_DELIMITER, SKILL, BORDER_BOTTOM_CHECKED } from "../util/Constants.js";
import StatKey from "../classes/StatKey.js";

function updateStatTable() {
    var statSheet = document.getElementById("stat-sheet");
    statSheet.innerHTML = statTableBody();
}
function getAthleteTotals(db) {
    return db.statTotals;
}

function statTableBody() {
    var db = LOCAL_STORAGE_SERVICE.getMatchStatDatabase();
    var tableString = "";

    var totalRow = getTotalRowForStatTable(getAthleteTotals(db));
    db.athletes.map(ath => {
        // console.log(ath)
       tableString+= ("<tr><td>" + 
       ath.getNumber() + "</td><td>" + 
       ath.getName() + "</td><td class='div-td'></td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 0) + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 1) + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 2) + "</td><td>" + 
        ath.getNumberOfSkillRatings("PASS", 3) + "</td><td>" + 
        ath.passingAvg + "</td><td class='div-td'></td><td>" + 

        ath.getNumberOfSkillRatings("ATTACK", 0) + "</td><td>" + 
        ath.getNumberOfSkillRatings("ATTACK", 1) + "</td><td>" + 
        ath.getNumberOfSkillRatings("ATTACK", "K") + "</td><td>" + 
        ath.attackAvg + "</td><td class='div-td'></td><td>" + 

        ath.getNumberOfSkillRatings("SERVE", 0) + "</td><td>" + 
        ath.getNumberOfSkillRatings("SERVE", 1) + "</td><td>" + 
        ath.getNumberOfSkillRatings("SERVE", "A") + "</td><td>" + 
        ath.serveAvg + "</td><td class='div-td'></td><td>" + 

        ath.getNumberOfSkillRatings("ERROR", -1) +  "</td></tr>");
    });

    tableString+=totalRow;
    return tableString;
}

function getTotalRowForStatTable(totalObject) {
    // console.log(totalObject)
    return "<tr class = 'total-row'><td></td><td>Totals & Averages</td><td class='div-td'>" 
    + "<td>" + totalObject.pass0 + "</td>" + "<td>" + totalObject.pass1 + "</td>"+ "<td>" + totalObject.pass2 + "</td>"+ "<td>" + totalObject.pass3+ "</td>" + "<td>" + totalObject.passAvg + "</td><td class='div-td'>"
    + "<td>" + totalObject.attack0 + "</td>" + "<td>" + totalObject.attack1 + "</td>" + "<td>" + totalObject.attackK + "</td>" + "<td>" + totalObject.attackAvg + "</td><td class='div-td'>"
    + "<td>" + totalObject.serve0 + "</td>" + "<td>" + totalObject.serve1 + "</td>" + "<td>" + totalObject.serveA + "</td>" + "<td>" + totalObject.serveAvg + "</td><td class='div-td'>"
    + "<td>" + totalObject.errors + "</td>"

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
        var borderTopBottom = (ath.isActive() == "TRUE" ? BORDER_BOTTOM_CHECKED:BORDER_BOTTOM_CHECKED);
        // console.log(ath.getNumber(), ath.isActive())
       tableString+= ("<tr id='" + rowKey + "' style='border-bottom:" + borderTopBottom + "; border-top:" + borderTopBottom + ";'><td>" + 
       ath.getNumber() + "</td><td>" + 
       ath.getName() + "</td>" + 
       "<td class='div-td'></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 0).getKey() + "')>0</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 1).getKey() + "')>1</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 2).getKey() + "')>2</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.PASS, 3).getKey() + "')>3</button></td>" + 
       "<td class='div-td'></td><td>" + 

       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ATTACK, 0).getKey() + "')>0</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ATTACK, 1).getKey() + "')>1</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ATTACK, "K").getKey() + "')>K</button></td>" + 

       "<td class='div-td'></td><td>" +
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.SERVE, 0).getKey() + "')>0</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.SERVE, 1).getKey() + "')>1</button></td><td>" + 
       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.SERVE, "A").getKey() + "')>A</button></td>" + 
       "<td class='div-td'></td><td>" + 

       "<button onclick = updateStats('"+ new StatKey(ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(), SKILL.ERROR, 0).getKey() + "')>E</button></td>" +
       "<td class='div-td'></td><td>" + 
       "<input type='checkbox' rowId='" + rowKey + "' active =" + ath.isActive() + " statkeyprefix='" + [ath.getNumber(), ath.getName().substring(0, 3).toLowerCase(),SKILL.ACTIVE].join(STAT_KEY_DELIMITER) +"'></td>");
    });
    return tableString;
}

export { updateStatTable, updateInputTable }