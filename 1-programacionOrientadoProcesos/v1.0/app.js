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
    const NUM_PLAYERS = 2;
    const readCoordinateArray = getReadCoordinateArray(NUM_PLAYERS);
    let turn = 0;
    let winner;
    do {
      writelnTokens(tokens);            
      placeToken(tokens, getToken(turn), TOKEN_EMPTY, readCoordinateArray[turn]);
      winner = isTicTacToe(tokens, getToken(turn));
      if (!winner) {
        turn = nextTurn(turn, NUM_PLAYERS);
      }
    } while (!winner);
    writelnTokens(tokens);
    console.writeln(`Victoria para ${getToken(turn)}`);

    function getReadCoordinateArray(max_players) {      
      let userCount;      
      const MIN_USERS = 0;
      let error;
      do {        
        userCount = console.readNumber(`Number of users? [${MIN_USERS}, ${max_players}]:`);
        error = userCount < MIN_USERS || max_players < userCount;
        if(error) {
          console.writeln(`Error: number of users must be between [${MIN_USERS}, ${max_players}]`);
        }
      } while (error);
      const readCoordinateCombinations = 
              [
                 [readRandomCoordinate, readRandomCoordinate],
                 [readUserCoordinate, readRandomCoordinate],
                 [readUserCoordinate, readUserCoordinate]
              ];
      return readCoordinateCombinations[userCount];

      function readUserCoordinate(tokens, token, coordinateType, errorMsg) {
        let coordinate = [];
        let error;                
        do {
          const boardDimension = tokens.length;
          coordinate[0] = readIndex(`Fila ${coordinateType}`, boardDimension);
          coordinate[1] = readIndex(`Columna ${coordinateType}`, boardDimension);
          error = !isOccupied(tokens, coordinate, token);
          if (error) {
            console.writeln(errorMsg);
          }
        } while (error);
        return coordinate;

        function readIndex(title, boardDimension) {
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
  
        function isOccupied(tokens, coordinate, token) {
          return tokens[coordinate[0]][coordinate[1]] === token;
        }
      }    

      

      function readRandomCoordinate(tokens, token) {      
        let coordinate = [];
        do {          
          const boardDimension = tokens.length;
          coordinate[0] = getRandomIndex(boardDimension);
          coordinate[1] = getRandomIndex(boardDimension);
        } while (!isOccupied(tokens, coordinate, token));
        return coordinate;

        function getRandomIndex(boardDimension) {
          return parseInt(Math.random()*boardDimension);
        }
      }      

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

    function getToken(turn) {
      const TOKEN_X = `X`;
      const TOKEN_Y = `Y`;
      return turn === 0 ? TOKEN_X : TOKEN_Y;
    }

    function placeToken(tokens, token, tokenEmpty, readCoordinate) {
      console.writeln(`Turno para ${token}`);      
      let originCoordinate = [];
      const maxTokensPerPlayer = tokens.length;
      const movementIsRequired = countTokens(tokens, token) ===  maxTokensPerPlayer;
      if (movementIsRequired) {        
        originCoordinate = readCoordinate(tokens, token,  
                              'origen', `No hay una ficha de la propiedad de ${token}`);        
      }            
      let targetCoordinate = readCoordinate(tokens, tokenEmpty, 
                              'destino', `Indique una celda vacía`);      
      if (movementIsRequired) {
        tokens[originCoordinate[0]][originCoordinate[1]] = tokenEmpty;
      }
      tokens[targetCoordinate[0]][targetCoordinate[1]] = token;

      function countTokens(tokens, token) {
        let count = 0;
        for (let i = 0; i < tokens.length; i++) {
          for (let j = 0; j < tokens[i].length; j++) {
            if (tokens[i][j] === token) {
              count++;
            }
          }
        }
        return count;
      }

    }

    function isTicTacToe(tokens, token) {
      const winnerCount = tokens.length;
      let countInRows = [0, 0, 0];
      let countInColumns = [0, 0, 0];
      let countInDiagonal = 0;
      let countInInverse = 0;
      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[i].length; j++) {
          if (tokens[i][j] === token) {
            countInRows[i]++;
            countInColumns[j]++;
            if (i - j === 0) {
              countInDiagonal++;
            }
            if (i + j === winnerCount - 1) {
              countInInverse++;
            }
          }
        }
      }
      if (countInDiagonal === winnerCount || countInInverse === winnerCount) {
        return true;
      }
      for (let i = 0; i < countInRows.length; i++) {
        if (countInRows[i] === winnerCount) {
          return true;
        }
        if (countInColumns[i] === winnerCount) {
          return true;
        }
      }
      return false;
    }

    function nextTurn(turn, numPlayers) {
      return (turn + 1) % numPlayers;
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
