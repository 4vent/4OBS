import { getLocationParm } from "./urlparser.js"

function main() {
    const img = document.querySelector("img");
    const src = getLocationParm().src;
    console.log(getLocationParm())
    
    if (src == undefined) {
        document.querySelector("#src").addEventListener("change", ev => {
            window.open(location.href + '?src=' + encodeURIComponent(ev.target.value))
        })
    } else {
        img.src = src;
        document.querySelector("#img").toggleAttribute("hidden");
        document.querySelector("#srcinput").toggleAttribute("hidden");
        registerMouseEvent();
    }
}

function registerMouseEvent() {
    var isMiddleMouseButton = false;
    var currMouseXY = [0.0, 0.0];
    var prevMouseXY = [0.0, 0.0];

    document.addEventListener("mousemove", ev => {
        currMouseXY[0] = ev.clientX;
        currMouseXY[1] = ev.clientY;
    })

    document.addEventListener("mousedown", ev => {
        if (ev.button == 1) {
            ev.preventDefault();
            isMiddleMouseButton = true;
            prevMouseXY[0] = ev.clientX;
            prevMouseXY[1] = ev.clientY;
            image_scroll();
        }

        console.log("window.scrollX : " + window.scrollX);
        console.log("Math.pow(2, zoom) : " + Math.pow(2, zoom));
        console.log("ev.clientX : " + ev.clientX);
    })
    document.addEventListener("mouseup", ev => {
        if (ev.button == 1) {
            ev.preventDefault();
            isMiddleMouseButton = false;
        }
    })
    window.addEventListener("blur", ev => {
        isMiddleMouseButton = false;
    })

    function image_scroll() {
        if (isMiddleMouseButton) requestAnimationFrame(image_scroll);
        window.scrollBy(prevMouseXY[0] - currMouseXY[0],
                        prevMouseXY[1] - currMouseXY[1]);
        prevMouseXY[0] = currMouseXY[0];
        prevMouseXY[1] = currMouseXY[1];
    }

    var zoom = 0.0;
    document.addEventListener("wheel", ev => {
        const zoomDelta = Math.pow(2, zoom + ev.deltaY * -0.005) / Math.pow(2, zoom);

        const befourX = window.scrollX + ev.clientX;
        const befourY = window.scrollY + ev.clientY;
        const afterX = befourX * zoomDelta;
        const afterY = befourY * zoomDelta;
        console.log(afterX, befourX);
        zoom += ev.deltaY * -0.005;

        if (zoomDelta < 1) window.scrollBy(afterX - befourX, afterY - befourY);

        document.querySelector("img").style.width = "calc(100vw * " + Math.pow(2, zoom) + ")"
        document.querySelector("img").style.height = "calc(100vh * " + Math.pow(2, zoom) + ")"
        document.querySelector("#img").style.width = "calc(100vw * " + Math.max(Math.pow(2, zoom), 1) + ")"
        document.querySelector("#img").style.height = "calc(100vh * " + Math.max(Math.pow(2, zoom), 1) + ")"

        if (zoomDelta >= 1) window.scrollBy(afterX - befourX, afterY - befourY);
        
        ev.preventDefault();
    }, {passive: false})
}

document.addEventListener("DOMContentLoaded", ev => {
    main();
})