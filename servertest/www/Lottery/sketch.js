var prizes = ["1st prize","2nd prize","3rd prize","4th prize","5th prize"]
var probs = [40,25,20,10,5]
var probRndRange = []
var RndFullRange = 0
var dis = []
var pivot = 0
var change = 100
var spacing = 100
var start = false
var leftSpace = 150

function setup(){
    createCanvas(800,800)
    background(0)
    textSize(50)
    fill(255,204,51)
    text("Press button to start",30,750)
    textSize(100)
    calProb()
}

function draw(){
    if (!start){
        //exit draw loop
        return 0
    }
    background(0)
    createBuf()
    for (i=0; i<dis.length; i++){
        //print("displaying")
        //print(dis[i])
        fill(dis[i][1], dis[i][2], dis[i][3])
        text(dis[i][0], leftSpace, i*spacing+pivot)
    }
    fill(dis[3][1], dis[3][2], dis[3][3])
    triangle(600,360,650,310,650,410)
}


function createBuf(){
    //print(pivot)
    //print(change)
    pivot += change
    change -= .5
    if (pivot > spacing){
        pivot = 0
        dis.pop()
        dis.unshift([RndItem(),getRndRgb(),getRndRgb(),getRndRgb()])
    }
    if (change < 0){
        start =  false
        fill(50)
        rect(leftSpace-20, Math.floor((prizes.length)/2)*spacing+pivot+10, 450, 120, 50)
    }
}

function getRndRgb(){
    var a = Math.floor(random(151)) + 100
    //console.log(a)
    return a
}

function RndItem(){
    //print("creating obj")
    let a = Math.floor(random(RndFullRange))
    //print(a)
    for (i=0; i<prizes.length; i++){
        if (a <= probRndRange[i]){
            //print(prizes[i])
            return prizes[i]
        }
    }

}


function GetSum (total, num){
    return total + num
}

function calProb(){
    let currentRange = 0
    for (i=0; i<prizes.length; i++){ // calculate the range for each prize
        currentRange += probs[i]
        probRndRange.push(currentRange)
    }
    RndFullRange = currentRange
    
}

function init(){
    dis = []
    change = 100
    pivot = 0
    for (let i=0; i<=height/spacing+1; i++){
        let a = [RndItem(),getRndRgb(),getRndRgb(),getRndRgb()]
        //print (i)
        dis.push(a)
    }
    //print(dis)
    start = true
}