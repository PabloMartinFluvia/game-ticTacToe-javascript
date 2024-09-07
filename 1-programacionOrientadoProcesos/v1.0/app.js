const { Console } = require("./console");

const console = new Console();
playTicTacToe();


function playTicTacToe() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const TOKEN_EMPTY = ` `;
    let tokens = [
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY]
    ];
    let turn = 0;
    let winner;
    do {
      writelnTokens(tokens);
      const MAX_PLAYERS = 2;
      const BOARD_DIMENSION = 3;
      placeToken(tokens, turn, MAX_PLAYERS, BOARD_DIMENSION, TOKEN_EMPTY);
      winner = isTicTacToe(tokens, turn, BOARD_DIMENSION);
      if (!winner) {
        turn = nextTurn(turn, MAX_PLAYERS);
      }
    } while (!winner);
    writelnTokens(tokens);
    console.writeln(`Victoria para ${getToken(turn)}`);

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

    function placeToken(tokens, turn, maxPlayers, boardDimension, tokenEmpty) {
      console.writeln(`Turno para ${getToken(turn)}`);
      let error;
      let originRow;
      let originColumn;
      const maxTokensPerPlayer = boardDimension;
      const movement = countTokens(tokens, tokenEmpty) === maxPlayers * maxTokensPerPlayer;
      if (movement) {
        do {
          originRow = read(`Fila origen`, boardDimension);
          originColumn = read(`Columna origen`, boardDimension);
          error = !isOccupied(tokens, originRow, originColumn, turn);
          if (error) {
            console.writeln(`No hay una ficha de la propiedad de ${getToken(turn)}`);
          }
        } while (error);
      }
      let targetRow;
      let targetColumn;
      do {
        targetRow = read(`Fila destino`, boardDimension);
        targetColumn = read(`Columna destino`, boardDimension);
        error = !isEmpty(tokens, targetRow, targetColumn, tokenEmpty);
        if (error) {
          console.writeln(`Indique una celda vacía`);
        }
      } while (error);
      if (movement) {
        tokens[originRow][originColumn] = tokenEmpty;
      }
      tokens[targetRow][targetColumn] = getToken(turn);

      function countTokens(tokens, tokenEmpty) {
        let placed = 0;
        for (let i = 0; i < tokens.length; i++) {
          for (let j = 0; j < tokens[i].length; j++) {
            if (tokens[i][j] !== tokenEmpty) {
              placed++;
            }
          }
        }
        return placed;
      }

      function read(title, boardDimension) {
        let position;
        let error;
        do {
          position = console.readNumber(`${title}: `);
          error = position < 1 || 3 < position;
          if (error) {
            console.writeln(`Por favor un numero entre 1 y ${boardDimension} inclusives`)
          }
        } while (error);
        return position - 1;
      }

      function isOccupied(tokens, row, column, turn) {
        return tokens[row][column] === getToken(turn);
      }

      function isEmpty(tokens, row, column, tokenEmpty) {
        return tokens[row][column] === tokenEmpty;
      }
    }
    
    function getToken(turn) {
      const TOKEN_X = `X`;
      const TOKEN_Y = `Y`;
      return turn === 0 ? TOKEN_X : TOKEN_Y;
    }

    function isTicTacToe(tokens, turn, maxTokens) {
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
            if (i + j === maxTokens - 1) {
              countInverse++;
            }
          }
        }
      }
      if (countDiagonal === maxTokens || countInverse === maxTokens) {
        return true;
      }
      for (let i = 0; i < countRows.length; i++) {
        if (countRows[i] === maxTokens) {
          return true;
        }
        if (countColumns[i] === maxTokens) {
          return true;
        }
      }
      return false;
    }

    function nextTurn(turn, maxPlayers) {
      return (turn + 1) % maxPlayers;
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
