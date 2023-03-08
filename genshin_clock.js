function main() {
    const day = Object.assign(
        document.createElement("div"),
        {style: "font-size: 80px"}
    );
    const time = Object.assign(
        document.createElement("div"),
        {style: "font-size: 140px"}
    );
    document.querySelector("html > body").appendChild(day);
    document.querySelector("html > body").appendChild(time);

    console.log("Clock loaded!");
    setInterval(_ => {
        const d = new Date();
        day.innerHTML = d.getMonth().toString() + "月" + 
                        d.getDate().toString() + "日";
        time.innerHTML = ("0" + d.getHours().toString()).slice(-2) + ":" + 
                         ("0" + d.getMinutes().toString()).slice(-2) + ":" + 
                         ("0" + d.getSeconds().toString()).slice(-2);
    }, 1000)
}

document.addEventListener("DOMContentLoaded", ev => {
    main();
})