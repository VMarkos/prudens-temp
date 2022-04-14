let policyContainer = document.getElementById("policy-container");
let contextContainer = document.getElementById("context-container");
let consoleContainer = document.getElementById("console-container");

let policyEditor = CodeMirror(policyContainer, {
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  value: '@KnowledgeBase\n',
  theme: "monokai",
});

policyEditor.setSize(400, 640);

let contextEditor = CodeMirror(contextContainer, {
  lineNumbers: true,
  tabSize: 2,
  gutter: true,
  theme: "monokai",
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