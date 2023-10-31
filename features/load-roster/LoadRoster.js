import AthleteStats from "../stats/classes/AthleteStats.js"
export async function loadRoster(jsonFilePath) {
    return fetch(jsonFilePath)
    .then(res=> res.json())
    .then((json) => json.map(athleteJson => new AthleteStats(athleteJson.name, athleteJson.number)))
    .then((athleteList) => athleteList.sort((a, b) => b.isActive() - a.isActive()));
}