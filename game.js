function updateButtons() {

    const ids = ["farm", "lumber", "quarry", "storage"];

    ids.forEach(id => {

        const btn = document.getElementById("btn-" + id);
        if (!btn) return;

        if (canAfford(id)) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }
    });
}