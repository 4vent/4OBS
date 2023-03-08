function main() {
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(t => {
        t.textContent = "◼️" + t.textContent;
        t.addEventListener("click", ev => {
            if (ev.target.classList.contains("v")) {
                ev.target.classList.remove("v");
                ev.target.textContent = "◼️" + ev.target.textContent.slice(1);
            } else if (ev.target.classList.contains("r")) {
                ev.target.classList.remove("r");
                ev.target.textContent = "✅" + ev.target.textContent.slice(2);
                ev.target.classList.add("v");
            } else {
                ev.target.textContent = "🏃" + ev.target.textContent.slice(1);
                ev.target.classList.add("r");
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", ev => {
    main();
})