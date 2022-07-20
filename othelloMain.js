const OLD_POLICY = `@KnowledgeBase
South :: cell(Row, Col, N), ?=(Row + 1, X), cell(X, Col, M) implies southHas(Row, Col, M);
North :: cell(Row, Col, N), ?=(Row - 1, X), cell(X, Col, M) implies northHas(Row, Col, M);
East :: cell(Row, Col, N), ?=(Col + 1, X), cell(Row, X, M) implies eastHas(Row, Col, M);
West :: cell(Row, Col, N), ?=(Col - 1, X), cell(Row, X, M) implies westHas(Row, Col, M);
SouthEast :: cell(Row, Col, N), ?=(Row + 1, X), ?=(Col + 1, Y), cell(X, Y, M) implies southEastHas(Row, Col, M);
NorthEast :: cell(Row, Col, N), ?=(Row - 1, X), ?=(Col + 1, Y), cell(X, Y, M) implies northEastHas(Row, Col, M);
SouthWest :: cell(Row, Col, N), ?=(Row + 1, X), ?=(Col - 1, Y), cell(X, Y, M) implies southWestHas(Row, Col, M);
NorthWest :: cell(Row, Col, N), ?=(Row - 1, X), ?=(Col - 1, Y), cell(X, Y, M) implies northWestHas(Row, Col, M);

BaseCase :: cell(X, Y, 0) implies safe(X, Y);

R1 :: southHas(X, Y, 1) implies mine(X, Y);
R2 :: northHas(X, Y, 1) implies mine(X, Y);
R3 :: eastHas(X, Y, 1) implies mine(X, Y);
R4 :: westHas(X, Y, 1) implies mine(X, Y);
R5 :: southEastHas(X, Y, 1) implies mine(X, Y);
R6 :: southWestHas(X, Y, 1) implies mine(X, Y);
R7 :: northEastHas(X, Y, 1) implies mine(X, Y);
R8 :: northWestHas(X, Y, 1) implies mine(X, Y);

Conflict01 :: mine(X, Y) # safe(X, Y);`

const TEST_POLICY = `@KnowledgeBase
Dummy :: legalMove(X, Y) implies move(X, Y);`

let policyContainer = document.getElementById("policy-container");

let policyEditor = CodeMirror(policyContainer, {
    lineNumbers: true,
    tabSize: 2,
    gutter: true,
    value: TEST_POLICY,
    theme: "monokai",
    mode: "simplemode",
    lineWrapping: true,
});

policyEditor.setSize(400, 640);

/*
Formerly utils.js
*/

function otDeduce() {
  "use strict";
  const kbObject = otKbParser();
  if (kbObject["type"] === "error") {
      return "ERROR: " + kbObject["name"] + ":\n" + kbObject["message"];
  }
  const warnings = kbObject["warnings"];
  const contextObject = otContextParser();
  if (contextObject["type"] === "error") {
      return "ERROR: " + contextObject["name"] + ":\n" + contextObject["message"];
  }
  console.log(contextObject); // TODO fix some context parsing issue (in propositional cases it includes the semicolon into the name of the prop)
  const output = forwardChaining(kbObject, contextObject["context"]);
  const inferences = output["facts"];
  // console.log(graph);
  return contextToString(inferences);
}

function otKbParser() {
  const kbAll = policyEditor.getValue();
  return parseKB(kbAll);
}

function otContextParser() {
  const context = extractContext();
  const contextList = parseContext(context);
  // console.log(contextList);
  if (contextList["type"] === "error") {
      return contextList;
  }
  return contextList;
}

function displayInfo() {
    const otMainCard = document.getElementById("othello-main-card");
    const otHelp = document.getElementById("othello-help");
    changeTabs(otMainCard, otHelp);
}

function displayBoard() {
	const otMainCard = document.getElementById("othello-main-card");
    const otHelp = document.getElementById("othello-help");
    changeTabs(otHelp, otMainCard);
}

function changeTabs(e1, e2) {
    e1.classList.add("shrink-to-center");
    setTimeout(
        () => {
            e1.classList.add("no-display");
            e1.classList.add("invisible");
            e1.style.scale = "0%";
            e2.classList.remove("shrink-to-center");
            e2.classList.remove("no-display");
            e2.classList.remove("inivisible");
            e2.offsetHeight;
            e2.style.scale = "100%";
        },
        600
    );
}
