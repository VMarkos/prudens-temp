const N_ROWS = 10;
const N_COLS = 10;

let BOARD; // 0 = empty, 1 = white, -1 = black.
let LEGAL_MOVES; // String array, containing all cell ids that are legal moves.
let TO_BE_FLIPPED; // List of cell ids that should be flipped.
let LAST_MOVE;
let ALL_DIRECTIONS = [
    [1, -1], [1, 0], [1, 1],
    [0, -1], [0, 1],
    [-1, -1], [-1, 0], [-1, 1],
];
let PLAYING = true;
let EMPTY_CELLS = N_ROWS * N_COLS - 4;
let NO_LEGAL_MOVES = false;
let FAILED_MOVES = 0;

function initializeBoard() {
    const boardContainer = document.getElementById("board-container");
    let othelloCell;
    boardContainer.style.gridTemplateColumns = "repeat(" + N_COLS + ", 1fr)";
    BOARD = new Array(N_ROWS);
    for (let i=0; i < N_ROWS; i++) {
        BOARD[i] = [];
        for (let j=0; j < N_COLS; j++) {
            BOARD[i].push(0);
            othelloCell = document.createElement("div");
            othelloCell.classList.add("othello-cell");
            othelloCell.id = "oc-" + i + "-" + j;
            boardContainer.append(othelloCell);
        }
    }
    setUpPosition(boardContainer);
    calculateLegalMoves();
    // console.log("LEGAL_MOVES:", LEGAL_MOVES);
    // debugger;
    drawLegalMoves();
}

function drawLegalMoves() {
    let cellContainer, legalMove;
    for (const cellId of LEGAL_MOVES) {
        // console.log(cellId);
        // debugger;
        cellContainer = document.getElementById(cellId);
        legalMove = document.createElement("div");
        legalMove.classList.add("legal-moves-black");
        cellContainer.append(legalMove);
    }
}

function eraseLegalMoves() {
    let cellContainer;
    for (const cellId of LEGAL_MOVES) {
        cellContainer = document.getElementById(cellId);
        while (cellContainer.firstChild) {
            cellContainer.removeChild(cellContainer.lastChild);
        }
    }
}

function flipPieces() { // cellId is the id of the last move.
    let coords, currentPiece, row, col;
    // console.log("TO_BE_FLIPPED:", TO_BE_FLIPPED);
    for (const cellId of TO_BE_FLIPPED[LAST_MOVE]) {
        currentPiece = document.getElementById(cellId).lastChild;
        // console.log("cellId:", cellId);
        coords = cellId.split("-");
        row = coords[1];
        col = coords[2];
        // console.log("row:", row, "col:", col);
        if (BOARD[row][col] === -1) {
            currentPiece.classList.remove("othello-piece-black");
            currentPiece.classList.add("othello-piece-white");
            BOARD[row][col] = 1;
        } else {
            currentPiece.classList.remove("othello-piece-white");
            currentPiece.classList.add("othello-piece-black");
            BOARD[row][col] = -1;
        }
    }
}

function setUpPosition() {
    let xc1, xc2, yc1, yc2, cell, piece;
    if (N_ROWS % 2 === 0) {
        xc1 = N_ROWS / 2 - 1;
        xc2 = xc1 + 1;
    } else {
        xc1 = (N_ROWS - 1) / 2;
        xc2 = xc1 + 1;
    }
    if (N_COLS % 2 === 0) {
        yc1 = N_COLS / 2 - 1;
        yc2 = yc1 + 1;
    } else {
        yc1 = (N_COLS - 1) / 2;
        yc2 = yc1 + 1;
    }
    BOARD[xc1][yc1] = 1;
    cell = document.getElementById("oc-" + xc1 + "-" + yc1);
    piece = document.createElement("div");
    piece.classList.add("othello-piece-white");
    cell.append(piece);
    BOARD[xc1][yc2] = -1;
    cell = document.getElementById("oc-" + xc1 + "-" + yc2);
    piece = document.createElement("div");
    piece.classList.add("othello-piece-black");
    cell.append(piece);
    BOARD[xc2][yc1] = -1;
    cell = document.getElementById("oc-" + xc2 + "-" + yc1);
    piece = document.createElement("div");
    piece.classList.add("othello-piece-black");
    cell.append(piece);
    BOARD[xc2][yc2] = 1;
    cell = document.getElementById("oc-" + xc2 + "-" + yc2);
    piece = document.createElement("div");
    piece.classList.add("othello-piece-white");
    cell.append(piece);
}

