let activeTextId;

function generateToc() {
    const headings = document.querySelectorAll("h2");
    const tocElement = document.getElementById("toc");
    let h, tocA, tocAnchor, tocEntry;
    for (let i=1; i<headings.length; i++) {
        h = headings[i];
        tocAnchor = h.innerHTML.toLowerCase().replace(/\W/gi, "-");
        h.id = tocAnchor;
        h.parentElement.id = tocAnchor + "-container";
        if (i === 1) {
            activeTextId = tocAnchor + "-container";
        } else {
            h.parentElement.style.display = "none";
        }
        tocA = document.createElement("a");
        tocA.href = "#" + tocAnchor;
        tocEntry = document.createElement("li");
        tocEntry.innerHTML = h.innerHTML;
        tocEntry.setAttribute("onclick", "changeTab(this)");
        tocEntry.id = "t" + tocAnchor + "-container";
        if (i === 1) {
            tocEntry.classList.add("toc-active");
        }
        tocA.appendChild(tocEntry);
        tocElement.appendChild(tocA);
    }
}

function changeTab(e) {
    document.getElementById(activeTextId).style.display = "none";
    document.getElementById("t" + activeTextId).classList.remove("toc-active");
    activeTextId = e.id.substring(1);
    document.getElementById(activeTextId).style.display = "block";
    e.classList.add("toc-active");
}