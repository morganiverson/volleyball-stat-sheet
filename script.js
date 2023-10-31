import AthleteStats from "./features/stats/classes/AthleteStats.js";
import MatchStatDatabase from "./features/stats/classes/MatchStatDatabase.js";
import { STAT_KEY_DELIMITER, SKILL, LOCAL_STG_DB_KEY } from "./features/stats/util/Constants.js";
import LocalStorageService, { LOCAL_STORAGE_SERVICE } from "./features/stats/services/LocalStorageService.js";
import { loadRoster } from "./features/load-roster/LoadRoster.js";
import { updateInputTable, updateStatTable } from "./features/stats/services/StatDisplayService.js";
import { highlightRowIfActive } from "./features/interact/ManageActivePlayers.js";

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
