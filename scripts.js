class Game {
    constructor() {
        this.board = []; // This will hold the pits for each player
        this.score = [0, 0]; // Scores for each player
        this.currentPlayer = 1; // Current player (0 for player 1, 1 for player 2)
        this.gameOver = false; // Indicates whether the game is over
        this.playerTurn = true; // Indicates whether it's the player's turn
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
            return console.log('Game Over'); // If the game is over, pop up Game Over
        }
    
        let stones = this.board[playerIndex][pitIndex];
        if (stones === 0) {
            return; // Cannot move from an empty pit
        }
    
        this.board[playerIndex][pitIndex] = 0; // Remove stones from the selected pit
        let currentPit = pitIndex;
        let currentBoard = playerIndex;
    
        while (stones > 0) {
            // Move stones to the left on the player's side
            if (currentBoard === 0) {
                currentPit--;
                // If the current pit is less than 0, move to the AI's side
                if (currentPit < 0) {
                    currentPit = 0;
                    currentBoard = 1; // Switch to the AI's side
                }
            } else {
                // Move stones to the right on the AI's side
                currentPit++;
                // If the current pit is greater than 5, move to the player's side
                if (currentPit > 5) {
                    currentPit = 5;
                    currentBoard = 0; // Switch to the player's side
                }
            }
            
            this.board[currentBoard][currentPit]++; // Drop a stone into the pit
            stones--;
    
            // Check if the last stone lands in an empty pit on the player's side
            if (stones === 0 && currentBoard === playerIndex && this.board[currentBoard][currentPit] === 1) {
                const oppositePit = 5 - currentPit;
                const oppositeStones = this.board[1 - currentBoard][oppositePit];
                if (oppositeStones > 0) {
                    // Capture the stones from the opposite pit
                    this.score[playerIndex] += oppositeStones + 1;
                    this.board[currentBoard][currentPit] = 0;
                    this.board[1 - currentBoard][oppositePit] = 0;
                }
            }
    
            // Check if the last stone lands in an empty pit on the AI's side
            if (stones === 0 && currentBoard === 1 && this.board[currentBoard][currentPit] === 1) {
                const oppositePit = 5 - currentPit;
                const oppositeStones = this.board[1 - currentBoard][oppositePit];
                if (oppositeStones > 0) {
                    // Capture the stones from the opposite pit
                    this.score[playerIndex] += oppositeStones + 1;
                    this.board[currentBoard][currentPit] = 0;
                    this.board[1 - currentBoard][oppositePit] = 0;
                }
            }
        }
    
        // Check for game over and switch player if necessary
        if (this.checkGameOver()) {
            this.gameOver = true;
            this.updateUI();
        }
    }
    
    
    
    

    playerMove(pitIndex) {
        if (this.currentPlayer !== 0) {
            return; // It's not the player's turn
        }
        this.move(0, pitIndex); // Player's move, player index is 0
        this.currentPlayer = 1; // Switch to the AI's turn
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
        document.getElementById('score-0').innerText = ` You ---[${this.score[0]}]---  `;
        document.getElementById('score-1').innerText = `  AI ---[${this.score[1]}]---  `;
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

    getGameData() {
        return JSON.stringify({
            score: this.score,
        });
    }

    startGame() {
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
    
    openOptionsMenu(event) {
        event.stopPropagation();
        document.getElementById('optionsMenu').className = 'visible';
    }
    
    exitGame() {
        location.reload();
        // Reset the game state
    }
    
    resetGame() {
        // Reset the game state
        this.init();
    }
}

let game;
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
    });

    const pits = document.querySelectorAll('.pit');
    pits.forEach((pit, index) => {
        pit.addEventListener('click', () => {
            if (game.currentPlayer === 0) { // Only allow the player to move when it's their turn
                game.playerMove(index);
                game.updateUI();
                game.currentPlayer = 1; // Switch to the AI's turn
                handleTurns(); // Call handleTurns again to handle the AI's turn
            }
        });
    });

    function handleTurns() {
        if (game.gameOver) {
            let result = 'Game Over\n';
            if (game.score[0] > game.score[1]) {
                result += 'You Win';
            } else if (game.score[0] < game.score[1]) {
                result += 'You Lose';
            } else {
                result += 'It\'s a Draw';
            }
            document.getElementById('gameStatus').innerText = result;
            const gameData = game.getGameData();
            localStorage.setItem('gameData', JSON.stringify(gameData));
            JSON.parse(localStorage.getItem('gameData'));
            console.log(gameData);
            return; // End the loop if the game is over
        }

        if (game.currentPlayer === 1) {
            // AI's turn
            setTimeout(() => {
                    game.basicAI(); // AI's move after a delay
                    game.updateUI();
                    game.currentPlayer = 0; // Switch to the player's turn
                    handleTurns(); // Call handleTurns again to handle the player's turn
            }, 5000);
        }
    }

    easyButton.addEventListener('click', function() {
        game.startGame();
        handleTurns();
    });

    exitButton.addEventListener('click', game.openOptionsMenu.bind(game));
    exitGameButton.addEventListener('click', game.exitGame.bind(game));
    restartGameButton.addEventListener('click', game.resetGame.bind(game));
    const historyButton = document.getElementById('historyButton');
    historyButton.addEventListener('click', function() {
        // Retrieve game data from local storage
        const gameData = localStorage.getItem('gameData');
        if (gameData) {
            // Parse the game data
            const parsedData = JSON.parse(gameData);
            console.log(parsedData);

            // Check if parsedData.score is an array and has at least two elements
            if (Array.isArray(parsedData.score) && parsedData.score.length >= 2) {
                // Get the table
                const table = document.getElementById('gameData');

                // Make the table visible
                table.style.display = 'table';

                // Create a new row
                const row = table.insertRow();

                // Create cells for AI and Player and add them to the row
                const aiCell = row.insertCell();
                const playerCell = row.insertCell();

                // Set the text of the cells to the game data
                aiCell.textContent = parsedData.score[1];
                playerCell.textContent = parsedData.score[0];
            } else {
                // If there's no score data, you could show a message somewhere on the screen
                // For example, you could have a div with an id of "message" and set its text content
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = 'No previous score data found.';
            }
        } else {
            // If there's no game data, you could show a message somewhere on the screen
            // For example, you could have a div with an id of "message" and set its text content
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'No previous game data found.';
            document.addEventListener('click', function() {
                messageDiv.display = 'none';
            });
        }
    });

    optionsMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('click', function() {
        optionsMenu.className = 'hidden';
    });
});