function calculateLegalMoves(opponent = 1) {
    LEGAL_MOVES = [];
    TO_BE_FLIPPED = {};
    let toBeFlipped, currentCellId;
    for (let i = 0; i < N_ROWS; i++) {
        for (let j = 0; j < N_COLS; j++) {
            currentCellId = "oc-" + i + "-" + j;
            toBeFlipped = [];
            for (const direction of ALL_DIRECTIONS) {
                toBeFlipped.push(...isLegalMoveInDirection(currentCellId, direction[0], direction[1], opponent));
            }
            // console.log("toBeFlipped:", toBeFlipped);
            if (toBeFlipped.length !== 0) {
                LEGAL_MOVES.push(currentCellId);
                TO_BE_FLIPPED[currentCellId] = toBeFlipped;
            }
        }
    }
}

function isLegalMoveInDirection(cellId, xStep, yStep, opponent = 1) {
    const coords = cellId.split("-");
    // console.log(cellId);
    const cellX = parseInt(coords[1]);
    const cellY = parseInt(coords[2]);
    const opponentCells = [];
    if (BOARD[cellX][cellY] !== 0) {
        // console.log("Non-empty cell.");
        return [];
    }
    let currentX = cellX + xStep, currentY = cellY + yStep, isPreviousWhite = false;
    if (cellX === 3 && cellY === 4) {
        // console.log("x:", currentX, "y:", currentY, "board:", BOARD[currentX][currentY]);
        // debugger;
    }
    while (currentX < N_ROWS && currentX > 0 && currentY < N_COLS && currentY > 0 && BOARD[currentX][currentY] !== 0) {
        // console.log("Here!");
        if (isPreviousWhite && BOARD[currentX][currentY] === -opponent) {
            return opponentCells;
        }
        if (!isPreviousWhite) {
            if (BOARD[currentX][currentY] === -opponent) {
                return [];
            }
            isPreviousWhite = true;
        }
        opponentCells.push("oc-" + currentX + "-" + currentY);
        currentX += xStep;
        currentY += yStep;
    }
    return [];
}

function gameOver() {
	let cell;
	for (let row = 0; row < N_ROWS; row++) {
		for (let col = 0; col < N_COLS; col++) {
			if (!VISIBLE[row][col] && BOARD[row][col] === -1) {
				cell = document.getElementById(row + "-" + col);
				unveilSingleCell(cell);
				// cell.classList.add("clicked");
				// cell.innerHTML = CELL_LABELS[BOARD[row][col]]["label"];
			}
		}
	}
}

function startNewGameDialogue(result) {
	const newGame = confirm(`${result} Start another game?`);
		if (newGame) {
			initializeBoard();
            // document.getElementById("play-button-text").innerHTML = "Next";
			// PLAYING = true;
		}
}

function nextMove(moveFunction=randomMove) {
	if (!PLAYING) { // Do you really need this?
        // console.log("Not Playing!");
        initializeBoard();
        // console.log("Board populated!");
		PLAYING = true;
        document.getElementById("play-button-text").innerHTML = "Next";
	}
	const move = moveFunction();
	if (move === -1) {
        // console.log(-1);
		// gameOver();
		// PLAYING = false;
        // document.getElementById("play-button-text").innerHTML = "Start";
		// startNewGameDialogue("You lost!");
	} else if (move === 1) {
		gameOver();
		PLAYING = false;
        document.getElementById("play-button-text").innerHTML = "Start";
		startNewGameDialogue("Game Over!");
	}
}

function main() {
    initializeBoard();
}

main();