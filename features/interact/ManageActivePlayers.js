import { LOCAL_STORAGE_SERVICE } from "../stats/services/LocalStorageService.js"
import { STAT_KEY_DELIMITER } from "../stats/util/Constants.js";

function highlightRowIfActive(rowId) {
    var row = document.getElementById(rowId);
    var box = row.querySelector("input[type='checkbox']");
    // console.log(box)
    var table = row.parentNode
    var childIndex = Array.from(table.children).indexOf(row) + 1;

    if (box.getAttribute("active") != null) {
        box.checked = (box.getAttribute("active").toUpperCase() == "TRUE");
        // console.log("active?", box.getAttribute("active").toUpperCase(), box.getAttribute("rowid"), box.checked)
        box.removeAttribute("active");
    }

    LOCAL_STORAGE_SERVICE.updateStatsByKey([box.getAttribute("statkeyprefix"), box.checked].join(STAT_KEY_DELIMITER))
    if (box.checked) {
        // console.log(box.getAttribute("rowid"), "orange")
        row.style.backgroundColor = "orange";
    } else {
        // console.log(box.getAttribute("rowid"), "alt")
        row.style.backgroundColor = (childIndex % 2 == 0) ? "lightgrey": "inherit";
    }
}


export { highlightRowIfActive };
