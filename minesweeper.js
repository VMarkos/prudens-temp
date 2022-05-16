const ROWS = 12; // Total number of rows.
const COLS = 10; // Total number of columns.
const MINES = 10; // Total number of mines.
let BOARD; // 2D array of integers.
let VISIBLE; //2D boolean array.
let VISIBLE_COUNT = 0; // Number of visible cells.
let PLAYING = true;
let RESULT;

const CELL_LABELS = {
    "-1": {
        "color": "none",
        "label": "&#128163",
    },
    "0": {
        "color": "none",
        "label": "",
    },
    "1": {
        "color": "blue",
        "label": "1",
    },
    "2": {
        "color": "green",
        "label": "2",
    },
    "3": {
        "color": "red",
        "label": "3",
    },
    "4": {
        "color": "#010180",
        "label": "4",
    },
    "5": {
        "color": "#7e0102",
        "label": "5",
    },
    "7": {
        "color": "blacl",
        "label": "7",
    },
    "8": {
        "color": "#808080",
        "label": "8",
    },
};

/*
BOARD structure:
    * 1, 2, ..., 8: Number of mines in adjacent cells;
    * 0: Empty cell;
    * -1: Actual mine;
    * 9: User mine (flag tag);
*/

function populateBoard() { // Creates all board cells (DIV elements).
    const boardContainer = document.getElementById("board-container");
    boardContainer.innerHTML = "";
    boardContainer.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    boardContainer.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
    let cell;
    initializeBoard();
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            cell = document.createElement("div");
            cell.classList.add("minesweeper-cell");
            cell.style.color = CELL_LABELS[BOARD[row][col]]["color"];
            cell.id = row + "-" + col;
            cell.onclick = function () { return unveilMultipleCells(event); };
            boardContainer.appendChild(cell);
        }
    }
}

function initializeBoard() { // Initializes board with mines and numbers of mines in adjacent cells.
    BOARD = new Array(ROWS);
    VISIBLE = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
        BOARD[i] = new Array(COLS);
        VISIBLE[i] = new Array(COLS);
        for (let j = 0; j < COLS; j++) {
            BOARD[i][j] = 0;
            VISIBLE[i][j] = false;
        }
    }
    let row, col;
    for (let i = 0; i < MINES; i++) {
        do {
            row = Math.floor(ROWS * Math.random());
            col = Math.floor(COLS * Math.random());
        } while (BOARD[row][col] === -1);
        BOARD[row][col] = -1;
    }
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (BOARD[row][col] === 0) {
                BOARD[row][col] = countAdjacentMines(row, col);
            }
        }
    }
}

function countAdjacentMines(row, col) { // Counts mines in adjacent cells.
    const leftCol = Math.max(0, col - 1);
    const rightCol = Math.min(COLS, col + 2);
    const topRow = Math.max(0, row - 1);
    const botRow = Math.min(ROWS, row + 2);
    let minesCount = 0;
    for (let i = topRow; i < botRow; i++) {
        for (let j = leftCol; j < rightCol; j++) {
            if (BOARD[i][j] === -1) {
                minesCount++;
            }
        }
    }
    return minesCount;
}

function unveilSingleCell(cell) {
	VISIBLE_COUNT++;
    const coords = cell.id.split("-");
    VISIBLE[coords[0]][coords[1]] = true;
    cell.classList.add("clicked");
    if (cell.id !== LAST_MOVE) {
		fixBorderCell(cell, coords);
	}
    cell.onclick = "none";
    const value = BOARD[coords[0]][coords[1]];
    cell.innerHTML = CELL_LABELS[BOARD[coords[0]][coords[1]]]["label"];
    return value;
}

function fixBorderCell(cell, coords) {
	if (coords[0] === "" + (ROWS - 1) && (coords[1] === "0")) {
			cell.classList.add("bottom-left");
		} else if (coords[0] === "" + (ROWS - 1)) {
			cell.classList.add("bottom");
		} else if (coords[1] === "0") {
			cell.classList.add("left");
		}
}

function unveilMultipleCells(startCellId) {
    let currentCellId, currentCell, coords, nextCellId;
    // const startCell = event.target;
    const front = [startCellId];
    while (front.length > 0) {
        currentCellId = front.pop();
        currentCell = document.getElementById(currentCellId);
        coords = currentCellId.split("-");
        unveilSingleCell(currentCell);
        if (BOARD[coords[0]][coords[1]] !== 0) {
            continue;
        }
        const leftCol = "" + Math.max(0, parseInt(coords[1]) - 1);
        const rightCol = "" + Math.min(COLS - 1, parseInt(coords[1]) + 1);
        const topRow = "" + Math.max(0, parseInt(coords[0]) - 1);
        const botRow = "" + Math.min(ROWS - 1, parseInt(coords[0]) + 1);
        const nextCells = [
            [botRow, leftCol],
            [botRow, rightCol],
            [topRow, leftCol],
            [topRow, rightCol],
            [botRow, coords[1]],
            [topRow, coords[1]],
            [coords[0], leftCol],
            [coords[0], rightCol],
        ];
        for (const nextCellCoords of nextCells) {
            if (nextCellCoords[0] === coords[0] && nextCellCoords[1] === coords[1]) {
                continue;
            }
            nextCellId = nextCellCoords[0] + "-" + nextCellCoords[1];
            if (!VISIBLE[nextCellCoords[0]][nextCellCoords[1]] && BOARD[nextCellCoords[0]][nextCellCoords[1]] > 0) {
                unveilSingleCell(document.getElementById(nextCellId));
            } else if (!VISIBLE[nextCellCoords[0]][nextCellCoords[1]] && BOARD[nextCellCoords[0]][nextCellCoords[1]] === 0 && !front.includes(nextCellId)) {
                front.push(nextCellId);
            }
        }
    }
}

function isWin() {
	return VISIBLE_COUNT === ROWS * COLS - MINES;
}

function gameOver() {
	let cell;
	for (let row = 0; row < ROWS; row++) {
		for (let col = 0; col < COLS; col++) {
			if (!VISIBLE[row][col]) {
				cell = document.getElementById(row + "-" + col);
				cell.classList.add("clicked");
				cell.innerHTML = CELL_LABELS[BOARD[row][col]]["label"];
			}
		}
	}
}

function nextMove(moveFunction=randomMove) {
	if (!PLAYING) {
		startNewGameDialogue("Game over!");
		return;
	}
	const move = moveFunction();
	if (move === -1) {
		gameOver();
		PLAYING = false;
		startNewGameDialogue("You lost!");
	} else if (move === 1) {
		gameOver();
		PLAYING = false;
		startNewGameDialogue("You won!");
	}
}

function startNewGameDialogue(result) {
	const newGame = confirm(`${result} Start another game?`);
		if (newGame) {
			populateBoard();
			PLAYING = true;
		}
}

function main() {
    populateBoard();
	// var agent = new RandomAgent();
}

main();
