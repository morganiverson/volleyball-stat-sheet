import { LOCAL_STORAGE_SERVICE } from "../stats/services/LocalStorageService.js"
import { ACTIVE_HIGHLIGHT_COLOR, BORDER_BOTTOM_CHECKED, BORDER_BOTTOM_UNCHECKED, STAT_KEY_DELIMITER } from "../stats/util/Constants.js";

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
        row.style.backgroundColor = ACTIVE_HIGHLIGHT_COLOR;
        row.style.borderBottom = BORDER_BOTTOM_CHECKED;
        row.style.borderTop = BORDER_BOTTOM_CHECKED;

    } else {
        row.style.backgroundColor = (childIndex % 2 == 0) ? "lightgrey": "inherit";
        row.style.borderBottom = BORDER_BOTTOM_UNCHECKED;
        row.style.borderTop = BORDER_BOTTOM_UNCHECKED;
    }
}


export { highlightRowIfActive };
