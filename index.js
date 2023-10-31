import { sortInputTable } from "./features/interact/SortTable.js";
import LocalStorageService from "./features/stats/services/LocalStorageService.js";
import printStatSheet from "./features/interact/Print.js";
import clearStatSheet from "./features/interact/ClearStats.js";
const localStorageService = new LocalStorageService();

window.sortInputTable = sortInputTable;
window.clearStatSheet = clearStatSheet;
window.printStatSheet = printStatSheet;

window.updateStats = (statKey) => {
    localStorageService.updateStatsByKey(statKey);
}

window.undoLastStatEntry = () => {
    localStorageService.undoLastUpdate();
}

