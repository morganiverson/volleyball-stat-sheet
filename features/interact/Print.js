export default function printStatSheet() {
    var documentTitle = window.prompt("Stat Sheet Title:", "StatSheet_" + new Date().toLocaleString());
    if (documentTitle == null) {
        return;
    }
    var header = "<html><head><title>" + documentTitle + "</title></head><body><h1>" + documentTitle + "</h1>";
    var footer = "</body></html>";
    var body = document.getElementById("stats-tab").innerHTML;

    var originalDocumentBody = document.body.innerHTML;

    document.body.innerHTML = header + body + footer;
    window.print();
    document.body.innerHTML = originalDocumentBody;
    window.location.reload();
}
