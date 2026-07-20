const title = document.querySelector(".board__title");
const allSquares = [...document.querySelectorAll(".board__square")];
const restartRoundButton = document.querySelector("#restart-round");
const resetScoreButton = document.querySelector("#reset-score");
const scoreX = document.querySelector("#score-x");
const scoreO = document.querySelector("#score-o");
const scoreDraw = document.querySelector("#score-draw");

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentPlayer = "X";
let gameOver = false;
let board = Array(9).fill("");
let scores = {
  X: 0,
  O: 0,
  draw: 0,
};

allSquares.forEach((square) => {
  square.addEventListener("click", () => handleSquareClick(square));
});

restartRoundButton.addEventListener("click", () => resetRound(true));
resetScoreButton.addEventListener("click", resetScoreboard);

updateTitle();
updateScoreboard();

function handleSquareClick(square) {
  const index = Number(square.dataset.index);
  if (gameOver || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  square.textContent = currentPlayer;
  square.classList.add(currentPlayer === "X" ? "is-x" : "is-o");
  square.setAttribute("aria-label", `Cell ${index + 1}, ${currentPlayer}`);

  const winningLine = getWinningLine();
  if (winningLine) {
    gameOver = true;
    scores[currentPlayer] += 1;
    markWinningLine(winningLine);
    title.textContent = `${currentPlayer} wins this round!`;
    updateScoreboard();
    return;
  }

  if (isTie()) {
    gameOver = true;
    scores.draw += 1;
    title.textContent = "It's a draw!";
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTitle();
}

function getWinningLine() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function isTie() {
  return board.every((cell) => cell !== "");
}

function markWinningLine(line) {
  line.forEach((index) => allSquares[index].classList.add("is-win"));
}

function updateTitle() {
  title.textContent = `${currentPlayer}'s Turn`;
}

function updateScoreboard() {
  scoreX.textContent = String(scores.X);
  scoreO.textContent = String(scores.O);
  scoreDraw.textContent = String(scores.draw);
}

function resetRound(resetToX) {
  board = Array(9).fill("");
  gameOver = false;
  if (resetToX) {
    currentPlayer = "X";
  }

  allSquares.forEach((square, index) => {
    square.textContent = "";
    square.classList.remove("is-x", "is-o", "is-win");
    square.setAttribute("aria-label", `Cell ${index + 1}`);
  });

  updateTitle();
}

function resetScoreboard() {
  scores = {
    X: 0,
    O: 0,
    draw: 0,
  };
  resetRound(true);
  updateScoreboard();
}