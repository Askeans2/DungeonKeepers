const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const gameState = {

    resources: {
        food: 0,
        wood: 0,
        stone: 0
    },

    caps: {
        food: 1000,
        wood: 1000,
        stone: 1000
    },

    buildings: {
        farm: 0,
        lumber: 0,
        quarry: 0,
        nest: 0,
        storage: 0
    },

    time: {
        day: 1,
        year: 1,
        seasonIndex: 0
    }
};

// --------------------
// GATHER
// --------------------

function gather(resource) {
    if (gameState.resources[resource] < gameState.caps[resource]) {
        gameState.resources[resource]++;
    }
    updateUI();
}

function gatherFood() { gather("food"); }
function gatherWood() { gather("wood"); }
function gatherStone() { gather("stone"); }

// --------------------
// BUILDINGS
// --------------------

function buildFarm() {
    if (gameState.resources.wood >= 10) {
        gameState.resources.wood -= 10;
        gameState.buildings.farm++;
        updateUI();
    }
}

function buildLumber() {
    if (gameState.resources.wood >= 10) {
        gameState.resources.wood -= 10;
        gameState.buildings.lumber++;
        updateUI();
    }
}

function buildQuarry() {
    if (gameState.resources.wood >= 10) {
        gameState.resources.wood -= 10;
        gameState.buildings.quarry++;
        updateUI();
    }
}

function buildNest() {
    if (gameState.resources.wood >= 10 &&
        gameState.resources.stone >= 5) {

        gameState.resources.wood -= 10;
        gameState.resources.stone -= 5;

        gameState.buildings.nest++;

        updateUI();
    }
}

function buildStorage() {
    if (gameState.resources.wood >= 20) {
        gameState.resources.wood -= 20;

        gameState.buildings.storage++;

        gameState.caps.food += 50;
        gameState.caps.wood += 50;
        gameState.caps.stone += 50;

        updateUI();
    }
}

// --------------------
// LOOP
// --------------------

function gameLoop() {

    gameState.resources.food =
        Math.min(gameState.caps.food,
            gameState.resources.food + gameState.buildings.farm * 2);

    gameState.resources.wood =
        Math.min(gameState.caps.wood,
            gameState.resources.wood + gameState.buildings.lumber * 2);

    gameState.resources.stone =
        Math.min(gameState.caps.stone,
            gameState.resources.stone + gameState.buildings.quarry * 2);

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

    updateResource("food");
    updateResource("wood");
    updateResource("stone");

    document.getElementById("farmCount").textContent = gameState.buildings.farm;
    document.getElementById("lumberCount").textContent = gameState.buildings.lumber;
    document.getElementById("quarryCount").textContent = gameState.buildings.quarry;
    document.getElementById("nestCount").textContent = gameState.buildings.nest;
    document.getElementById("storageCount").textContent = gameState.buildings.storage;

    document.getElementById("day").textContent = gameState.time.day;
    document.getElementById("year").textContent = gameState.time.year;
    document.getElementById("season").textContent = seasons[gameState.time.seasonIndex];
}

function updateResource(name) {

    const value = gameState.resources[name];
    const cap = gameState.caps[name];

    document.getElementById(name).textContent = value;
    document.getElementById(name + "Cap").textContent = cap;

    const line = document.getElementById(name + "Line");

    if (value >= cap) {
        line.classList.add("full");
    } else {
        line.classList.remove("full");
    }
}

// --------------------
// INIT
// --------------------

window.onload = () => {

    loadGame();
    updateUI();

    setInterval(gameLoop, 1000);
    setInterval(saveGame, 5000);
};