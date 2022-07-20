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

function prudensMove() { // Infers all legible moves according to the provided policy and then choses at random (this might need to be changed).
	const inferences = msDeduce().split(";").filter(Boolean);
	const safeCells = [];
	console.log("inferences:", inferences);
	for (const literal of inferences) {
		if (literal.trim().substring(0, 5) === "safe(") {
			safeCells.push(literal.trim());
		}
	}
	if (safeCells.length === 0) {
		return randomMove();
	}
	const moveLiteral = safeCells[Math.floor(safeCells.length * Math.random())].trim();
	const coords = moveLiteral.substring(5, moveLiteral.length - 1).split(",");
	const row = coords[0].trim();
	const col = coords[1].trim();
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
	* safe(Row, Col) // Row = {0,1,...,ROWS}, Col = {1,2,...,COLS};
	* That's all. You may also need some work with ?= to evaluate math expressions (use eval() carefully, though).
	* Alternatively, you may define a neighborOf(X, Y, **args) predicate which identifies X as a neighbour of Y.
 */

function extractContext() { // Convert a minesweeper board to a Prudens context.
	let contextString = "";
	for (let row = 0; row < ROWS; row++) {
		for (let col = 0; col < COLS; col++) {
			if (!VISIBLE[row][col]) {
				contextString +=  "cell(" + row + "," + col + "," + -1 + ");";
			} else {
				contextString +=  "cell(" + row + "," + col + "," + BOARD[row][col] + ");";
			}
		}
	}
	return contextString;
}

/*
Notes in NL about Minesweeper policy:
	* The overall idea is, given a cell, to check its visible neighboring cells and any numbers on them and conclude on their
		* safety
	* For instance, given a cell that has around it ones, we can make sure that it has a mine in it and is, thus, not safe.
*/
