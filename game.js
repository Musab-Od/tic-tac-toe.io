// Module for managing the game board
const GameBoard = (() => {
    const board = Array(9).fill(null);

    // Render the game board
    const render = (currentPlayer) => {
        let boardHtml = "";
        board.forEach((square, index) => {
            boardHtml += `<div class="square" id="square-${index}" data-hover="${currentPlayer ? currentPlayer.mark : ''}">${square !== null ? square : ''}</div>`;
        });
        document.querySelector(".game-board").innerHTML = boardHtml;
        attachEventListeners(currentPlayer);
    };

    // Attach event listeners to the squares
    const attachEventListeners = (currentPlayer) => {
        document.querySelectorAll(".square").forEach((square, index) => {
            square.addEventListener("click", () => Game.handleClicks(index));
            square.classList.remove("x", "o");
            if (currentPlayer) {
                square.classList.add(currentPlayer.mark.toLowerCase());
            }
        });
    };

    // Reset the game board
    const resetBoard = (currentPlayer) => {
        board.fill(null);
        render(currentPlayer);
    };

    return {
        render,
        resetBoard,
        board,
    };
})();

// Factory function to create player objects
function createPlayer(name, mark, score = 0) {
    return { name, mark, score };
}

// Module for managing the game logic
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

    // Initialize the game with two players
    const init = (p1, p2) => {
        playerOne = p1;
        playerTwo = p2;
        currentPlayer = playerOne;
        GameBoard.resetBoard(currentPlayer);
    };

    // Switch the current player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    // Check if the current player has won
    const checkWin = () => {
        return winningCombinations.some(combination => {
            return combination.every(index => GameBoard.board[index] === currentPlayer.mark);
        });
    };

    // Check if the game is a tie
    const checkTie = () => {
        return GameBoard.board.every(square => square !== null);
    };

    // Display the end game message
    const displayEndMessage = (message) => {
        alert(message);
    };

    // Handle clicks on the game board
    const handleClicks = (index) => {
        if (GameBoard.board[index] === null) {
            GameBoard.board[index] = currentPlayer.mark;
            document.getElementById(`square-${index}`).textContent = currentPlayer.mark;

            if (checkWin()) {
                updateScore();
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
            GameBoard.render(currentPlayer);
        }
    };

    // Update the score of the current player
    const updateScore = () => {
        currentPlayer.score++;
        document.querySelector(".score-one").textContent = playerOne.score;
        document.querySelector(".score-two").textContent = playerTwo.score;
    };

    return {
        init,
        switchPlayer,
        handleClicks
    };
})();

// Event listener for the start button
document.querySelector(".btnStart").addEventListener("click", () => {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    // Validate player names
    if (player1.value.trim() === '') {
        player1.placeholder = 'Please enter the player name';
        return;
    } else if (player2.value.trim() === '') {
        player2.placeholder = 'Please enter the player name';
        return;
    } else {
        const playerOne = createPlayer(player1.value, "X");
        const playerTwo = createPlayer(player2.value, "O");

        // Update UI with player info
        document.querySelector(".player-info").classList.add("active");
        document.querySelector(".game-board").classList.add("active");
        document.querySelector(".player-one-info").textContent = `${playerOne.name}:`;
        document.querySelector(".player-two-info").textContent = `${playerTwo.name}:`;
        document.querySelector(".score-one").textContent = playerOne.score;
        document.querySelector(".score-two").textContent = playerTwo.score;

        // Initialize the game
        Game.init(playerOne, playerTwo);
    }
});