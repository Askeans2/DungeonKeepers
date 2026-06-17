// game.js

const gameState = {
    resources: {
        food: 0,
        wood: 0,
        stone: 0
    },

    rooms: {
        nest: 0
    }
};

// -----------------------------
// RESOURCE GATHERING
// -----------------------------

function gatherFood() {
    gameState.resources.food += 1;
    updateUI();
}

function gatherWood() {
    gameState.resources.wood += 1;
    updateUI();
}

function gatherStone() {
    gameState.resources.stone += 1;
    updateUI();
}

// -----------------------------
// ROOM SYSTEM
// -----------------------------

function buildNest() {
    const woodCost = 10;
    const stoneCost = 5;

    if (
        gameState.resources.wood >= woodCost &&
        gameState.resources.stone >= stoneCost
    ) {
        gameState.resources.wood -= woodCost;
        gameState.resources.stone -= stoneCost;

        gameState.rooms.nest += 1;

        updateUI();
    }
}

// -----------------------------
// GAME LOOP
// -----------------------------

function gameLoop() {
    const nests = gameState.rooms.nest;

    // Passive food generation
    gameState.resources.food += 1 + (nests * 2);

    updateUI();
}

// -----------------------------
// UI UPDATE
// -----------------------------

function updateUI() {

    document.getElementById("food").textContent =
        Math.floor(gameState.resources.food);

    document.getElementById("wood").textContent =
        Math.floor(gameState.resources.wood);

    document.getElementById("stone").textContent =
        Math.floor(gameState.resources.stone);

    document.getElementById("nestCount").textContent =
        gameState.rooms.nest;
}

// -----------------------------
// INIT
// -----------------------------

window.onload = () => {

    loadGame();

    updateUI();

    // Main tick loop (1 second)
    setInterval(gameLoop, 1000);

    // Auto-save loop (5 seconds)
    setInterval(saveGame, 5000);
};