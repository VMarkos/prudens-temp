let LAST_MOVE;

function randomMove() {
	let row, col;
	do {
		row = Math.floor(ROWS * Math.random());
		col = Math.floor(COLS * Math.random());
	} while (VISIBLE[row][col]);
	const cellId = row + "-" + col;
	updateLastMove(cellId);
	if (BOARD[row][col] === -1) {
		return -1;
	}
	unveilMultipleCells(cellId);
	if (isWin()) {
		return 1;
	}
	return 0;
}

function updateLastMove(cellId) {
	const cell = document.getElementById(cellId);
	cell.classList.add("last-move");
	if (LAST_MOVE) {
		const previousCell = document.getElementById(LAST_MOVE);
		previousCell.classList.remove("last-move");
		fixBorderCell(previousCell, previousCell.id.split("-"));
	}
	LAST_MOVE = cellId;
}

/*
Minesweeper Language:
	* cell(Row, Col, Content) // Row = {0,1,...,ROWS}, Col = {1,2,...,COLS}, Content = {0,1,...,8}, where 0 = empty;
	* That's all. You may also need some work with ?= to evaluate math expressions (use eval() carefully, though).
 */

function extractContext() { // Convert a minesweeper board to a Prudens context.
	
}
