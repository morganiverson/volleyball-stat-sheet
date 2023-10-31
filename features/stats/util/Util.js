import { STAT_KEY_DELIMITER, SKILL } from "./Constants.js";
import StatKey from "../classes/StatKey.js";
import LocalStorageService from "../services/LocalStorageService.js";

export const LOCAL_STORAGE_SERVICE = new LocalStorageService();

function parseKeyString(statKeyString) {
    var statKeyArray = statKeyString.split(STAT_KEY_DELIMITER);
    if (statKeyArray.length != 4) {
        console.error("Invalid StatKey String: " + statKeyString);
        throw new Exception("Invalid StatKey String: " + statKeyString);
    }
    return new StatKey(statKeyArray[0], statKeyArray[1], statKeyArray[2], statKeyArray[3]);
}

function getSkill(skillString) {
    var index = Object.values(SKILL).indexOf(skillString);
    try {
        return Object.keys(SKILL)[index];
    } catch (error) {
        console.error("Invalid Skill Value: " + skillString);
        throw new Exception("Invalid Skill Value: " + skillString)
    }
}

function round(num, numDigits) {
    return Number.parseFloat(num).toFixed(numDigits);
}

function isMobileDevice() {
    console.log(navigator.userAgent)
    return null;
}

export { getSkill, parseKeyString, round, isMobileDevice }