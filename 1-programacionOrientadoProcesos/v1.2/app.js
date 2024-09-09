const { Console } = require("./console");

const console = new Console();
playTicTacToe();


function playTicTacToe() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const MAX_PLAYERS = 2;
    const MAX_TOKENS = 3;
    const TOKEN_EMPTY = ` `;
    let tokens = [
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY]
    ];
    const readFunctionsModes = askGameMode();
    let turn = 0;
    let winner;
    do {
      writelnTokens(tokens);
      placeToken(tokens, turn, readFunctionsModes[turn]);
      winner = isTicTacToe(tokens, turn);
      if (!winner) {
        turn = nextTurn(turn);
      }
    } while (!winner);
    writelnTokens(tokens);
    console.writeln(`Victoria para ${getToken(turn)}`);

    function askGameMode() {
      let userCount;
      let error;
      const MIN_USERS = 0;
      do {
        userCount = console.readNumber(`Number of users? [${MIN_USERS}, ${MAX_PLAYERS}]:`);
        error = userCount < MIN_USERS || MAX_PLAYERS < userCount;
        if (error) {
          console.writeln(`Error: number of users must be between [${MIN_USERS}, ${MAX_PLAYERS}]`);
        }
      } while (error);

      const machineReadOrigin = machineReadGenerator(isOccupied);
      const machineReadTarget = machineReadGenerator(isEmpty);
      const machineReadFunctions = [machineReadOrigin, machineReadTarget];
      
      const userReadOrigin = userReadGenerator(isOccupied, 'origen', writelnOriginErrorMsg);
      const userReadTarget = userReadGenerator(isEmpty, 'destino', writelnTargetErrorMsg);
      const userReadFunctions = [userReadOrigin, userReadTarget];

      return [
        [machineReadFunctions, machineReadFunctions],
        [userReadFunctions, machineReadFunctions],
        [userReadFunctions, userReadFunctions]
      ][userCount];

      function userReadGenerator(isValid, sufixMsg, writelnErrorMsg) {
        return function (tokens, turn) {
          let row;
          let column;
          let error;
          do {
            row = userRead(`Fila ${sufixMsg}`);
            column = userRead(`Columna ${sufixMsg}`);
            error = !isValid(tokens, row, column, turn);
            if (error) {
              writelnErrorMsg(turn);
            }
          } while (error);
          return [row, column];
        }
      }      

      function userRead(title) {
        let position;
        let error;
        do {
          position = console.readNumber(`${title}: `);
          error = position < 1 || 3 < position;
          if (error) {
            console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
          }
        } while (error);
        return position - 1;
      }

      function writelnOriginErrorMsg(turn){
        console.writeln(`No hay una ficha de la propiedad de ${getToken(turn)}`);
      }

      function writelnTargetErrorMsg(){
        console.writeln(`Indique una celda vacía`);
      }

      function machineReadGenerator(isValid) {
        return function (tokens, turn) {
          let row;
          let column;
          let error;
          do {
            row = machineRead();
            column = machineRead();
            error = !isValid(tokens, row, column, turn);
          } while (error);
          return [row, column];
        }
      }

      function machineRead() {
        return parseInt(Math.random() * MAX_TOKENS);
      }

    }

    function placeToken(tokens, turn, readFunctions) {
      console.writeln(`Turno para ${getToken(turn)}`);
      let originRow;
      let originColumn;
      const movement = getNumTokens(tokens) === MAX_PLAYERS * MAX_TOKENS;
      if (movement) {
        const readOrigin = readFunctions[0];
        const originCoordinate = readOrigin(tokens, turn);
        originRow = originCoordinate[0];
        originColumn = originCoordinate[1];
      }
      const readTarget = readFunctions[1];
      const targetCoordinate = readTarget(tokens);
      const targetRow = targetCoordinate[0];
      const targetColumn = targetCoordinate[1];
      if (movement) {
        tokens[originRow][originColumn] = TOKEN_EMPTY;
      }
      tokens[targetRow][targetColumn] = getToken(turn);
    }

    function getNumTokens(tokens) {
      let empties = 0;
      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[i].length; j++) {
          if (tokens[i][j] === TOKEN_EMPTY) {
            empties++;
          }
        }
      }
      return MAX_TOKENS ** 2 - empties;
    }

    function isEmpty(tokens, row, column) {
      return tokens[row][column] === TOKEN_EMPTY;
    }

    function getToken(turn) {
      const TOKEN_X = `X`;
      const TOKEN_Y = `Y`;
      return turn === 0 ? TOKEN_X : TOKEN_Y;
    }

    function writelnTokens(tokens) {
      const HORIZONTAL_SEPARTOR = `-------------`;
      const VERTICAL_SEPARATOR = `|`;
      let msg = ``;
      for (let i = 0; i < tokens.length; i++) {
        msg += `${HORIZONTAL_SEPARTOR}\n`;
        for (let j = 0; j < tokens[i].length; j++) {
          msg += `${VERTICAL_SEPARATOR} ${tokens[i][j]} `;
        }
        msg += `${VERTICAL_SEPARATOR}\n`;
      }
      msg += HORIZONTAL_SEPARTOR;
      console.writeln(msg);
    }

    function nextTurn(turn) {
      return (turn + 1) % MAX_PLAYERS;
    }

    function isOccupied(tokens, row, column, turn) {
      return tokens[row][column] === getToken(turn);
    }

    function isTicTacToe(tokens, turn) {
      let countRows = [0, 0, 0];
      let countColumns = [0, 0, 0];
      let countDiagonal = 0;
      let countInverse = 0;
      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[i].length; j++) {
          if (tokens[i][j] === getToken(turn)) {
            countRows[i]++;
            countColumns[j]++;
            if (i - j === 0) {
              countDiagonal++;
            }
            if (i + j === MAX_TOKENS - 1) {
              countInverse++;
            }
          }
        }
      }
      if (countDiagonal === MAX_TOKENS || countInverse === MAX_TOKENS) {
        return true;
      }
      for (let i = 0; i < countRows.length; i++) {
        if (countRows[i] === MAX_TOKENS) {
          return true;
        }
        if (countColumns[i] === MAX_TOKENS) {
          return true;
        }
      }
      return false;
    }

  }

  function isResumed() {
    let result;
    let answer;
    let error = false;
    do {
      answer = console.readString(`¿Quieres jugar otra partida? `);
      result = answer === `si`;
      error = !result && answer !== `no`;
      if (error) {
        console.writeln(`Por favor, responda "si" o "no"`);
      }
    } while (error);
    return result;
  }

}
