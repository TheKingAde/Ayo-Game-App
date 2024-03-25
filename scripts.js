class Game {
    constructor() {
        this.board = []; // This will hold the pits for each player
        this.score = [0, 0]; // Scores for each player
        this.currentPlayer = 0; // Current player (0 for player 1, 1 for player 2)
        this.gameOver = false; // Indicates whether the game is over
    }

    init() {
        // Initialize the board with 4 stones in each pit for each player
        this.board = Array(2).fill().map(() => Array(6).fill(4));
        this.score = [0, 0];
        this.currentPlayer = 0;
        this.gameOver = false;
        this.updateUI();
    }

    move(playerIndex, pitIndex) {
        if (this.gameOver) {
            return; // If the game is over, do nothing
        }

        let stones = this.board[playerIndex][pitIndex];
        if (stones === 0) {
            return; // Cannot move from an empty pit
        }

        this.board[playerIndex][pitIndex] = 0; // Remove stones from the selected pit
        let currentPit = pitIndex;

        while (stones > 0) {
            currentPit = (currentPit + 1) % 6; // Move to the next pit
            if (currentPit === 0 && playerIndex !== this.currentPlayer) {
                // Skip the opponent's store pit
                currentPit = (currentPit + 1) % 6;
            }

            this.board[playerIndex][currentPit]++; // Drop a stone into the pit
            stones--;

            // Check if the last stone lands in an empty pit on the player's side
            if (stones === 0 && playerIndex === this.currentPlayer && this.board[playerIndex][currentPit] === 1) {
                const oppositePit = 5 - currentPit;
                const oppositeStones = this.board[1 - playerIndex][oppositePit];
                if (oppositeStones > 0) {
                    // Capture the stones from the opposite pit
                    this.score[playerIndex] += oppositeStones + 1;
                    this.board[playerIndex][currentPit] = 0;
                    this.board[1 - playerIndex][oppositePit] = 0;
                }
            }
        }

        // Check for game over and switch player if necessary
        if (this.checkGameOver()) {
            this.gameOver = true;
            this.updateUI();
        } else {
            if (currentPit !== 5) { // If the last stone didn't land in the store, switch players
                this.currentPlayer = 1 - this.currentPlayer;
            }
            this.updateUI();
        }
    }

    checkGameOver() {
        // Check if any player has no stones in their pits
        for (let playerIndex = 0; playerIndex < this.board.length; playerIndex++) {
            if (this.board[playerIndex].every(stones => stones === 0)) {
                return true; // Game over if all pits for a player are empty
            }
        }
        return false; // Game is not over yet
    }

    updateUI() {
        // Update the pits
        for (let playerIndex = 0; playerIndex < this.board.length; playerIndex++) {
            for (let pitIndex = 0; pitIndex < this.board[playerIndex].length; pitIndex++) {
                const pit = document.getElementById(`pit-${playerIndex}-${pitIndex}`);
                pit.innerText = this.board[playerIndex][pitIndex];
            }
        }

        // Update the scores
        document.getElementById('score-0').innerText = `Player: ${this.score[0]}`;
        document.getElementById('score-1').innerText = `AI: ${this.score[1]}`;
    }

    getValidMoves() {
        const validMoves = [];
        const pits = this.board[this.currentPlayer];
        for (let i = 0; i < pits.length; i++) {
            if (pits[i] > 0) {
                validMoves.push(i);
            }
        }
        return validMoves;
    }

    basicAI() {
        const validMoves = this.getValidMoves();
        if (validMoves.length === 0) {
            return; // No valid moves
        }

        // Prioritize moves that result in capturing opponent stones
        for (let i = 0; i < validMoves.length; i++) {
            const testBoard = JSON.parse(JSON.stringify(this.board)); // Create a copy of the board for testing
            const moveIndex = validMoves[i];
            let stones = testBoard[1][moveIndex]; // AI player index is 1
            let pitIndex = moveIndex;

            // Simulate the move
            testBoard[1][moveIndex] = 0;
            while (stones > 0) {
                pitIndex = (pitIndex + 1) % 6; // Move to the next pit
                if (pitIndex === 0) {
                    // Skip the opponent's store pit
                    pitIndex = (pitIndex + 1) % 6;
                }
                testBoard[1][pitIndex]++;
                stones--;

                if (stones === 0 && pitIndex !== 5 && testBoard[1][pitIndex] === 1 && testBoard[0][5 - pitIndex] > 0) {
                    // If the last stone lands in an empty pit on AI's side and opposite pit has stones
                    // Capture opponent stones
                    testBoard[1][5] += testBoard[0][5 - pitIndex] + 1; // Add captured stones to AI's store
                    testBoard[0][5 - pitIndex] = 0; // Empty the opponent's pit
                    testBoard[1][pitIndex] = 0; // Empty AI's pit
                }
            }

            // If the move results in a capture, make the move
            if (testBoard[1][5] > this.board[1][5]) {
                this.move(1, moveIndex);
                return;
            }
        }

        // If no capturing move is found, make a random move
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        this.move(1, randomMove); // AI player index is 1
    }
}


let game;
let playerTurn = true;
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const aiButton = document.getElementById('aiButton');
    const easyButton = document.getElementById('easyButton');
    const exitButton = document.getElementById('exitButton');
    const exitGameButton = document.getElementById('exitGameButton');
    const restartGameButton = document.getElementById('restartGameButton');
    const optionsMenu = document.getElementById('optionsMenu');
    game = new Game();
    game.init();

    startButton.addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('buttonsContainer').className = 'visible';
    });

    aiButton.addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('difficultyLevel').className = 'visible';
        document.getElementById('onlineButton').style.display = 'none';
        game.basicAI();
    });

    easyButton.addEventListener('click', function() {
        startGame();
        // game.basicAI();
    });
    exitButton.addEventListener('click', openOptionsMenu);
    exitGameButton.addEventListener('click', exitGame);
    restartGameButton.addEventListener('click', resetGame);

    optionsMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('click', function() {
        optionsMenu.className = 'hidden';
    });

    const pits = document.querySelectorAll('.pit');

    pits.forEach((pit, index) => {
        pit.addEventListener('click', function() {
            if (playerTurn && game.currentPlayer === 0) {
                game.move(0, index); // Player's move, player index is 0
                playerTurn = false; // Switch turn after player's move
                setTimeout(() => {
                    if (!game.gameOver && !playerTurn) {
                        game.basicAI(); // AI's move after a delay
                        playerTurn = true; // Switch turn after AI's move
                    }
                }, 5000); // 5 seconds delay
            }
        });
    });

    game.updateUI();
});

function startGame() {
    // Hide the difficulty level buttons
    document.getElementById('difficultyLevel').className = 'hidden';

    // Show the game board and score board
    document.getElementById('gameContainer').className = 'visible';
    document.getElementById('AIscoreBoard').className = 'visible';
    document.getElementById('PlayerscoreBoard').className = 'visible';

    // Hide the AYO logo and Board logo
    document.querySelector('.logo').style.display = 'none';
    document.querySelector('.board').style.display = 'none';

    document.body.classList.add('backgroundImage');
    document.getElementById('exitButton').style.display = 'block';
}

function openOptionsMenu(event) {
    event.stopPropagation();
    document.getElementById('optionsMenu').className = 'visible';
}

function exitGame() {
    location.reload();
    // Reset the game state
}

function resetGame() {
    // Reset the game state
    // will  implement this later
}