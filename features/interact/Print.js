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
    // if (window.innerHeight <1300) {
    //     try {
    //     document.execCommand('print', false, null);
    //     }
    //     catch {
    //         window.print();
    //     }
    // } else {
        window.print();
    // }
    // window.addEventListener("afterprint", () => {
        
    //     // window.location.reload();
    //     window.removeEventListener("afterprint")
    // });
    document.body.innerHTML = originalDocumentBody;

    if (window.innerHeight > 1300) {
        window.location.reload()
    }
}
