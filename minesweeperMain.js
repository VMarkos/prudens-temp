let policyContainer = document.getElementById("policy-container");

let policyEditor = CodeMirror(policyContainer, {
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  value: '@KnowledgeBase\n',
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
  // console.log(contextObject); // TODO fix some context parsing issue (in propositional cases it includes the semicolon into the name of the prop)
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
