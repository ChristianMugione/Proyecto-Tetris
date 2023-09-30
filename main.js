const left = document.querySelector(".left");
const game = document.querySelector(".game");
const right = document.querySelector(".right");
const buttOn = document.getElementById("on");
const buttPause = document.getElementById("pause");
const buttOff = document.getElementById("off");
const nextPieceImg = document.getElementById("next-piece-img");
const showScore = document.getElementById("score");
const showLast = document.getElementById("last-score");
const showHigh = document.getElementById("high-score");
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");
const btnDown = document.getElementById("down");
const btnRotate = document.getElementById("rotate");
const mainMsg = document.querySelector(".main-msg");

//Declaracion de variables

let currentPiece, nextPiece, nextPieceNumber, currentPieceNumber;
let positionPiece = [0, 4];
let currentSetOfPieces;
let angleOfCurrentPiece;
let gameRun;
let lastColor = 0;
let gamePaused;
let score, highscore;

let arrayBoard = [];

for (let i = 0; i < 20; i++) {
  arrayBoard[i] = [];
}

const clearBoard = () => {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      arrayBoard[i][j] = 0;
    }
  }
};

const printPixel = (num) => {
  const color = [
    "white",
    "red",
    "green",
    "lightgreen",
    "blue",
    "lightblue",
    "yellow",
    "violet",
    "blueviolet",
    "orange",
    "orangered",
  ];
  const res = `<div class='pix ${color[num]}'"></div>`;
  return res;
};

const printBoard = () => {
  let res = "";
  for (let i = 0; i < 20; i++) {
    res += "<div class='flex-row'>";
    for (let j = 0; j < 10; j++) {
      res += printPixel(arrayBoard[i][j]);
    }
    res += "</div>";
  }
  game.innerHTML = res;
};

const printNextPiece = () => {
  let nextPieceHTML = "";
  for (let col = 0; col < pieces[nextPieceNumber][0][0].length; col++) {
    nextPieceHTML += "<div class='row'>";
    console.log("col: ", col);
    for (let row = 0; row < pieces[nextPieceNumber][0].length; row++) {
      console.log(pieces[nextPieceNumber][0][row][col]);
      if (pieces[nextPieceNumber][0][row][col] != 0) {
        nextPieceHTML += "<div class='pix-next red'></div>";
      } else {
        nextPieceHTML += "<div class='pix-next invisible'></div>";
      }
      //arrayBoard[realRow][realCol] = currentPiece[row][col];
    }
    nextPieceHTML += "</div>";
  }
  nextPieceImg.innerHTML = nextPieceHTML;
};

const printScore = () => {
  showScore.innerHTML = "";
  showScore.innerHTML = score;
};

const printLastScore = () => {
  const lastScore = localStorage.getItem("last-score");
  showLast.innerHTML = lastScore;
};

const printHighScore = () => {
  const highScore = localStorage.getItem("high-score");
  showHigh.innerHTML = highScore;
};

const selectPiece = () => {
  if (nextPieceNumber < 0) {
    nextPieceNumber = Math.floor(Math.random() * pieces.length);
  }
  currentPieceNumber = nextPieceNumber;

  nextPieceNumber = Math.floor(Math.random() * pieces.length);

  //selecciona un color
  let pieceColor;
  do {
    console.log("elijo color");
    pieceColor = Math.floor(Math.random() * 10) + 1;
  } while (pieceColor == lastColor);
  lastColor = pieceColor;

  currentSetOfPieces = [];
  currentSetOfPieces = [...pieces[currentPieceNumber]];
  for (
    let eachPiecePosition = 0;
    eachPiecePosition < currentSetOfPieces.length;
    eachPiecePosition++
  ) {
    for (
      let eachPartOfPiece = 0;
      eachPartOfPiece < currentSetOfPieces[eachPiecePosition].length;
      eachPartOfPiece++
    ) {
      for (
        let eachPixel = 0;
        eachPixel <
        currentSetOfPieces[eachPiecePosition][eachPartOfPiece].length;
        eachPixel++
      ) {
        if (
          currentSetOfPieces[eachPiecePosition][eachPartOfPiece][eachPixel] != 0
        ) {
          currentSetOfPieces[eachPiecePosition][eachPartOfPiece][eachPixel] =
            pieceColor;
        }
      }
    }
  }
  currentPiece = currentSetOfPieces[0];
  angleOfCurrentPiece = 0;
};

