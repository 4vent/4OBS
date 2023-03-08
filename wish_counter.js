import { getLocationParm } from "./urlparser.js"

const API_URL = "https://script.google.com/macros/s/AKfycbxzA8lVK1Qn8Tbv4jxmYehvxkN5LoP_zYFIboY1Pu0G_rXgHsIh4KYN-O5Tku0X1Duq/exec";
const CHAR_DATABASE = {};
async function main() {
    const sheetname = "DBキャラ"
    const command = "SELECT A,D,P"
    const res = await (await fetch(API_URL + '?query_sheetname=' + encodeURIComponent(sheetname) + "&query_command=" + encodeURIComponent(command))).json();
    Object.keys(res.query_result).forEach(k => {
        CHAR_DATABASE[res.query_result[k].HoneyImpactID] = {
            name: res.query_result[k]["名前"],
            element: res.query_result[k]["元素"]
        }
    })

    document.querySelector("#main_div").addEventListener("mouseup", ev => {
        if (ev.button == 1) {
            document.querySelector("#control-panel").toggleAttribute("hidden");
            const firstOption = document.querySelector("select > option");
            firstOption.toggleAttribute("selected");
            if (!firstOption.hasAttribute("selected")) firstOption.toggleAttribute("selected");

        }
    })

    const char_table = document.querySelector(".char-table");

    document.querySelector("select").addEventListener("change", ev => {
        if (ev.target.value == "_DIV") {
            addDivLine(char_table);
        }
        else {
            addNewChar(char_table, ev.target.value);
        }
        document.querySelector("#control-panel").toggleAttribute("hidden");
    })

    const add_char_selector = document.querySelector("#add-char-selector");
    Object.keys(CHAR_DATABASE).forEach(k => {
        add_char_selector.appendChild(
            Object.assign(document.createElement("option"), {textContent: CHAR_DATABASE[k].name, value: k})
        )
    })
    
    const cookie = parseCookie();
    var char_list;
    if (cookie._char_list == "" || cookie._char_list == undefined) char_list = "mona_041-qin_003-diluc_016-keqing_042-qiqi_035-tighnari_069-dehya_079";
    else char_list = cookie._char_list;

    const parms = getLocationParm();
    var keys = [];
    if (parms.char == undefined) {
        keys = char_list.split("-");
    } else {
        parms.char.split("-").forEach(name => {
            if (name == "DIV") keys.push("_DIV_LINE");
            else keys.push(Object.keys(CHAR_DATABASE).find(k => CHAR_DATABASE[k].name == name));
        })

    }
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "_DIV_LINE") {
            addDivLine(char_table);
        } else {
            await addNewChar(char_table, keys[i]);
        }
    }
    

}

function parseCookie() {
    const cookie = document.cookie;
    var obj = {};
    cookie.split(";").forEach(kv => {
        const [k, v] = kv.split("=");
        if (k != undefined && v != undefined) obj[k.trim()] = v.trim();
    });
    return obj;
}

/**
 * @param {HTMLDivElement} char_table 
 * @param {string} id 
 * @param {int} prev 
 */
async function addNewChar(char_table, id) {
    const cookie = parseCookie();
    var prev = Number(cookie[id]);
    if (isNaN(prev)) prev = 0;
    var prev_count = prev;
    var curr_count = prev;

    var element;
    switch (CHAR_DATABASE[id].element) {
    case "炎":
        element = "Pyro"; break;
    case "水":
        element = "Hydro"; break;
    case "風":
        element = "Anemo"; break;
    case "雷":
        element = "Electro"; break;
    case "草":
        element = "Dendro"; break;
    case "氷":
        element = "Cryo"; break;
    case "岩":
        element = "Geo"; break;
    }
    

    const div = Object.assign(document.createElement("div"), {className: "char-block " + id});
    div.appendChild(Object.assign(document.createElement("img"), {className: "icon-img", src: "https://genshin.honeyhunterworld.com/img/" + id + "_icon.webp", alt: id + "_icon"}));
    div.appendChild(Object.assign(document.createElement("div"), {className: "prev-counter " + element}));
    div.appendChild(Object.assign(document.createElement("div"), {className: "counter " + element}));

    function updateCount() {
        div.querySelector(".prev-counter").textContent = ((prev_count == 0) ? "未所持" : (prev_count == 1) ? "無凸" : (prev_count - 1).toString() + "凸") + " →";
        div.querySelector(".counter").textContent = (curr_count == 0) ? "未所持" : (curr_count == 1) ? "無凸" : (curr_count - 1).toString() + "凸";
        div.querySelector(".counter").setAttribute("curr_count", curr_count);
        if (curr_count == 0) {
            div.style.opacity = 0.7;
        } else {
            div.style.removeProperty("opacity");
        }
        save();
    }

    char_table.appendChild(div);

    updateCount();
    div.addEventListener("mouseup", ev => {
        switch (ev.button) {
        case 0:
            curr_count += 1;
            updateCount();
            break;
        case 1:
            ev.preventDefault();
            ev.stopPropagation();
            div.remove();
            save();
            break;
        }
    });
    div.addEventListener("wheel", ev => {
        ev.preventDefault();
        console.log(ev.deltaY);
        curr_count += Math.floor(ev.deltaY * -0.01);
        updateCount();
    }, {passive: false})
}

async function addDivLine(char_table) {
    const div = Object.assign(document.createElement("div"), {style: "width: 0.5em; background-color: white;"});

    div.addEventListener("mouseup", ev => {
        switch (ev.button) {
        case 1:
            ev.preventDefault();
            ev.stopPropagation();
            div.remove();
            save();
            break;
        }
    });

    char_table.appendChild(div);

    save();
}

function save() {
    const char_blocks = document.querySelectorAll(".char-table > .char-block");
    const char_ids = [];
    char_blocks.forEach(char => {
        if (char.classList[0] == "divLine") {
            char_ids.push("_DIV_LINE");
        } else {
            const id = char.classList[1];
            char_ids.push(id);
            const value = char.querySelector(".counter").getAttribute("curr_count");
            if (!isNaN(value))
                document.cookie = id + "=" + value;
        }
    })
    document.cookie = "_char_list=" + char_ids.join("-");
}

document.addEventListener("DOMContentLoaded", ev => {
    main();
})