function Gameboard() {
    
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player ) => {

        if (row < 0 || row >= rows || column < 0 || column >= columns) {
            console.error(`Position (${row}, ${column}) is out of bounds.`);
            return;
        }
    
        const cell = board[row][column];
    
        if (cell.getValue() !== 0) {
            console.error(`Cell at position (${row}, ${column}) is already occupied.`);
            return;
        }
    
        cell.addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    const cleanBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].addToken(0);
            }
        }
    }

    return { getBoard, placeToken, printBoard, cleanBoard }; 

}

function Cell() {

    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };

}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1,
            score: 0
        },
        {
            name: playerTwoName,
            token: 2,
            score: 0
        }
    ];

    const getPlayers = () => players;

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const changePlayersName = function ( new_playerOneName, new_playerTwoName ) {

        players.forEach(() => {
            players[0].name = new_playerOneName;
            players[1].name = new_playerTwoName;
        })
    };

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column ) => {

        console.log(
          `Placing ${getActivePlayer().name}'s token at position (${row}, ${column})`
        );

        board.placeToken(row, column, getActivePlayer().token);

         for (var i in board.getBoard) {
            for (var j in board.getBoard[i]) {
                console.log(board.getBoard[i][j].getValue());
            }
         }
    
        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
         if (check_win() || check_draw()) {
            console.log("Game over!"); // So //
            board.cleanBoard();
        } else {
            printNewRound();
            switchPlayerTurn();
        }
    };

    let boardd = board.getBoard();

    const check_win = () => {
            
        const winning_combinations = [
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]
        ];

        for(let condition of winning_combinations) {
            const [a, b, c] = condition;
            const [rowA, colA] = a;
            const [rowB, colB] = b;
            const [rowC, colC] = c;

            if (
                boardd[rowA][colA].getValue() !== 0 &&
                boardd[rowA][colA].getValue() === boardd[rowB][colB].getValue() &&
                boardd[rowA][colA].getValue() === boardd[rowC][colC].getValue()
            ) {
                getActivePlayer().score++;
                console.log(`${getActivePlayer().name} wins!`);
                return true;
            }
        }

        return false;
     };

    const check_draw = () => {
        const flat_board = boardd.flat();

        if(flat_board.every(cell => cell.getValue() !== 0)) {
            console.log("It's a draw!");
            return true;
        }
    };

    printNewRound();

    return {
        getPlayers,
        playRound,
        getActivePlayer,
        changePlayersName,
         getBoard: board.getBoard
    };

}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const player_one = document.getElementById('first-player');
    const player_two = document.getElementById('second-player');

    const updateScreen = () => {

        boardDiv.textContent = "";
  
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        const displayPlayersInfo = () => {

        const players = game.getPlayers();
            if (players.length >= 1) {
            player_one.textContent = players[0].name +': '+ players[0].score; 
            }
            if (players.length >= 2) {
            player_two.textContent = players[1].name +': '+ players[1].score;
         }
        };

        displayPlayersInfo();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
    
        // Render board squares
        board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {

            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");

            cellButton.dataset.row = rowIndex;
            cellButton.dataset.column = colIndex;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
          })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        // Asegúrate de haber hecho clic en una columna y no en los espacios entre ellas
        if (selectedRow === undefined || selectedColumn === undefined) return;

        const rowIndex = parseInt(selectedRow, 10);
        const columnIndex = parseInt(selectedColumn, 10);
        if (isNaN(rowIndex) || isNaN(columnIndex)) return;

        game.playRound(rowIndex, columnIndex);
        updateScreen();
      }

      boardDiv.addEventListener("click", clickHandlerBoard);
      // Initial render
      updateScreen();
}

ScreenController();


