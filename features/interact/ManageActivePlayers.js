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
        console.log("active", box.getAttribute("active").toUpperCase(), box.getAttribute("rowid"), box.checked, box)
        box.removeAttribute("active");
        // return;
    }

    localStorageService.updateStatsByKey([box.getAttribute("statkeyprefix"), athleteIsActive].join(STAT_KEY_DELIMITER))
    if (box.checked) {
        console.log(box.getAttribute("rowid"), "orange")
        row.style.backgroundColor = "orange";
    } else {
        console.log(box.getAttribute("rowid"), "alt")
        row.style.backgroundColor = (childIndex % 2 == 0) ? "lightgrey": "inherit";
    }
}


export { highlightRowIfActive };
