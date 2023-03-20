<template>
    <div id="base">
        <canvas id="conceptual-map"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useCounterStore } from "@/stores/genericStore"

const gameState = useCounterStore();
let shapeColor;

const props = defineProps({
    newKeyword : Object
});

const emits = defineEmits([
    'processedKeyword'
]);

const base = ref();
const canvas = ref();
const context = ref();
let ctx;

// Canvas element containers
//const shapes = gameState.currentConceptShapes // x, y Starting positions // width, height // color for now // message TO-DO // id like ID and like index at the same time
//const lines = gameState.currentConceptLines; // color // line width // origin shape // origin side // target shape // target side // id just in case
let shapesLength = 0;
let linesLength = 0;

// Number variables for calculations and functionality
let canvasWidth;
let canvasHeight;
let currentShapeIndex = 0;
let currentOriginAnchorIndex = 0;
let currentTargetAnchorIndex = 0;
let startX;
let startY;
let radianProperties = {
        0: {
            start: 0,
            end: 1,
            counterclockwise: false
        },

        1: {
            start: 0.5,
            end: 1.5,
            counterclockwise: false
        },

        2: {
            start: 0,
            end: 1,
            counterclockwise: true
        },

        3: {
            start: 0.5,
            end: 1.5,
            counterclockwise: true
        }
}

// Canvas State Variables
let isDragging = false;
let moved = false;
let drawObjectAnchors = false;
let drawCanvasAnchors = false;

// Canvas Helper Functions
const getFont = function(fontSize) {
    var ratio = canvasWidth / 100;   // calc ratio
    var size = fontSize * ratio;   // get font size based on current width
    return (size|0) + 'px sans-serif'; // set font
}

const getAnchorPoint = function(point, shape){

    let coord = {x: -1, y: -1};

    if (point == 0){
    // Get point from the top of the rectangle
        coord.x = shape.x + (shape.width / 2);
        coord.y = shape.y;

    } else if (point == 1) {
    // Get point from the right side of the rectangle
        coord.x = shape.x + (shape.width);
        coord.y = shape.y + (shape.height / 2);

    } else if (point == 2) {
    // Get point from the bottom of the rectangle
        coord.x = shape.x + (shape.width / 2);
        coord.y = shape.y + (shape.height);

    } else if (point == 3) {
    // Get point from the left side of the rectangle
        coord.x = shape.x;
        coord.y = shape.y + (shape.height / 2);

    }

    return coord;
}

const invertHex = function(hex) {
    let res = (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).slice(1).toUpperCase()
    //console.log(res);
    return res
}

const drawCanvas = function() {
    //console.log("Draw Canvas");

    //console.log("Width: " + canvasWidth)
    //console.log("Width: " + canvasHeight)

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    let factorX = canvasWidth / 100;
    let factorY = canvasHeight / 100;
    
    drawLines(factorX, factorY);
    drawShapes(factorX, factorY);
    if (drawObjectAnchors) drawAnchors(factorX, factorY);
    if (drawCanvasAnchors) drawAllAnchors(factorX, factorY);
    //("Draw canvvas");
    
}

const drawAnchors = function(factorX, factorY) {
    let currentShape = gameState.currentConceptShapes.find((s) => {
        return s.id == currentShapeIndex;
    });

    let radius = currentShape.width * 0.1;

    if (currentShape.width >= 50){
        radius = 4;
    } else if (currentShape.width >= 40){
        radius = 3;
    } else if (currentShape.width >= 30){
        radius = 2.5;
    } else if (currentShape.width >= 20){
        radius = 2
    } else {
        radius = 1;
    }

    for (let i = 0 ; i < 4 ; i++){
        let coord = getAnchorPoint(i, currentShape);

        

        ctx.beginPath();
        ctx.arc(coord.x * factorX, coord.y * factorY, radius * factorX, radianProperties[i].start * Math.PI, radianProperties[i].end * Math.PI, radianProperties[i].counterclockwise);
        ctx.fillStyle = currentShape.inverseColor;
        ctx.fill();
    }

    return;
}

