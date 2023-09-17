document.addEventListener('DOMContentLoaded', () => { // Load html before js
    
    const cells = document.querySelectorAll(".cell");
    const statusText = document.querySelector("#statusText")
    const restartButton = document.querySelector("#restartButton");
    const changeModeButton = document.querySelector("#changeModeButton");
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let options = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X"
    let gameOver = false;
    let actualMode = 1;

    init();
    
    function init() {
        cells.forEach(cell => cell.addEventListener("click", clickCell))
        restartButton.addEventListener("click", restartGame);
        changeModeButton.addEventListener("click", changeMode);
        statusText.textContent = `${currentPlayer}'s turn`;
    }

    function clickCell() {
        const cellIndex = this.getAttribute("cellIndex");
        if (options[cellIndex] != "" || gameOver) {
            return;
        }

        updateCell(this, cellIndex);
        checkWinner();
        
        if (actualMode == 2) {
            cells.forEach(cell => cell.removeEventListener("click", clickCell));
            var cellAI = minimax(options, "O").index;
            setTimeout(() => {
                updateCell(cells[cellAI], cellAI);
                checkWinner();
                cells.forEach(cell => cell.addEventListener("click", clickCell));
            }, 1000);
        }
    }

    function updateCell(cell, index) {
        options[index] = currentPlayer;
        cell.textContent = currentPlayer;
    }

    function changePlayer() {
        currentPlayer = (currentPlayer == "X") ? "O" : "X";
        statusText.textContent = `${currentPlayer}'s turn`;
    }

    function checkWinner() {
        for (let i = 0; i < winningCombinations.length; i++) {
            const condition = winningCombinations[i];
            const cellA = options[condition[0]]
            const cellB = options[condition[1]]
            const cellC = options[condition[2]]

            if (cellA == "" || cellB == "" || cellC == "") {
                continue;
            }

            if (cellA == cellB && cellB == cellC) {
                gameOver = true;
                break;
            }
        }

        if (gameOver) {
            statusText.textContent = `${currentPlayer} wins!`;
        }
        else if (!options.includes("")) {
            statusText.textContent = `Draw!`;
        }
        else {
            changePlayer();
        }
    }

    function restartGame() {
        currentPlayer = "X"
        options = ["", "", "", "", "", "", "", "", ""];
        statusText.textContent = `${currentPlayer}'s turn`;
        cells.forEach(cell => cell.textContent = "");
        gameOver = false;
    }

    function changeMode() {
        restartGame();
        if (actualMode == 1) {
            modeText.textContent = `Player (X) vs AI (O)`;
            actualMode = 2;
        }
        else {
            modeText.textContent = `Player (X) vs Player (O)`;
            actualMode = 1;
        }
    }

    function getEmptyCells(board) {
        let emptyCells = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                emptyCells.push(i);
            }
        }
        return emptyCells;
    }    

    function h(node, player) {
        let plays = node.reduce((a, e, i) => 
            (e === player) ? a.concat(i) : a, []);
        let winner = null;
        for (let [index, win] of winningCombinations.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                winner = { index: index, player: player };
                break;
            }
        }
        return winner;        
    }

    function minimax(newBoard, player) {
        var availSpots = getEmptyCells(newBoard);
    
        if (h(newBoard, "X")) {
            return { score: -10 };
        } else if (h(newBoard, "O")) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }
        var moves = [];
        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;
    
            if (player == "O") {
                var result = minimax(newBoard, "X");
                move.score = result.score;
            } else {
                var result = minimax(newBoard, "O");
                move.score = result.score;
            }

            newBoard[availSpots[i]] = "";
    
            moves.push(move);
        }
    
        var bestMove;
        if (player === "O") {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    
        return moves[bestMove];
    }
});