const checkCollisionDown = (currPiece, posPiece) => {
  let collision = false;

  for (let col = 0; col < currPiece[0].length; col++) {
    let pos = 1;

    const pieceHeight = currPiece.length;
    while (currPiece[pieceHeight - pos][col] == 0) {
      pos++;
    }

    if (posPiece[0] + currPiece.length > 19) {
      collision = true;
    } else if (
      arrayBoard[posPiece[0] + currPiece.length - pos + 1][posPiece[1] + col] !=
      0
    ) {
      collision = true;
    }
  }
  // ||  positionPiece[0] + currentPiece.length > 19
  return collision;
};

const placeForPiece = () => {
  let isOk = true;
  for (let row = 0; row < currentPiece.length; row++) {
    for (let col = 0; col < currentPiece[0].length; col++) {
      const realRow = row + positionPiece[0];
      const realCol = col + positionPiece[1];

      if (currentPiece[row][col] != 0 && arrayBoard[realRow][realCol] != 0) {
        isOk = false;
      }
    }
  }
  return isOk;
};

const putPiece = () => {
  for (let col = 0; col < currentPiece[0].length; col++) {
    for (let row = 0; row < currentPiece.length; row++) {
      const realRow = row + positionPiece[0];
      const realCol = col + positionPiece[1];
      if (currentPiece[row][col] != 0) {
        arrayBoard[realRow][realCol] = currentPiece[row][col];
      }
    }
  }
};

const erasePiece = () => {
  for (let col = 0; col < currentPiece[0].length; col++) {
    for (let row = 0; row < currentPiece.length; row++) {
      const realRow = row + positionPiece[0];
      const realCol = col + positionPiece[1];
      if (currentPiece[row][col] != 0) {
        arrayBoard[realRow][realCol] = 0;
      }
    }
  }
};

const newPiece = () => {
  selectPiece();
  printNextPiece();
  if (currentPieceNumber === 2) {
    positionPiece = [1, 3];
  }
  if (placeForPiece()) {
    putPiece();
    printBoard();
    printNextPiece();
  } else {
    //printMsg("Game over");
    gameOff();
    alert("Game over");
  }
};

const checkCollisionLeft = (currPiece, posPiece) => {
  res = true;
  if (posPiece[1] > 0) {
    //ahora chequeo colision a la izq
    //recorro la pieza con un for desde su primer row hasta el ultimo
    for (let row = 0; row < currPiece.length; row++) {
      //en cada row busco el nocero mas a la izq y veo si tiene lugar libre a su izq
      let pos = 0;
      while (currPiece[row][pos] == 0) {
        pos++;
      }
      if (arrayBoard[posPiece[0] + row][posPiece[1] - 1 + pos] != 0) {
        res = false;
      }
    }
    //si no hay ningun lugar no se mueve
    //si hay lugar borra pieza (convierto los noceros en ceros)
    //se a positi
  } else {
    res = false;
  }
  return res;
};

const checkCollisionRight = (currPiece, posPiece) => {
  res = true;
  if (posPiece[1] + currPiece[0].length < 10) {
    //ahora chequeo colision a la der
    //recorro la pieza con un for desde su primer row hasta el ultimo
    for (let row = 0; row < currPiece.length; row++) {
      //en cada row busco el nocero mas a la der y veo si tiene lugar libre a su der
      let pos = currPiece[0].length; // hacia la derecha calcula mal algo -----------------------
      while (currPiece[row][pos - 1] == 0) {
        pos--;
      }
      if (arrayBoard[posPiece[0] + row][posPiece[1] + pos] != 0) {
        res = false;
        console.log(
          "choca con nocero. positionPiece[0]+row:",
          posPiece[0] + row
        );
        let temp = posPiece[1] + pos;
        console.log("posPiece[1] + pos:", temp, "pos ", pos);
      }
    }
  } else {
    res = false;
    console.log("choca con limite der");
  }
  return res;
};

const moveLeft = () => {
  if (checkCollisionLeft(currentPiece, positionPiece)) {
    erasePiece();
    positionPiece[1] -= 1;
    putPiece();
    printBoard();
  }
};

const moveRight = () => {
  if (checkCollisionRight(currentPiece, positionPiece)) {
    erasePiece();
    positionPiece[1] += 1;
    putPiece();
    printBoard();
  }
};

const moveDown = () => {
  if (!checkCollisionDown(currentPiece, positionPiece)) {
    erasePiece();
    positionPiece[0] += 1;
    putPiece();
    printBoard();
  }
};

const getNextAngle = () => {
  console.log("angleOfCurrentPiece", angleOfCurrentPiece);
  let res = angleOfCurrentPiece + 1;
  console.log(
    "res:",
    res,
    " currentSetOfPieces.length:",
    currentSetOfPieces.length
  );
  if (res > currentSetOfPieces.length - 1) {
    res = 0;
  }
  return res;
};

