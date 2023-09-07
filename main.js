const left = document.querySelector(".left");
const game = document.querySelector(".game");
const right = document.querySelector(".right");
const buttOn = document.getElementById("on");
const buttOff = document.getElementById("off");

game.innerHTML = "";

//Declaracion de variables

let currentPiece, nextPiece, currentPieceNumber;
let positionPiece = [0, 4];
let currentSetOfPieces;

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
  const color = ["white", "red", "green", "blue", "yellow"];
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

const selectPiece = () => {
  //seleccionar un numero al azar
  currentPieceNumber = Math.floor(Math.random() * pieces.length);
  //selecciona un color
  const pieceColor = Math.floor(Math.random() * 4) + 1;
  console.log("pieceColor: ", pieceColor);
  //console.log(currentPieceNumber, pieceColor);
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
  //console.log(currentSetOfPieces);
};

const checkCollisionDown = () => {
  let collision = false;
  console.log("Chequeo colision abajo. INICIO", currentPiece[0].length);
  for (let col = 0; col < currentPiece[0].length; col++) {
    let pos = 1;
    console.log("currentPiece.length - 1", currentPiece.length - 1);
    const pieceHeight = currentPiece.length;
    while (currentPiece[pieceHeight - pos][col] == 0) {
      pos++;
    }
    console.log(`en columna ${col} la posicion mas baja es ${pos}`);
    if (positionPiece[0] + currentPiece.length > 19) {
      collision = true;
    } else if (
      arrayBoard[positionPiece[0] + currentPiece.length - pos + 1][
        positionPiece[1] + col
      ] != 0
    ) {
      collision = true;
    }
  }
  // ||  positionPiece[0] + currentPiece.length > 19
  return collision;
};

// Para detener el intervalo cuando sea necesario:

const placeForPiece = () => {
  let isOk = true;
  for (let row = 0; row < currentPiece.length; row++) {
    for (let col = 0; col < currentPiece[0].length; col++) {
      console.log("row: ", row, " col: ", col);

      const realRow = row + positionPiece[0];
      const realCol = col + positionPiece[1];
      console.log("realRow: ", realRow, " realCol: ", realCol);
      if (currentPiece[row][col] != 0 && arrayBoard[realRow][realCol] != 0) {
        isOk = false;
        console.log(
          "error",
          currentPiece[row][col],
          arrayBoard[realCol][realRow]
        );
      }
    }
  }
  return isOk;
};

const putPiece = () => {
  //console.log(arrayBoard);
  for (let col = 0; col < currentPiece[0].length; col++) {
    for (let row = 0; row < currentPiece.length; row++) {
      const realRow = row + positionPiece[0];
      const realCol = col + positionPiece[1];
      if (currentPiece[row][col] != 0) {
        arrayBoard[realRow][realCol] = currentPiece[row][col];
      }
    }
  }
  //console.log(arrayBoard);
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

  if (placeForPiece()) {
    putPiece(); //inicializar variables
    printBoard();
    //ubicar pieza
  } else {
    console.log("Game over");
  }
  //los chequeos de choque deben hacerse de != 0 contra != 0, porque pueden haber numeros diferentes segun color.
  //cuando vaya a moverse hacia abajo debe controlar que sus numeros inferiores distintos de cero tengan espacio abajo, donde van a moverse. Ahi deben haber ceros. OJO
};

const checkCollisionLeft = () => {
  res = true;
  if (positionPiece[1] > 0) {
    //ahora chequeo colision a la izq
    //recorro la pieza con un for desde su primer row hasta el ultimo
    for (let row = 0; row < currentPiece.length; row++) {
      //en cada row busco el nocero mas a la izq y veo si tiene lugar libre a su izq
      let pos = 0;
      while (currentPiece[row][pos] == 0) {
        pos++;
      }
      if (arrayBoard[positionPiece[0] + row][positionPiece[1] - 1 + pos] != 0) {
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

const checkCollisionRight = () => {
  res = true;
  if (positionPiece[1] + currentPiece[0].length < 10) {
    //ahora chequeo colision a la der
    //recorro la pieza con un for desde su primer row hasta el ultimo
    for (let row = 0; row < currentPiece.length; row++) {
      //en cada row busco el nocero mas a la der y veo si tiene lugar libre a su der
      let pos = currentPiece[0].length;
      while (currentPiece[row][pos] == 0) {
        pos--;
      }
      if (arrayBoard[positionPiece[0] + row][positionPiece[1] + pos] != 0) {
        res = false;
        console.log(
          "choca con nocero. positionPiece[0]+row:",
          positionPiece[0] + row
        );
        console.log("positionPiece[1] + 1 + pos:", positionPiece[1] + 1 + pos);
      }
    }
  } else {
    res = false;
    console.log("choca con limite der");
  }
  return res;
};

const moveLeft = () => {
  if (checkCollisionLeft()) {
    erasePiece();
    positionPiece[1] -= 1;
    putPiece();
    printBoard();
  }
};

const moveRight = () => {
  if (checkCollisionRight()) {
    erasePiece();
    positionPiece[1] += 1;
    putPiece();
    printBoard();
  }
};

const rotatePiece = () => {};

const detectKey = (e) => {
  switch (e.key) {
    case "a":
      moveLeft();
      break;
    case "d":
      moveRight();
      break;
    case "w":
      rotatePiece();
      break;
  }
};

const gameOn = () => {
  newPiece();

  document.addEventListener("keydown", detectKey);

  const gameRun = setInterval(() => {
    //chequear colision abajo: SI => gameover
    //si abajo de un no-cero hay un no-cero then gameover
    if (checkCollisionDown()) {
      positionPiece = [0, 4];
      newPiece();
    } else {
      // borrar pieza de su posicion y:
      erasePiece();
      positionPiece[0] += 1;
      putPiece();
      printBoard();
      console.log("New position: ", positionPiece[0]);
      console.log(arrayBoard);
    }
    //imprimir en nueva posicion
    function gameOff() {
      clearInterval(gameRun);
      //init();
    }
    buttOff.addEventListener("click", gameOff);
  }, 1000);
};

const init = () => {
  positionPiece = [0, 4];
  clearBoard();
  //arrayBoard[10][5] = 3;
  printBoard();

  //console.log(arrayBoard);
  buttOn.addEventListener("click", gameOn);
};

init();
/*
falta girar pieza
acelerar caida
imprimir bien game over
asignar puntajes
highscores
*/
