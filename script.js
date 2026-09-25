// vars
    let canvas = document.getElementById("gameSurface");
    let levelSelect = document.getElementById("levelSelect");
    let startLevelBtn = document.getElementById("startLevelBtn");
    let resetDataBtn = document.getElementById("resetDataBtn");
    let distanceDisplay = document.getElementById("distance");
    let avargeDistanceDisplay = document.getElementById("avargeDistance");
    let createLevelBtn = document.getElementById("createLevelBtn");
    let gameTimerDisplay = document.getElementById("game-timer");
    let gameTimerNum = document.getElementById("timer-value");
    let ctx = canvas.getContext("2d");

    let canvaWidth = 700;
    let canvaHeight = 700;
    let xOrigin = 0;
    let yOrigin = 0;
    let distanceArr = [];
    let currGraph = [];
    let currLevel;
    let mouseTracking = false;
    zoneWidth = 0;
    gameTimer = 5;
    zone = false 
    zoneSpeed = 50;

    // level
    let levels = [
        [
            [0, 0, 700, 600],
        ],
        [
            [0, 60, 200, 500],
            [200, 500, 350, 400],
            [350, 400, 700, 500],
        ],
        [
            [0, 600, 50, 300],
            [50, 300, 400, 400],
            [400, 400, 600, 700],
            [600, 700, 700, 300]
        ],
        [
            [0, 600, 200, 200],
            [200, 200, 300, 700],
            [300, 700, 400, 500],
            [400, 500, 600, 520],
            [600, 520, 700, 300]
        ],
    ];
    // main methode 
    main();
    
   
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// functions 
function main() {
    createLvlSelect();
    createCanva();
    createLvl(levels[0]);
}

// create select for levels function
function createLvlSelect() {
    for (let i = 0; i < levels.length; i++) {
        document.getElementById("levelSelect").innerHTML += "<option value='" + i + "'>Level " + i + "</option>";
    }
    currLevel = 0;
}

// create Level function
function createLvl(level) {
    for (let i = 0; i < level.length; i++) {
        createGraph(level[i][0], level[i][1], level[i][2], level[i][3]);
    }
}

// create canva function
function createCanva() {
    canvas.width = canvaWidth;
    canvas.height = canvaHeight;
    ctx.fillStyle = "#FFE4B5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// create Graph function
function createGraph(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, varY(startY));
    ctx.lineTo(endX, varY(endY));
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// change y
function varY(input) {
    return canvaHeight - input;
}

// calculate distance function
function calcDistance(x1, y1, x2, y2, pX, pY) {
    let m1 = (y2 - y1) / (x2 - x1);
    let m2 = -1 /m1;
    let n1 = y1 - (m1 * x1);
    let n2 = pY - (m2 * pX);
    let sX = (n2-n1) / (m1-m2);
    let sY = m1 * sX + n1;
    let distance = Math.sqrt((sX - pX)**2 + (sY - pY)**2);
    return distance; 
}

// set current Graph function 
function setCurrGraph(pointer, level) {
    for (let i = 0; i < level.length; i++) {
        if (pointer >= level[i][0] && pointer <= level[i][2]) {
            currGraph[0] = level[i][0];
            currGraph[1] = level[i][1];
            currGraph[2] = level[i][2];
            currGraph[3] = level[i][3];
            return;
        }
    }
}

// mouse tracking function 
function mouseTracker() {
    let pointerX = event.offsetX;
    let pointerY =   event.offsetY;
   // console.log('X: ' + pointerX + ' Y: ' + pointerY);
    setCurrGraph(pointerX, levels[currLevel]);
    let distance = calcDistance(currGraph[0], currGraph[1], currGraph[2], currGraph[3], pointerX, varY(pointerY))
    distanceArr.push(distance);
    let avargeDistance = calcAvargeDistance();
   // console.log("Abstand: " + distance);
    distanceDisplay.innerHTML = Math.round(distance * 1000) / 1000;
    avargeDistanceDisplay.innerHTML = Math.round(avargeDistance * 1000) / 1000;
    checkZone(pointerX);
}

// check pointer in Zone
function checkZone(pointer, ) {
    if(pointer < zoneWidth) {
        // pointer inside zone
        console.log("zu langsam");
        start_stopMouseTracking();
        zone = false;
        zoneWidth = 0;
    } else if (pointer >= canvaWidth - 1) {
        // level finished
        console.log("finished level");
        start_stopMouseTracking();
        zone = false;
        zoneWidth = 0;
    }
}

// calculate avarge distance function
function calcAvargeDistance() {
    let avargeDistance = 0;
    for (let i = 0; i < distanceArr.length; i++) {
        avargeDistance += distanceArr[i];
    }
    avargeDistance = avargeDistance / distanceArr.length;
    return avargeDistance;
}

// start/stop mouse tracking function 
function start_stopMouseTracking() {
    if (!mouseTracking) {
        mouseTracking = true;
    } else if (mouseTracking) {
        mouseTracking = false;
    }
}

// keybinds function
function keyBinds(key) {
    switch (key) {
        case " ":
            // mouse tracker stop/start mit Leertaste
            start_stopMouseTracking();
            break;
        default:
            break;
    }
}

// reset Data function
function resetData() {
    distanceArr = [];
    distanceDisplay.innerHTML = "-";
    avargeDistanceDisplay.innerHTML = "-";
}

// select Level function    
function selectLevel(level) {
    currLevel = parseInt(level);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createCanva(); 
    distanceArr = [];
    createLvl(levels[currLevel]);
}

// create Zone function
function createZone() {
    zoneWidth += 1;
    ctx.clearRect(0, 0, canvaWidth, canvaHeight);
    createCanva();
    createLvl(levels[currLevel]);
    ctx.fillStyle = "rgba(240, 77, 77, 0.25)";
    ctx.fillRect(0, 0, zoneWidth, canvaHeight);
    if (zoneWidth > canvaWidth || zone ==  false) {
        return false;
    } else {
        setTimeout(createZone, zoneSpeed);
    }
}

// start Zone function
function startZone() {
    setTimeout(createZone, 1000);
    zone = true;
}

// Game Timer function
function startGameTimer() {
    gameTimer = parseInt(gameTimer) - 1; 
    gameTimerNum.innerHTML = gameTimer;
    console.log(gameTimer);
    if(gameTimer <= 0) {
        clearInterval(gameTimerInterval);
        gameTimerDisplay.classList.add("hidden");
        gameTimer = 5;
    }
}

// start level function
function startLevel(params) {
    gameTimerNum.innerHTML = gameTimer;
    gameTimerDisplay.classList.remove("hidden");
    gameTimerInterval = setInterval(startGameTimer, 1000);
    setTimeout(start_stopMouseTracking, gameTimer * 1000);
    setTimeout(startZone, (gameTimer + 1) * 1000);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// eventListeners

//Mouse Tracker
canvas.addEventListener("mousemove", (event) => {
    if (mouseTracking) {
        mouseTracker();
    }
});

//select Level
levelSelect.addEventListener("change", (event) => {
    selectLevel(event.target.value);
});

// startLevel Btn
startLevelBtn.addEventListener("click", (event) => {
    startLevel();
});

// tastenSteuerung
document.addEventListener("keydown", (event) => {
    event.preventDefault();
    keyBinds(event.key);
})

// reset Data Btn
resetDataBtn.addEventListener("click", (event) => {
   resetData();
})


