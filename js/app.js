var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;
var gBallsCollected = 0;
var gTotalBalls = 2;
var addBallInterval;
function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);

	// Call addBall every 5 seconds 
	addBallInterval = setInterval(addBall, 5000);
}


function buildBoard() {
	// Create the Matrix
	// var board = createMat(10, 12)
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To ES6 template string
			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');

			// Update ball count and display
			gBallsCollected++;
			updateBallsCollectedDisplay();

			// Check if the player won after collecting a ball
			checkVictory();
		}



		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

function updateBallsCollectedDisplay() {
	// Update the HTML with the current number of balls collected
	var elBallsCollected = document.querySelector('#balls-collected');
	elBallsCollected.innerText = gBallsCollected;
}

function checkVictory() {
	// If the player has collected all the balls
	if (gBallsCollected === gTotalBalls) {
		alert('Congratulations! You have collected all the balls!');

		// Stop adding new balls
		clearInterval(addBallInterval);
		gBallsCollected = 0;
		gTotalBalls = 2;
	}
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	console.log('cellClass:', cellClass);
	return cellClass;
}

function addBall() {
	// Find an empty cell (FLOOR without any game element)
	var emptyCells = [];
	for (var i = 1; i < gBoard.length - 1; i++) {
		for (var j = 1; j < gBoard[0].length - 1; j++) {
			if (gBoard[i][j].type === FLOOR && gBoard[i][j].gameElement === null) {
				emptyCells.push({ i: i, j: j });
			}
		}
	}

	// If there are no empty cells, do nothing
	if (emptyCells.length === 0) return;

	// Pick a random empty cell
	var randomIdx = Math.floor(Math.random() * emptyCells.length);
	var randomCell = emptyCells[randomIdx];

	// Place the ball in the random empty cell
	gBoard[randomCell.i][randomCell.j].gameElement = BALL;
	gTotalBalls++; // Update total ball count
	// Render the updated cell
	renderCell(randomCell, BALL_IMG);
}

function restartGame() {
	clearInterval(addBallInterval);
	initGame();
}

