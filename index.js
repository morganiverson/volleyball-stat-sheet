import clearStatSheet from "./features/interact/ClearStats.js";
import printStatSheet from "./features/interact/Print.js";
import MatchStatDatabase from "./features/stats/classes/MatchStatDatabase.js";

import initializeTabContent, { displayTabContent } from "./features/tab-content/ManageTabContent.js";
import { LOCAL_STORAGE_SERVICE } from "./features/stats/services/LocalStorageService.js";

import { loadRoster } from "./features/load-roster/LoadRoster.js";
import { sortInputTable } from "./features/interact/SortTable.js";
import { populateTables, addOnChangeListenerForActiveCheckboxes } from "./script.js";
import { updateStatTable, updateInputTable } from "./features/stats/services/StatDisplayService.js";
import { isMobileDevice } from "./features/stats/util/Util.js";
window.sortInputTable = sortInputTable;
window.clearStatSheet = clearStatSheet;
window.printStatSheet = printStatSheet;
window.displayTabContent = (id, element) => {
    displayTabContent(id, element);
}
window.updateStats = (statKey) => {
    LOCAL_STORAGE_SERVICE.updateStatsByKey(statKey);
}

window.undoLastStatEntry = () => {
    LOCAL_STORAGE_SERVICE.undoLastUpdate();
}

window.onload = () => {
    console.log(window.innerWidth)
    initializeTabContent();


    
    console.log("reload")
    var existingData = LOCAL_STORAGE_SERVICE.getMatchStatDatabase();

    if (existingData == null) {
        console.error("Existing Data Not Found. Loading Roster...")
        loadRoster("./roster/lghs_2023_varsity.json")
            .then(athleteJsonList => {
                LOCAL_STORAGE_SERVICE.setDatabase(new MatchStatDatabase(athleteJsonList, []));
                return Promise.resolve();
            })
            .then(() => {
                updateStatTable();
                updateInputTable();
            })
            .then(() => addOnChangeListenerForActiveCheckboxes());
    } else {
        populateTables().then(() => addOnChangeListenerForActiveCheckboxes());
    }

    console.log(isMobileDevice())
    if (window.innerWidth< 1200) {
        console.log("mobile");
        var buttons = document.querySelectorAll("td button").forEach(btn => {
            btn.ontouchstart = () => btn.style.transform = "scale(0.99)";
            btn.ontouchend = () => btn.style.transform = "scale(1)";
    })
        console.log(buttons)
    }
}