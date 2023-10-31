export async function loadRoster(jsonFilePath) {
    return fetch(jsonFilePath).then(res=> res.json());
}