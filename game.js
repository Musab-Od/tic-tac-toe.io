const GameBoard = (() => {
    const board = Array(9).fill(null);

    const render = (currentPlayer) => {
        let boardHtml = "";
        board.forEach((square, index) => {
            boardHtml += `<div class="square" id="square-${index}" data-hover="${currentPlayer ? currentPlayer.mark : ''}">${square !== null ? square : ''}</div>`;
        });

        document.querySelector(".game-board").innerHTML = boardHtml;

        // Attach event listeners after rendering
        document.querySelectorAll(".square").forEach((square, index) => {
            square.addEventListener("click", () => Game.handleClicks(index));
            square.classList.remove("x", "o");
            if (currentPlayer) {
                square.classList.add(currentPlayer.mark.toLowerCase());
            }
        });
    };

    const resetBoard = (currentPlayer) => {
        board.fill(null);
        render(currentPlayer);
    };

    const startBtn = document.querySelector(".btnStart");

    startBtn.addEventListener("click", () => {
        const player1 = document.getElementById("player1");
        const player2 = document.getElementById("player2");
        if (player1.value.trim() === '') {
            player1.placeholder = 'Please enter the player name';
            return;
        } else if (player2.value.trim() === '') {
            player2.placeholder = 'Please enter the player name';
            return;
        } else {
            const playerOne = createPlayer(player1.value, "X", 0);
            const playerTwo = createPlayer(player2.value, "O", 0);
            document.querySelector(".player-info").classList.add("active");
            document.querySelector(".game-board").classList.add("active");
            // document.querySelector(".btnRestart").classList.add("active");
            document.querySelector(".player-one-info").textContent = `${playerOne.name}:`;
            document.querySelector(".player-two-info").textContent = `${playerTwo.name}:`;
            document.querySelector(".score-one").textContent = playerOne.score;
            document.querySelector(".score-two").textContent = playerTwo.score;

            Game.init(playerOne, playerTwo);
        }
    });

    return {
        render,
        resetBoard,
        board,
    };
})();

function createPlayer(name, mark, score) {
    return { name, mark, score };
}

const Game = (() => {
    let currentPlayer;
    let playerOne;
    let playerTwo;

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

    const init = (p1, p2) => {
        playerOne = p1;
        playerTwo = p2;
        currentPlayer = playerOne;

        GameBoard.resetBoard(currentPlayer);
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    const checkWin = () => {
        return winningCombinations.some(combination => {
            return combination.every(index => GameBoard.board[index] === currentPlayer.mark);
        });
    };

    const checkTie = () => {
        return GameBoard.board.every(square => square !== null);
    };

    const displayEndMessage = (message) => {
        alert(message);
    };

    const handleClicks = (index) => {
        if (GameBoard.board[index] === null) {
            GameBoard.board[index] = currentPlayer.mark;
            document.getElementById(`square-${index}`).textContent = currentPlayer.mark;

            if (checkWin()) {
                currentPlayer.score++;
                document.querySelector(".score-one").textContent = playerOne.score;
                document.querySelector(".score-two").textContent = playerTwo.score;
                displayEndMessage(`${currentPlayer.name} wins!`);
                GameBoard.resetBoard(currentPlayer);
                return;
            }

            if (checkTie()) {
                displayEndMessage("It's a tie!");
                GameBoard.resetBoard(currentPlayer);
                return;
            }

            switchPlayer();
            GameBoard.render(currentPlayer); // Update hover effect for the next player
        }
    };

    return {
        init,
        switchPlayer,
        handleClicks
    };
})();