import AthleteStats, { createAthleteStats } from "./features/stats/classes/AthleteStats.js";
import StatKey from "./features/stats/classes/StatKey.js";
import * as Util from "./features/stats/util/Util.js";
import MatchStatDatabase from "./features/stats/classes/MatchStatDatabase.js";
import { STAT_KEY_DELIMITER, SKILL, LOCAL_STG_DB_KEY } from "./features/stats/util/Constants.js";
import LocalStorageService from "./features/stats/services/LocalStorageService.js";
import { loadRoster } from "./features/load-roster/LoadRoster.js";
import { updateInputTable, updateStatTable } from "./features/stats/services/StatDisplayService.js";
const localStorageService = new LocalStorageService();






window.addEventListener("load", () => {

    console.log("reload")
    var existingData = localStorageService.getMatchStatDatabase();

    if (existingData == null) {
        alert("Existing Data Not Found. Loading Roster...")
        loadRoster("./roster/lghs_2023_varsity.json")
            .then(json => json.map(athleteJson => new AthleteStats(athleteJson.name, athleteJson.number)))
            .then(athleteJsonList => {
                // console.log(athleteJsonList)
                localStorageService = new LocalStorageUtil(new MatchStatDatabase(athleteJsonList, []));
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
                    highlightRowIfActive(rowId);
                    box.addEventListener("change", (e) => highlightRowIfActive(rowId));
                })
            });
    } else {
        populateTables().then(() => {
            addOnChangeListenerForActiveCheckboxes();
        })
    }
    
});


function addOnChangeListenerForActiveCheckboxes() {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
            // console.log(checkboxes)
            checkboxes.forEach(box => {
                var rowId = box.getAttribute("rowId");
                highlightRowIfActive(rowId);
                box.addEventListener("change", (e) => {
                    highlightRowIfActive(rowId);
                });
            }) ;
}

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
        var athleteIsActive = box.checked;

        if (box.getAttribute("active") != null) {
            box.checked = (box.getAttribute("active").toUpperCase() == "TRUE");
            // console.log("active", box.getAttribute("active").toUpperCase(), box.getAttribute("rowid"), box.checked, box)
            box.removeAttribute("active");
            // return;
        }

        localStorageService.updateStatsByKey([box.getAttribute("statkeyprefix"), athleteIsActive].join(STAT_KEY_DELIMITER))
        if (box.checked) {
            console.log(box.getAttribute("rowid"), "orange")
            row.style.backgroundColor = "orange";
        } else {
            // console.log(box.getAttribute("rowid"), "alt")
            row.style.backgroundColor = (childIndex % 2 == 0) ? "lightgrey": "inherit";
        }
    }


    export { addOnChangeListenerForActiveCheckboxes };