const drawAllAnchors = function(factorX, factorY) {
    for (let currentShape of gameState.currentConceptShapes){

        let radius = currentShape.width * 0.1;

        if (currentShape.width >= 50){
            radius = 4;
        } else if (currentShape.width >= 40){
            radius = 3;
        } else if (currentShape.width >= 30){
            radius = 2.5;
        } else if (currentShape.width >= 20){
            radius = 2
        } else {
            radius = 1;
        }

        for (let i = 0 ; i < 4 ; i++){
            let coord = getAnchorPoint(i, currentShape);

            

            ctx.beginPath();
            ctx.arc(coord.x * factorX, coord.y * factorY, radius * factorX, radianProperties[i].start * Math.PI, radianProperties[i].end * Math.PI, radianProperties[i].counterclockwise);
            ctx.fillStyle = currentShape.inverseColor;
            ctx.fill();
        }
    }

    return;
}

const drawRoundedRect = function(x, y, width, height, r, factorX, factorY){
   
    ctx.beginPath();

    ctx.moveTo((x + r) * factorX, y * factorY);
    ctx.lineTo((x + width - r) * factorX, y * factorY);
    
    ctx.quadraticCurveTo((x + width) * factorX, y * factorY, (x + width) * factorX, (y + r) * factorY);
    
    ctx.lineTo((x + width) * factorX, (y + height - r) * factorY);
    
    ctx.quadraticCurveTo((x + width) * factorX, (y + height) * factorY, (x + width - r) * factorX, (y + height) * factorY);
    
    ctx.lineTo((x + r) * factorX, (y + height) * factorY);

    ctx.quadraticCurveTo(x * factorX, (y + height) * factorY, x * factorX, (y + height - r) * factorY);

    ctx.lineTo(x * factorX, (y + r) * factorY);
    ctx.quadraticCurveTo(x * factorX, y * factorY, (x + r) * factorX, y * factorY);
    ctx.fill();

}

const drawShapes = function(factorX, factorY) {

    for(let shape of gameState.currentConceptShapes) {

        ctx.fillStyle = shape.color;
        // Scale contents of shapes to fit the stytem
        //ctx.fillRect(shape.x * factorX, shape.y * factorY, shape.width * factorX, shape.height * factorY);

        //updateWidths(shape);

        drawRoundedRect(shape.x, shape.y, shape.width, shape.height, 1.5, factorX, factorY);

        ctx.fillStyle = shape.inverseColor;
        let fontSize = 3.5;
        ctx.font = getFont(fontSize);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //console.log(shape.width);
        //console.log(ctx.measureText(shape.content).width);
        ctx.fillText(shape.content, (shape.x + (shape.width / 2)) * factorX, (shape.y + (shape.height / 2)) * factorY);
        //ctx.fill();

    }

    return;
}

const drawLines = function(factorX, factorY) {
    
    for (let line of gameState.currentConceptLines){

        let originShape = gameState.currentConceptShapes.find((s) => { return s.id == line.oid;});
        let targetShape = gameState.currentConceptShapes.find((s) => { return s.id == line.tid;});

        let lineOrigin = getAnchorPoint(line.os, originShape);
        let lineTarget = getAnchorPoint(line.ts, targetShape);

        let drawHorizontallyFirst = (line.os % 2) == 1;
        let thirdLineSegment = (line.os % 2) == (line.ts % 2);

        let totalX = lineTarget.x - lineOrigin.x;
        let totalY = lineTarget.y - lineOrigin.y;
        ctx.lineWidth = line.width;
        if(drawHorizontallyFirst){
            if(thirdLineSegment){
                // seg 1 horiz
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.moveTo(lineOrigin.x * factorX, lineOrigin.y * factorY);
                ctx.lineTo((lineOrigin.x + (totalX * 0.5)) * factorX, lineOrigin.y * factorY);
                // seg 2 vert
                ctx.lineTo((lineOrigin.x + (totalX * 0.5)) * factorX, lineTarget.y * factorY);
                // seg 3 horiz
                ctx.lineTo(lineTarget.x * factorX, lineTarget.y * factorY);
                ctx.stroke();
            } else {
                // seg 1 horiz
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.moveTo(lineOrigin.x * factorX, lineOrigin.y * factorY);
                ctx.lineTo(lineTarget.x * factorX, lineOrigin.y * factorY);
                // seg 2 vert
                ctx.lineTo(lineTarget.x * factorX, lineTarget.y * factorY);
                ctx.stroke();
            }

        } else {
            if(thirdLineSegment){
                // seg 1 vert
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.moveTo(lineOrigin.x * factorX, lineOrigin.y * factorY);
                ctx.lineTo(lineOrigin.x * factorX, (lineOrigin.y + (totalY * 0.5)) * factorY);
                // seg 2 horiz
                ctx.lineTo(lineTarget.x * factorX, (lineOrigin.y + (totalY * 0.5)) * factorY);
                // seg 3 vert
                ctx.lineTo(lineTarget.x * factorX, lineTarget.y * factorY);
                ctx.stroke();
            } else {
                // seg 1 vert
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.moveTo(lineOrigin.x * factorX, lineOrigin.y * factorY);
                ctx.lineTo(lineOrigin.x * factorX, lineTarget.y * factorY);
                // seg 2 horiz
                ctx.lineTo(lineTarget.x * factorX, lineTarget.y * factorY);
                ctx.stroke();
            }
        }

    }

    return;
}

