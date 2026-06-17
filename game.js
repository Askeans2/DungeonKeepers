const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const gameState = {

    resources: {
        food: 0,
        wood: 0,
        stone: 0
    },

    rooms: {
        nest: 0
    },

    time: {
        day: 1,
        year: 1,
        seasonIndex: 0
    }
};

// --------------------
// RESOURCES
// --------------------

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

// --------------------
// BUILDINGS
// --------------------

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

// --------------------
// GAME LOOP
// --------------------

function gameLoop() {

    gameState.resources.food += 1 + (gameState.rooms.nest * 2);

    // TIME SYSTEM
    gameState.time.day++;

    if (gameState.time.day % 10 === 0) {
        gameState.time.seasonIndex++;
    }

    if (gameState.time.seasonIndex >= 4) {
        gameState.time.seasonIndex = 0;
        gameState.time.year++;
    }

    updateUI();
}

// --------------------
// UI
// --------------------

function updateUI() {

    document.getElementById("food").textContent =
        gameState.resources.food;

    document.getElementById("wood").textContent =
        gameState.resources.wood;

    document.getElementById("stone").textContent =
        gameState.resources.stone;

    document.getElementById("nestCount").textContent =
        gameState.rooms.nest;

    document.getElementById("day").textContent =
        gameState.time.day;

    document.getElementById("year").textContent =
        gameState.time.year;

    document.getElementById("season").textContent =
        seasons[gameState.time.seasonIndex];
}

// --------------------
// SCREEN SYSTEM
// --------------------

function showScreen(name) {

    const screens = document.querySelectorAll(".screen");
    screens.forEach(s => s.classList.remove("active"));

    document.getElementById(name).classList.add("active");

    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(t => t.classList.remove("active"));

    event.target.classList.add("active");
}

// --------------------
// INIT
// --------------------

window.onload = () => {

    loadGame();
    updateUI();

    setInterval(gameLoop, 1000);
    setInterval(saveGame, 5000);

    showScreen("overview");
};