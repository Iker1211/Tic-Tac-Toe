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

    const dropToken = (column, player, index ) => {

        if (index < 0 || index >= board.length) {
            console.error(`Index ${index} is out of bounds.`);
            return;
        }
    
        const cell = board[index][column];
    
        if (cell.getValue() !== 0) {
            console.error(`Cell at index ${index}, column ${column} is already occupied.`);
            return;
        }
    
        cell.addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, dropToken, printBoard }; // DropToken //

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
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

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

    const playRound = (column,  index ) => {

        console.log(
          `Dropping ${getActivePlayer().name}'s token into column ${column}...`
        );

        board.dropToken(column, getActivePlayer().token, index);

         for (var i in board.getBoard) {
            for (var j in board.getBoard[i]) {
                console.log(board.getBoard[i][j].getValue());
            }
         }
    
        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
         check_win();
         check_draw();
        switchPlayerTurn();
        printNewRound();
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
        playRound,
        getActivePlayer,
        changePlayersName,
        // getBoard: board.getBoard
    };

}

const game = GameController();