const resizeCanvas = function() {
    //console.log(window);
    
    let smallerDimension;
    if (base.value.clientWidth < base.value.clientHeight){
        //console.log("Prefer Width")
        //console.log(base.value.clientWidth);
        //console.log(base.value.clientHeight);
        canvas.value.style.width = "100%"
        canvas.value.style.height = ""
        smallerDimension = base.value.clientWidth;
    } else {
        //console.log("Prefer Height")
        //console.log(base.value.clientWidth);
        //console.log(base.value.clientHeight);
        canvas.value.style.height = "100%"
        canvas.value.style.width = ""
        smallerDimension = base.value.clientHeight;
    }

    canvas.value.width = smallerDimension;
    canvas.value.height = smallerDimension;

    canvasWidth = canvas.value.width;
    canvasHeight = canvas.value.height;

    drawCanvas();
    
}

const addShape = function(x, y, id, content){
    gameState.addKeyword(x, y, id, 3.5, content, getContentWidth(content));
}

const addLine = gameState.addLine;


function getContentWidth(content) {
    //console.log(ctx.measureText(content));
    return ((ctx.measureText(content).width * 100 / canvasWidth) + 2)
}

onMounted(() => {

    //console.log(gameState.currentConceptShapes);
    //console.log(gameState.currentConceptLines);

    // Set refs to html elements
    base.value = document.querySelector("#base");
    canvas.value = document.querySelector("#conceptual-map");
    context.value = canvas.value.getContext("2d");
    ctx = context.value;
    shapeColor = gameState.prefersDarkTheme ? 'FFFFFF' : '000000';

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('fullscreenchange', resizeCanvas)
    resizeCanvas();

    let fontSize = 3.5;
    ctx.font = getFont(fontSize);
    
    /*
    addShape(40, 10, 1, 'Machine Learning');
    addShape(40, 20, 2, 'Deep Learning');
    addShape(5, 80, 3, 'Types');
    addShape(5, 40, 4, 'Supervised');
    addShape(20, 60, 5, 'ML Example');
    addShape(30, 90, 6, 'Perceptron');
    addShape(60, 50, 7, 'Neural Network');
    //addLine(0, 2, 1, 0, shapeColor, getRandomLineIndex(0, 40));
    //addLine(0, 3, 2, 1, shapeColor, getRandomLineIndex(0, 40));
    */

    canvas.value.onpointerdown = pointerDown;
    canvas.value.onpointerup = pointerUp;
    canvas.value.onpointerout = pointerOut;
    canvas.value.onpointermove = pointerMove;

    drawCanvas();

    watch(gameState.getPreferredTheme, () => {
        shapeColor = gameState.prefersDarkTheme ? 'FFFFFF' : '000000';
        for (let shape of gameState.currentConceptShapes){
            shape.color = '#' + shapeColor;
            shape.inverseColor = '#' + invertHex(shapeColor);
        }
        for (let line of gameState.currentConceptLines){
            line.color = '#' + shapeColor;
        }
        //console.log('water');
        drawCanvas();
    }, { flush: 'post'});

    watch(gameState.currentConceptShapes, () => {
        if (gameState.currentConceptShapes.length == shapesLength) return;
        //console.log('fire');
        //console.log(props.shapes.length);
        //console.log(shapesLength);
        
        shapesLength = gameState.currentConceptShapes.length;
        drawCanvas();
        //console.log("Draw bc shapes updated");
        
    }, { flush: 'post'});

    watch(gameState.currentConceptLines, () => {
        if (gameState.currentConceptLines.length == linesLength) return;
        //console.log('fire');
        //console.log(props.shapes.length);
        //console.log(shapesLength);
        
        linesLength = gameState.currentConceptLines.length;
        drawCanvas();
        //console.log("Draw bc shapes updated");
        
    }, { flush: 'post'});

    /*(props.newKeyword, () => {

        if (props.newKeyword.keyword == undefined || props.newKeyword.keyword == ''){
            drawCanvas();
            return;
        } else {
            //console.log("Got new keyword");
            addShape(40, 80, gameState.currentConceptShapes.length + 1, props.newKeyword.keyword);
            drawCanvas();
            emits('processedKeyword');
        }
        
    }, { flush: 'post'});*/
    
});

