const TEST_POLICY = `@KnowledgeBase
Dummy :: legalMove(Piece, Color, FromCol, FromRow, ToCol, ToRow, Flags) implies move(Piece, Color, FromCol, FromRow, ToCol, ToRow, Flags);`

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

let chess, board;

function initChessboard() {
    board = Chessboard("game-board", "start");
    chess = new Chess();
    // console.log(chess.fen());
    // const moves = chess.moves();
    // const move = moves[Math.floor(Math.random() * moves.length)];
    // makeMove(move);
}

function playARound(timeout = 200) {
    const prudensMove = prudensChessAgent();
    makeMove(prudensMove);
    if (chess.game_over()) {
        gameOverDialogue();
        return;
    }
    setTimeout(() => {
        const randomMove = randomChessAgent();
        makeMove(randomMove);
        if (chess.game_over()) {
            gameOverDialogue();
        }
    }, timeout);
}

function makeMove(move) {
    chess.move(move);
    board = Chessboard("game-board", chess.fen());
}

function randomChessAgent() {
    const moves = chess.moves();
    return moves[Math.floor(Math.random() * moves.length)];
}

function prudensChessAgent() {
    const context = extractChessContext();
    const policy = parseKB(policyEditor.getValue());
    const output = forwardChaining(policy, context);
    const inferences = output["facts"];
    const candidateMoves = [];
    // console.log(inferences);
    for (const inference of inferences) {
        if (inference["name"] === "move") {
            // console.log("here");
            candidateMoves.push({
                piece: inference["args"][0]["value"].toLowerCase(),
                color: inference["args"][1]["value"],
                from: inference["args"][2]["value"] + inference["args"][3]["value"],
                to: inference["args"][4]["value"] + inference["args"][5]["value"],
                flags: inference["args"][6]["value"],
            });
        }
    }
    if (candidateMoves.length === 0) {
        return randomChessAgent();
    }
    return candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
}

function extractChessContext() {
    let piece;
    let contextString = "";
    for (const col of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
        for (let row = 1; row < 9; row++) {
            piece = chess.get(col + row);
            if (piece !== null) {
                contextString += "at(" + col + "," + row + "," + piece["type"] + "," + piece["color"] + ");";
            }
        }
    }
    const moves = chess.moves({verbose: true});
    for (const move of moves) {
        contextString += "legalMove(" + move["piece"] + "," + move["color"] + "," + move["from"][0] + "," + move["from"][1] + "," + move["to"][0] + "," + move["to"][1] + "," + move["flags"] + ");";
    }
    return parseContext(contextString)["context"];
}

/*
Formerly utils.js
*/

function gameOverDialogue() {
    const newGame = confirm("Game Over! Play another game?");
    if (newGame) {
        initChessboard();
    }
}

function displayInfo() {
    const otMainCard = document.getElementById("chess-main-card");
    const otHelp = document.getElementById("chess-help");
    changeTabs(otMainCard, otHelp);
}

function displayBoard() {
	const otMainCard = document.getElementById("chess-main-card");
    const otHelp = document.getElementById("chess-help");
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
            e2.offsetHeight;
            console.log(e2);
            e2.style.scale = "100%";
        },
        600
    );
}

function main() {
    initChessboard();
}

main();