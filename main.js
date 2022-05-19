let policyContainer = document.getElementById("policy-container");
let contextContainer = document.getElementById("context-container");
let consoleContainer = document.getElementById("console-container");

let policyEditor = CodeMirror(policyContainer, {
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  value: '@KnowledgeBase\n',
  theme: "monokai",
  mode: "simplemode",
});

policyEditor.setSize(400, 640);

let contextEditor = CodeMirror(contextContainer, {
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  theme: "monokai",
  mode: "simplemode",
});

contextEditor.setSize(400, 300);

let consoleEditor = CodeMirror(consoleContainer, { // TODO Change that to some textarea or so?
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  theme: "monokai",
  readOnly: true,
});

consoleEditor.setSize(400, 300);
consoleEditor.setValue("~$ ");

/*
Formerly utils.js
*/

function abduce() {
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
  const targetsObject = targetParser();
  if (targetsObject["type"] === "error") {
      return "ERROR: " + targetsObject["name"] + ":\n" + targetsObject["message"];
  }
  const domainsObject = domainsParser();
  if (domainsObject["type"] === "error") {
      return "ERROR: " + domainsObject["name"] + ":\n" + domainsObject["message"];
  }
  const output = greedyPropositionalAbduction(kbObject, contextObject["context"], targetsObject["targets"]); // TODO This version of abduction handles only one target --- a simple loop could fix this.
  console.log(domainsObject);
  // const output = greedyRelationalAbduction(kbObject, contextObject["context"], targetsObject["targets"][0], domainsObject["predicates"]);
  // console.log(output);
  const outputString = "";
  if (warnings.length > 0) {
      outputString += "Warnings:\n";
  }
  for (const warning of warnings) {
      outputString += warning["name"] + ": " + warning["message"] + "\n";
  }
  // console.log(graph);
  return outputString + "Missing Facts: " +  abductiveProofsToString(output);
}

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
  return outputString + "Context: " + contextToString(contextObject["context"]) + "\nInferences: " + contextToString(inferences) + "\nGraph: " + graphToString(graph);
}

function kbParser() {
  const kbAll = policyEditor.getValue();
  return parseKB(kbAll);
}

function contextParser() {
  const context = contextEditor.getValue();
  const contextList = parseContext(context);
  // console.log(contextList);
  if (contextList["type"] === "error") {
      return contextList;
  }
  return contextList;
}

function consoleOutput() {
  "use strict";
  let newText;
  // if (document.getElementById("exec-button").innerHTML != "Deduce!") {
  // newText = "I am currently not working - wait for some next update!\n\nThanks for your patience! :)";
  // } else {
  newText = deduce();
  // }
  // const previous = document.getElementById("console-container").value;
  const previous = consoleEditor.getValue();
  // document.getElementById(tab + "-console").value = previous + newText + "\n~$ ";
  consoleEditor.setValue(previous + newText + "\n~$");
  /* if (document.getElementById("download-checkbox").checked) {
      download("output.txt", newText);
  }*/
}

function clearConsole() {
  "use strict";
  document.getElementById(tab + "-console").value = "~$ ";
}

function download(filename, content) {
  let element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