onBeforeUnmount(() => {
    //console.log("UNLOAD CONCEPT");
    window.removeEventListener('resize', resizeCanvas); //
    window.removeEventListener('fullscreenchange', resizeCanvas); 
    canvas.value.onpointerdown = null;
    canvas.value.onpointerup = null;
    canvas.value.onpointerout = null;
    canvas.value.onpointermove = null;
})

const getRandomLineIndex = function(min, max) {
    let rand;
    let stop = false;

    while (!stop){
        rand = Math.floor(Math.random() * (max - min) + min);
        if (gameState.currentConceptLines.find((l) => {return rand == l.id}) == undefined){
            stop = true;
        }
    }

    return rand;
}

const removeLine = gameState.removeLine;

const pointerDown = function(e) {

    if (drawObjectAnchors){
        e.preventDefault();
        //isDragging = false;
        //detect if click on anchor of current object
        let rect = e.currentTarget.getBoundingClientRect();
        startX = parseInt(e.clientX) - rect.left;
        startY = parseInt(e.clientY) - rect.top;
            
        if (isPointerInShape(startX, startY, gameState.currentConceptShapes.find((s) => {
        return s.id == currentShapeIndex;
        }))) {
            currentOriginAnchorIndex = getClickedAnchor(startX, startY, gameState.currentConceptShapes.find((s) => {
        return s.id == currentShapeIndex;
        }));
            if (currentOriginAnchorIndex != -1){
                drawObjectAnchors = false;
                drawCanvasAnchors = true;
                
            } else {
                drawObjectAnchors = true;
                drawCanvasAnchors = false;

            }
            
        } else {
            drawObjectAnchors = false;
            drawCanvasAnchors = false;
        }

        drawCanvas();

    } else if (drawCanvasAnchors) {
        e.preventDefault();
        //detect if click on any anchor on another object
        //let currentOriginShapeIndex = currentShapeIndex;
        let rect = e.currentTarget.getBoundingClientRect();
        startX = parseInt(e.clientX) - rect.left;
        startY = parseInt(e.clientY) - rect.top;

        for (let shape of gameState.currentConceptShapes){
            if(shape.id != currentShapeIndex && isPointerInShape(startX, startY, shape)){
                currentTargetAnchorIndex = getClickedAnchor(startX, startY, shape);
                if (currentTargetAnchorIndex != -1) {
                    
                    let newLine = gameState.currentConceptLines.find((l) => {
                        return (
                            (l.oid == currentShapeIndex && l.os == currentOriginAnchorIndex && l.tid == shape.id && l.ts == currentTargetAnchorIndex) || 
                            (l.oid == shape.id && l.os == currentTargetAnchorIndex && l.tid == currentShapeIndex && l.ts == currentOriginAnchorIndex))});
                    
                    if (newLine != undefined){
                        //console.log(gameState.currentConceptLines);
                        //console.log("Recognized not new line");
                        //console.log(newLine);
                        removeLine(newLine);
                    } else {
                        //console.log(gameState.currentConceptLines);
                        //console.log("add");
                        addLine(currentShapeIndex, currentOriginAnchorIndex, shape.id, currentTargetAnchorIndex, getRandomLineIndex(0, 40));
                        //console.log(gameState.currentConceptLines);
                    }
                    //console.log(lines);

                    drawCanvasAnchors = false;
                    currentOriginAnchorIndex = undefined;
                    currentTargetAnchorIndex = undefined;
                    drawCanvas();

                    return;
                }
            }
        }

        drawCanvasAnchors = false;
        currentOriginAnchorIndex = undefined;
        currentTargetAnchorIndex = undefined;
        drawCanvas();

    } else {

        e.preventDefault();
        //console.log(e);
        //console.log("Down");
        let rect = e.currentTarget.getBoundingClientRect();
        startX = parseInt(e.clientX) - rect.left;
        startY = parseInt(e.clientY) - rect.top;

        for (let shape of gameState.currentConceptShapes){            
            if (isPointerInShape(startX, startY, shape)) {
                currentShapeIndex = shape.id;
                isDragging = true;
                // get the newest element first instead of the oldest
                //return; // uncomment this line for the opposite
            }
        }
    }
}

