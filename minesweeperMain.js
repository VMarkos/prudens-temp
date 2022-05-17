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

let policyContainer = document.getElementById("policy-container");

let policyEditor = CodeMirror(policyContainer, {
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  value: TEST_POLICY,
  theme: "monokai",
  mode: "prudens",
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
  // console.log(kbObject);
  console.log(contextObject); // TODO fix some context parsing issue (in propositional cases it includes the semicolon into the name of the prop)
  const output = forwardChaining(kbObject, contextObject["context"]);
  // console.log(output);
  const inferences = output["facts"];
  const graph = output["graph"];
  // console.log("Inferences:");
  // console.log(inferences);
  const outputString = "";
  if (warnings.length > 0) {
      outputString += "Warnings:\n";
  }
  for (const warning of warnings) {
      outputString += warning["name"] + ": " + warning["message"] + "\n";
  }
  // console.log(graph);
  return contextToString(inferences);
}
