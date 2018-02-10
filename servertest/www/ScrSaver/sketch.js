let prevDir1 = 0
let prevDir2 = 0
let dir1 = 15
let dir2 = 10
let x = dir1
let y = dir2
let boxH = 100
let boxW = 150





function setup(){
    createCanvas(1800,900)
    background(0)
    fill(255)
}

function draw(){
    if (((x >= width-boxW) && (y >= height-boxH)) || ((x <= 0)  && (y <= 0))){
        alert("THE BOX IS AT A CORNER!!!!!!!!!!")
    }
    background(0)
    CreateBuf()
    CreateBox()

}

function CreateBuf(){
    x+=dir1
    y+=dir2

    if ((x >= width-boxW) || (x <= 0)){
        dir1 *= -1
        fill(RndRGB(), RndRGB(), RndRGB())
    }

    if ((y >= height-boxH) || (y <= 0)){
        dir2 *= -1
        fill(RndRGB(),RndRGB(),RndRGB())
    }

}


function CreateBox(dir1, dir2){
    rect (x,y,boxW,boxH)
}

function RndRGB(){
    return Math.floor(random(155)) + 100
}