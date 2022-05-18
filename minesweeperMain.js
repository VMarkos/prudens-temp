const TEST_POLICY = `@KnowledgeBase
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

CodeMirror.defineSimpleMode("simplemode", {
  // The start state contains the rules that are initially used
  start: [
    // The regex matches the token, the token property contains the type
    {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    {regex: /(([A-Z]\w*)(?=(\s*,|\))))/,
     token: "variable-3"},
    {regex: /(([a-z]\w*)(?=(\s*,|\))))/,
     token: "variable-2"},
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above
    {regex: /(implies|::|@KnowledgeBase|@Code)/,
     token: "keyword"},
    {regex: /(\w+)(?=(\s*)(::))/, token: "variable-3"},
    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
     token: "number"},
    {regex: /\/\/.*/, token: "comment"},
    {regex: /(([a-z]\w+)(?=(\())|(\?=))/, token: "atom"},
    // A next property will cause the mode to move to a different state
    {regex: /\/\//, token: "comment"},
    {regex: /[-+\/*=<>!#]+/, token: "operator"},
    // indent and dedent properties guide autoindentation
    {regex: /[\{\[\(]/, indent: true},
    {regex: /[\}\]\)]/, dedent: true},
    {regex: /[a-z$][\w$]*/, token: "variable"},
    // You can embed other modes with the mode property. This rule
    // causes all code between << and >> to be highlighted with the XML
    // mode.
    {regex: /<</, token: "meta", mode: {spec: "xml", end: />>/}}
  ],
  // The multi-line comment state.
  comment: [
    {regex: /.*?\*\//, token: "comment", next: "start"},
    {regex: /.*/, token: "comment"}
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});

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

function deduce() {
  "use strict";
  const kbObject = kbParser();
  if (kbObject["type"] === "error") {
      return "ERROR: " + kbObject["name"] + ":\n" + kbObject["message"];
  }
  const warnings = kbObject["warnings"];
  const contextObject = contextParser();
  if (contextObject["type"] === "error") {
      return "ERROR: " + contextObject["name"] + ":\n" + contextObject["message"];
  }
  console.log(contextObject); // TODO fix some context parsing issue (in propositional cases it includes the semicolon into the name of the prop)
  const output = forwardChaining(kbObject, contextObject["context"]);
  const inferences = output["facts"];
  // console.log(graph);
  return contextToString(inferences);
}

function displayInfo() {
    const msMainCard = document.getElementById("minesweeper-main-card");
    const msHelp = document.getElementById("minesweeper-help");
    changeTabs(msMainCard, msHelp);
}

function displayBoard() {
	const msMainCard = document.getElementById("minesweeper-main-card");
    const msHelp = document.getElementById("minesweeper-help");
    changeTabs(msHelp, msMainCard);
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
