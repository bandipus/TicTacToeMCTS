document.addEventListener('DOMContentLoaded', () => { // Movida para que no se cargue js antes de html
    
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
            // MINIMAX ALGORITHM
            setTimeout(() => {
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

    function vsMachineMode() {

    }

    function changeMode() {
        restartGame();
        if (actualMode == 1) {
            modeText.textContent = `Player (X) vs AI (O)`;
            actualMode = 2;
            vsMachineMode();
        }
        else {
            modeText.textContent = `Player (X) vs Player (O)`;
            actualMode = 1;
        }
    }


});