const TAB_LS_KEY = "tab"
const TAB_CONTENT_CLASS_NAME = "tab-content";
const TAB_BTN_CLASS_NAME = "tab-btn";
const SELECTED_TAB_CLASS_NAME = "selected-tab";

const DEFAULT_TAB_ID = "stats-tab";

export function displayTabContent(id, element) {
    //hide other tab content
    [...document.getElementsByClassName(TAB_CONTENT_CLASS_NAME)].filter(element => element.id != id).forEach(element => element.style.display = "none");
    
    //display desired content
    document.getElementById(id).style.display = "block";

    //highlight current tab
    [...document.getElementsByClassName(TAB_BTN_CLASS_NAME)].forEach(element => element.classList.remove(SELECTED_TAB_CLASS_NAME));
    // element.style.backgroundColor = "lightgrey";
    element.classList.add(SELECTED_TAB_CLASS_NAME);
    localStorage.setItem(TAB_LS_KEY, id);

}

export default function initializeTabContent() {
    var currentTab = localStorage.getItem(TAB_LS_KEY);
    if (currentTab == null) {
        currentTab = DEFAULT_TAB_ID;
        localStorage.setItem(TAB_LS_KEY, currentTab);
    }
    displayTabContent(currentTab, document.querySelector("button.tab-btn[ref='" + currentTab + "']"));
}