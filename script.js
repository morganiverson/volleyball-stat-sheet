import AthleteStats from "./features/stats/classes/AthleteStats.js";
import MatchStatDatabase from "./features/stats/classes/MatchStatDatabase.js";
import { STAT_KEY_DELIMITER, SKILL, LOCAL_STG_DB_KEY } from "./features/stats/util/Constants.js";
import LocalStorageService, { LOCAL_STORAGE_SERVICE } from "./features/stats/services/LocalStorageService.js";
import { loadRoster } from "./features/load-roster/LoadRoster.js";
import { updateInputTable, updateStatTable } from "./features/stats/services/StatDisplayService.js";
import { highlightRowIfActive } from "./features/interact/ManageActivePlayers.js";

// window.addEventListener("load", () => {

//     console.log("reload")
//     var existingData = LOCAL_STORAGE_SERVICE.getMatchStatDatabase();

//     if (existingData == null) {
//         alert("Existing Data Not Found. Loading Roster...")
//         loadRoster("./roster/lghs_2023_varsity.json")
//             .then(json => json.map(athleteJson => new AthleteStats(athleteJson.name, athleteJson.number)))
//             .then(athleteJsonList => {
//                 // console.log(athleteJsonList)
//                 LOCAL_STORAGE_SERVICE = new LocalStorageService(new MatchStatDatabase(athleteJsonList, []));
//                 return Promise.resolve();
//             })
//             .then(() => {
//                 updateStatTable();
//                 updateInputTable();
//             })
//             .then(() => {
//                 var checkboxes = document.querySelectorAll("input[type='checkbox']");
//                 // console.log(checkboxes)
//                 checkboxes.forEach(box => {
//                     var rowId = box.getAttribute("rowId");
//                     highlightRowIfActive(rowId);
//                     box.addEventListener("change", (e) => highlightRowIfActive(rowId));
//                 })
//             });
//     } else {
//         populateTables().then(() => {
//             addOnChangeListenerForActiveCheckboxes();
//         })
//     }
    
// });


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

export { populateTables, addOnChangeListenerForActiveCheckboxes };
