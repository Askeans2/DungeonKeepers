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

// -------------------
// RESOURCES
// -------------------

function gatherFood() {
    gameState.resources.food++;
    updateUI();
}

function gatherWood() {
    gameState.resources.wood++;
    updateUI();
}

function gatherStone() {
    gameState.resources.stone++;
    updateUI();
}

// -------------------
// BUILDINGS
// -------------------

function buildNest() {

    if (
        gameState.resources.wood >= 10 &&
        gameState.resources.stone >= 5
    ) {
        gameState.resources.wood -= 10;
        gameState.resources.stone -= 5;

        gameState.rooms.nest++;

        updateUI();
    }
}

// -------------------
// GAME LOOP
// -------------------

function gameLoop() {
    gameState.resources.food += 1 + (gameState.rooms.nest * 2);
    updateUI();
}

// -------------------
// UI
// -------------------

function updateUI() {

    document.getElementById("food").textContent = gameState.resources.food;
    document.getElementById("wood").textContent = gameState.resources.wood;
    document.getElementById("stone").textContent = gameState.resources.stone;

    document.getElementById("nestCount").textContent = gameState.rooms.nest;
}

// -------------------
// SCREEN SYSTEM (FIXED)
// -------------------

function showScreen(name) {

    const screens = document.querySelectorAll(".screen");
    screens.forEach(s => s.classList.remove("active"));

    document.getElementById(name).classList.add("active");

    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(t => t.classList.remove("active"));

    event.target.classList.add("active");
}

// -------------------
// INIT
// -------------------

window.onload = () => {

    loadGame();

    updateUI();

    setInterval(gameLoop, 1000);
    setInterval(saveGame, 5000);

    showScreen("overview");
};