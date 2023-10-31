export default function clearStatSheet() {
    var clear = confirm("Are you sure you want to clear this stat sheet?");
    if (clear) {
        localStorage.clear();
        window.location.reload()
    }
}