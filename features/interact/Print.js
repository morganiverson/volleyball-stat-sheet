export default function printStatSheet() {
    var table = document.getElementById("stats-tab").querySelector("table");
    // table.querySelectorAll

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

    if (sessionStorage.getItem("MOBILE") != "true") {
        window.location.reload()
    } else {
        window.addEventListener("afterprint", () => {
            document.body.innerHTML = originalDocumentBody;

            window.removeEventListener("afterprint", this)
        });
    }
}
