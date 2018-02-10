
var x = 0
var y = 0
var spacing = 10

function setup(){
    createCanvas(windowWidth, windowHeight)
    background(0)
}

function draw(){
    //alert("running draw")
    fill(0)
    noStroke()
    rect(x,y,spacing,spacing)
    stroke(getRndRgb(),getRndRgb(),getRndRgb())
    strokeWeight(2)
    if (random(1)<0.5){
        line(x, y, x+spacing, y+spacing)
    }else{
        line(x, y+spacing, x+spacing, y)
    }
    
    x+=spacing
    
    if (x > width){
        x=0
        y+=spacing
    }
    if (y >= height){
        x=0
        y=0
    }
}

function getRndRgb(){
    var a = random(255)
    //console.log(a)
    return a
}