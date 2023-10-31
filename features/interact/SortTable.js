import { addOnChangeListenerForActiveCheckboxes } from "../../script.js";
const ASCENDING = true;
const DESCENDING = false;
const INPUT_TABLE_ID = "input-table";

const ATH_NUM_KEY = "num";
const ATH_ACTIVE_KEY = "active";

function sortInputTableByActive(ascending) {
    var rows = [...document.getElementById(INPUT_TABLE_ID).querySelectorAll("tr")];
    return rows.sort((a,b) => {
        if (ascending) {
            return b.querySelector("input[type='checkbox']").checked - a.querySelector("input[type='checkbox']").checked;
        } else {
            return a.querySelector("input[type='checkbox']").checked - b.querySelector("input[type='checkbox']").checked;
        }
    });
}

function sortInputTableByNumber(ascending) {
    var rows = [...document.getElementById(INPUT_TABLE_ID).querySelectorAll("tr")];
    console.log(parseInt(rows[0].querySelector("td").innerHTML));
    return rows.sort((a,b) => {
        if (ascending) {
            return parseInt(a.querySelector("td").innerHTML) - parseInt(b.querySelector("td").innerHTML);
        } else {
            return parseInt(b.querySelector("td").innerHTML) - parseInt(a.querySelector("td").innerHTML);
        }
    });
}

function addActiveAttributeIfActiveIsChecked(list) {
    list.forEach(elm => {
        var currentActiveCheckbox = elm.querySelector("input[type='checkbox']");
        if (currentActiveCheckbox.checked) {
            console.log(elm)
            currentActiveCheckbox.setAttribute("active", "TRUE");
        }
    })
}
function getNodeListAsString(list) {
    return list.map(elm => elm.outerHTML).join("\n\n");
}

function sortInputTableAsync(key, ascending) {
    var input_table = document.getElementById(INPUT_TABLE_ID);
    var sortedList = [...input_table.querySelectorAll("tr")];
    if (key == ATH_NUM_KEY) {
        sortedList = sortInputTableByNumber(ascending);
    } else if (key == ATH_ACTIVE_KEY) {
        sortedList = sortInputTableByActive(ascending);
    }

    addActiveAttributeIfActiveIsChecked(sortedList);
    console.log(sortedList);
    input_table.innerHTML = getNodeListAsString(sortedList);
    return Promise.resolve();
}

export function sortInputTable(key, ascending) {
    console.log("Sort Table: " + key + (ascending ? " ASC":" DES"))
    sortInputTableAsync(key, ascending)
    .then(() => addOnChangeListenerForActiveCheckboxes());
}