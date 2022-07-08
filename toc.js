let activeTextId;

function generateToc() {
    const headings = document.querySelectorAll("h2, h3");
    const tocElement = document.getElementById("toc");
    let h, tocA, tocAnchor, tocEntry;
    for (let i=1; i<headings.length; i++) {
        h = headings[i];
        tocAnchor = h.innerHTML.toLowerCase().replace(/\W/gi, "-");
        h.id = tocAnchor;
        if (h.tagName === "H2") {
            h.parentElement.id = tocAnchor + "-container";
            if (i === 1) {
                activeTextId = tocAnchor + "-container";
            } else {
                h.parentElement.style.display = "none";
            }
        }
        tocA = document.createElement("a");
        tocA.href = "#" + tocAnchor;
        tocEntry = document.createElement("li");
        tocEntry.innerHTML = h.innerHTML;
        if (h.tagName === "H2") {
            tocEntry.setAttribute("onclick", "changeTab(this)");
        } else {
            tocEntry.classList.add("toc-container-h3");
            tocEntry.classList.add("toc-entry-hidden");
        }
        tocEntry.id = "t" + tocAnchor + "-container";
        if (i === 1) {
            tocEntry.classList.add("toc-active");
        }
        tocA.appendChild(tocEntry);
        tocElement.appendChild(tocA);
    }
}

function changeTab(e) {
    const activeText = document.getElementById(activeTextId);
    let h3Id, h3TocEntry;
    activeText.style.display = "none";
    document.getElementById("t" + activeTextId).classList.remove("toc-active");
    for (const child of activeText.children) {
        if (child.tagName === "H3") {
            h3Id = "t" + child.id + "-container";
            h3TocEntry = document.getElementById(h3Id);
            h3TocEntry.style.display = "none";
        }
    }
    activeTextId = e.id.substring(1);
    const newActiveText = document.getElementById(activeTextId)
    newActiveText.style.display = "block";
    for (const child of newActiveText.children) {
        if (child.tagName === "H3") {
            h3Id = "t" + child.id + "-container";
            h3TocEntry = document.getElementById(h3Id);
            h3TocEntry.classList.remove("toc-entry-hidden");
            h3TocEntry.style.display = "block";
        }
    }
    e.classList.add("toc-active");
}