const checkCollisionRotate = () => {
  const nextAngle = getNextAngle();
  const nextPiece = currentSetOfPieces[nextAngle];

  console.log("---", currentSetOfPieces);

  let collision = false;
  // Chequea colisión con margen derecho
  if (positionPiece[1] + nextPiece[0].length - 1 > 9) {
    collision = true;
  }

  //recorro pieza,
  for (let row = 0; row < nextPiece.length; row++) {
    for (let col = 0; col < nextPiece[0].length; col++) {
      //si el pixel de la pieza es nocero...
      if (nextPiece[row][col] != 0) {
        //chequeo que este pixel en el board es cero
        let boardRow = positionPiece[0] + row;
        let boardCol = positionPiece[1] + col;
        if (arrayBoard[boardRow][boardCol] != 0) {
          collision = true;
        }
      }
    }
  }
  if (!collision) {
    currentPiece = [...nextPiece];
    angleOfCurrentPiece = nextAngle;
  }
};

const rotatePiece = () => {
  erasePiece();
  checkCollisionRotate();
  putPiece();
  printBoard();
};

const detectKey = (e) => {
  console.log(e.key);
  switch (e.key) {
    case "a":
    case "A":
    case "ArrowLeft":
      moveLeft();
      break;
    case "d":
    case "D":
    case "ArrowRight":
      moveRight();
      break;
    case "w":
    case "W":
    case "ArrowUp":
      rotatePiece();
      break;
    case "s":
    case "S":
    case "ArrowDown":
      moveDown();
      break;
    case "Escape":
      gamePause();
      break;
  }
};

const deleteRow = (rowToDel) => {
  for (let row = rowToDel; row > 0; row--) {
    for (let col = 0; col < 10; col++) {
      arrayBoard[row][col] = arrayBoard[row - 1][col];
    }
  }
  printBoard();
};

const checkCompletedLines = () => {
  let completedLines = 0;
  for (let row = 19; row >= 0; row--) {
    if (!arrayBoard[row].some((num) => num == 0)) {
      deleteRow(row);
      row++;
      completedLines++;
    }
  }
  switch (completedLines) {
    case 1:
      score += 100;
      break;
    case 2:
      score += 300;
      break;
    case 3:
      score += 700;
      break;
    case 4:
      score += 1200;
      break;
  }
};

const gameUpdate = () => {
  if (checkCollisionDown(currentPiece, positionPiece)) {
    checkCompletedLines();
    printScore();
    positionPiece = [0, 4];
    newPiece();
  } else {
    erasePiece();
    positionPiece[0] += 1;
    putPiece();
    printBoard();
  }
};

const gameOn = () => {
  printMsg("");
  buttOn.style.display = "none";
  buttOff.style.display = "block";
  buttOn.removeEventListener("click", gameOn);
  //buttPause.addEventListener("click", gamePause);
  buttOff.addEventListener("click", gameOff);
  gamePaused = false;
  newPiece();

  document.addEventListener("keydown", detectKey);

  gameRun = setInterval(gameUpdate, 1000);
};

function gameOff() {
  const highScore = localStorage.getItem("high-score");
  nextPieceImg.innerHTML = "";
  console.log("gameOff");
  if (score > highScore) {
    localStorage.setItem("high-score", score);
    printHighScore();
  }
  localStorage.setItem("last-score", score);
  clearInterval(gameRun);
  init();
}

function gamePause() {
  /*
  if (gamePaused) {
    setInterval(gameRun);
    gamePaused = false;
    // buttOn.addEventListener("click", gameOn);
  } else {
    clearInterval(gameRun);
    gamePaused = true;
    // buttOn.removeEventListener("click", gameOn);
  }
  */
}

const printMsg = (msg) => {
  mainMsg.innerHTML = msg;
};

const init = () => {
  buttOn.style.display = "block";
  buttOff.style.display = "none";
  gamePaused = false;
  nextPieceNumber = -1;
  positionPiece = [0, 4];
  score = 0;
  printScore();
  printLastScore();
  printHighScore();
  clearBoard();
  //arrayBoard[10][5] = 3;
  printBoard();

  //console.log(arrayBoard);
  buttOn.addEventListener("click", gameOn);
  btnLeft.addEventListener("click", moveLeft);
  btnRight.addEventListener("click", moveRight);
  btnDown.addEventListener("click", moveDown);
  btnRotate.addEventListener("click", rotatePiece);
  printMsg("Click Play");
};

init();