const pointerUp = function(e) {
    if (!isDragging) {
        e.preventDefault();

    } else {

        e.preventDefault();

        if (!moved){
            if (!drawObjectAnchors){
                // make anchors of current object visible
                drawObjectAnchors = true;
            } 

            drawCanvas();
        }
    }
    
    //console.log("Up");
    moved = false;
    isDragging = false;
}

const pointerOut = function(e) {
    if (!isDragging) return;

    e.preventDefault();
    isDragging = false;
}

const pointerMove = function(e) {
    if (!isDragging || drawCanvasAnchors || drawObjectAnchors) return;

    e.preventDefault();
    //console.log("Move");
    moved = true;

    let factorX = canvasWidth / 100;
    let factorY = canvasHeight / 100;

    let rect = e.currentTarget.getBoundingClientRect();
    let mouseX = parseInt(e.clientX) - rect.left;
    let mouseY = parseInt(e.clientY) - rect.top;

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let currentShape = gameState.currentConceptShapes.find((s) => {
        return s.id == currentShapeIndex;
    });
    currentShape.x += dx / factorX;
    currentShape.y += dy / factorY;

    drawCanvas();

    startX = mouseX;
    startY = mouseY;

}

const isPointerInShape = function(x, y, shape) {
    let factorX = canvasWidth / 100;
    let factorY = canvasHeight / 100;

    let shapeLeft = shape.x * factorX;
    let shapeRight = (shape.x + shape.width) * factorX;
    let shapeTop = shape.y * factorY;
    let shapeBottom = (shape.y + shape.height) * factorY;

    /*
    console.log("x: " + x);
    console.log("y: " + y);
    console.log("Left: " + shapeLeft);
    console.log("Right: " + shapeRight);
    console.log("Top: " + shapeTop);
    console.log("Bottom: " + shapeBottom);
    */

    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom){
        return true;
    }

    return false;

}

const getClickedAnchor = function(x, y, shape){
    let factorX = canvasWidth / 100;
    let factorY = canvasHeight / 100;
    for (let i = 0 ; i < 4 ; i++){
        let anchor = getAnchorPoint(i, shape);

        let aX;
        let aY;

        let shapeLeft;
        let shapeRight;
        let shapeTop;
        let shapeBottom;

        let radius = 0;

        if (shape.width >= 50){
            radius = 4;
        } else if (shape.width >= 40){
            radius = 3;
        } else if (shape.width >= 30){
            radius = 2.5;
        } else if (shape.width >= 20){
            radius = 2
        } else {
            radius = 1;
        }

        if (i == 0){
        // Get point from the top of the rectangle

            // define x and y of anchor as a rectangle
            aX = anchor.x - radius;
            aY = anchor.y;

            shapeLeft = aX * factorX;
            shapeRight = (aX + (2 * radius)) * factorX;
            shapeTop = aY * factorY;
            shapeBottom = (aY + radius) * factorY;


        } else if (i == 1) {
        // Get point from the right side of the rectangle
            aX = anchor.x - radius;
            aY = anchor.y - radius;

            shapeLeft = aX * factorX;
            shapeRight = (aX + radius) * factorX;
            shapeTop = aY * factorY;
            shapeBottom = (aY + (2 * radius)) * factorY;

        } else if (i == 2) {
        // Get point from the bottom of the rectangle

            // define x and y of anchor as a rectangle
            aX = anchor.x - radius;
            aY = anchor.y - radius;

            shapeLeft = aX * factorX;
            shapeRight = (aX + (2 * radius)) * factorX;
            shapeTop = aY * factorY;
            shapeBottom = (aY + radius) * factorY;

        } else if (i == 3) {
        // Get point from the left side of the rectangle
            aX = anchor.x;
            aY = anchor.y - radius;

            shapeLeft = aX * factorX;
            shapeRight = (aX + radius) * factorX;
            shapeTop = aY * factorY;
            shapeBottom = (aY + (2 * radius)) * factorY;
        }

        if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom){
            //console.log("Clicked anchor: " + i);
            return i;
        }
    }


    return -1;
}

</script>

<style scoped>
#base {

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
    height: 100%;
    min-width: 200px;
}

#conceptual-map {
    
    background: var(--aj-glass-background);
    border-radius: var(--aj-glass-border-radius);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
    min-width: 200px;
    aspect-ratio: 1 / 1;
}
</style>