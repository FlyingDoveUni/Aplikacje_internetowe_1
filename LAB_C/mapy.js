
let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

let rasterMap = document.getElementById("rasterMap");
let rasterContext = rasterMap.getContext("2d");

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        // here we have the canvas


        rasterContext.drawImage(canvas, 0, 0 , 512, 512, 0, 0, 512, 512);


        this.sprite = document.createElement("rasterMap");
    });
});

document.getElementById("start").addEventListener("click", function() {
    const title = document.getElementById("canvasx");
    const target_Container = document.getElementById("targetContainer");
    const puzzle = document.getElementById("singleCanvasX");
    const puzzle_Container = document.getElementById("puzzle")

    const x = 16;

    if(target_Container.childElementCount < x){
        for(let t = 0; t<x ; t++){
            const node = title.cloneNode(true);
            node.hidden = false;
            node.id = String("canvas" + t);
            target_Container.appendChild(node);
        }
        getTarget(target_Container.children);
    }
    if(puzzle_Container.childElementCount < x){
        // node.id=String("singleCanvas");
        for(let p = 0; p<x ; p++){
            const node = puzzle.cloneNode(true);
            node.hidden=false;
            node.id=String("singleCanvas" + p);
            puzzle_Container.appendChild(node);
            if(p>0 && p%Math.floor(Math.random() * 6)){
                let element = document.getElementById("singleCanvas" + (p-1));
                node.after(element);
            }
        }
        getContext()
        getDragable()
    }
});


let permission = Notification.permission;

// if(permission === "granted"){
//     showNotification();
// } else if(permission === "default"){
//     requestAndShowPermission();
// } else {
//     alert("Use normal alert");
// }

function requestAndShowPermission() {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            showNotification();
        }
    });
}
function showNotification() {
    //  if(document.visibilityState === "visible") {
    //      return;
    //  }
    let title = "YOU DID IT";
    let body = "NIIIIIICE";

    let notification = new Notification(title, { body });

    notification.onclick = () => {
        notification.close();
        window.parent.focus();
    }

}

//get this out of here

function isCorrect(i) {
    const tile = document.getElementById("singleCanvas" + i);
    const target = document.getElementById("canvas" + i);
    return tile.parentElement === target;
}
let puzzleAmount = 16;
function checkCompletion() {
    let correct = 0;

    for (let i = 0; i < puzzleAmount; i++) {
        if (isCorrect(i)) {
            correct++;
        }
    }

    if (correct === puzzleAmount) {
        showNotification("done!");
    }
}





function getContext(){
    let index = 0;
    for(let blyat = 0 ; blyat < 4;blyat++){
        for(let next = 0; next < 4;next++) {


            let singleCanvas1 = document.getElementById("singleCanvas" + (index));
            let singleContext1 = singleCanvas1.getContext("2d");

            singleContext1.drawImage(rasterMap, next * 128, blyat * 128, 512, 512, 0, 0, 512, 512);
            index++;
        }
    }
}

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        //popUp
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);

        let marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        marker.bindPopup("<strong>BOO!</strong><br>This is a popup.");

    }, positionError => {
        console.error(positionError);
    });
});
function getDragable() {

    let items = document.querySelectorAll('.item');
    for (let item of items) {
        item.addEventListener("dragstart", function (event) {
            this.style.border = "5px dashed #D8D8FF";
            event.dataTransfer.setData("text", this.id);
        });
        //gdzies tutaj dodac punkt osobny?

        item.addEventListener("dragend", function (event) {
            this.style.borderWidth = "0";
        });
    }
}

function getTarget() {


    let targets = document.querySelectorAll(".drag-target");
    for (let target of targets) {
        target.addEventListener("dragenter", function (event) {
            this.style.border = "2px solid #7FE9D9";
        });
        target.addEventListener("dragleave", function (event) {
            this.style.border = "2px dashed #7f7fe9";
        });
        target.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        target.addEventListener("drop", function (event) {
            let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
            if(this.childElementCount===0){
                this.appendChild(myElement);
            }
            checkCompletion();
            this.style.border = "2px dashed #7f7fe9";
        }, false);
    }
}