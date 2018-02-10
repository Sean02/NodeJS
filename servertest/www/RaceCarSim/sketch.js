class car{
    constructor(id,x,y){
        this.id=id;
        this.x=x;
        this.y=y;
        this.r=this.getRndRGB();
        this.g=this.getRndRGB();
        this.b=this.getRndRGB();
    }

    getRndRGB(){
        //gonna cheat and reuse the rnd code
        return Math.floor(this.getRndSpd(0,240));
    }
    
    drawCar(){
        fill(this.r,this.g,this.b)
        arc(this.x,this.y,20,20,PI,0,PI);
        rect(this.x-20,this.y,40,10);
        arc(this.x-10,this.y+10,10,10,0,PI,PI);
        arc(this.x+10,this.y+10,10,10,0,PI,PI);
    }
    
    getPos(){
        if (this.x > winnerPos[1]){
            winnerPos[0]=this.id;
            winnerPos[1]=this.x;
        }
    }
    
    moveCar(){
        this.x+=this.getRndSpd(spdMin,spdMax); 
        //console.log(spdMax);
    }
    
    getRndSpd(min, max){ 
        //return Math.floor((Math.random() * (max-min+1) + min));;
        //use gaussian rnd function
        return Math.abs(randomGaussian((min+max)/2,max-(min+max)/2));
    }
    
}

var cars = [];
var TimerHandle=[];
var spdMax=15;
var spdMin=1;
var drawNumsVar = -1;
var someoneWon = -1;
var winnerPos = [0,0];

function setup(){
    createCanvas(1500,800);
}

function draw(){
    background(250);
    drawLn();
    drawNums();
    
    cars.forEach(function(item){
        item.drawCar();
        item.getPos();
    })
   
    checkWin();
}

function checkWin(){
    if (winnerPos[1]>width-40+10){
        //we have a winner!
        clearTimers();//freeze
        var drawText="The Winner is Car #" + (cars[winnerPos[0]].id+1);
        fill(cars[winnerPos[0]].r,cars[winnerPos[0]].g,cars[winnerPos[0]].b)
        text(drawText,100,cars[winnerPos[0]].y-32,1000,400);
        rect(width-300,cars[winnerPos[0]].y,200,10);
        triangle(width-100,cars[winnerPos[0]].y+20,width-100,cars[winnerPos[0]].y-10,width-60,cars[winnerPos[0]].y+3);
    }
}


function init(){
        clearTimers();
        winnerPos=[0,0];
        var t = int(document.getElementById('t1').value);
        var spaceBetween = height / (t+1);
        cars = [];
        for (var i=0;i<t;i++){
            cars.push(new car(i,20,(i+1)*spaceBetween));
        }

        //countdown timers
        drawNumsVar=3;
        TimerHandle[0]=setTimeout(function(){drawNumsVar=2;},1000);
        TimerHandle[1]=setTimeout(function(){drawNumsVar=1;},2000);
        TimerHandle[2]=setTimeout(function(){drawNumsVar=0;TimerHandle[4]=setInterval(moveCars,50);},3000);
        TimerHandle[3]=setTimeout(function(){drawNumsVar=-1;},3500);
}

function moveCars(){
    cars.forEach(function(item){
        //alert("rmc");
        item.moveCar();
    })
}

function drawNums(){
    var drawText;
    if (drawNumsVar==-1){
        return 0;
    }else if(drawNumsVar==0){
        fill(255,0,0); 
        drawText="Go";
    }else if(drawNumsVar==1){
        fill(255,0,0); 
        drawText="1";
    }else if(drawNumsVar==2){
        fill(255,153,0); 
        drawText="2";
    }else if(drawNumsVar==3){
        fill(0,255,0);
        drawText="3";
    }
    textFont("Calibri",50);
    text(drawText,(width/2-textWidth(drawText)/2),(height/2-(textAscent(drawText)+textDescent(drawText))/2),400,400);
}

function drawLn(){
    push();//save format
    noStroke();
    fill(200);
    translate(50,0);
    rotate(PI/2);
    rect(0,10,height,40); //start line
    rect(0,50-width,height,40); //finish line
    textFont("Calibri",50);
    fill(150);
    text("Start",height/2-75,45);
    text("Finish",height/2-70,-(width-85));
    
    pop();//restore format
}


function clearTimers(){
    clearInterval(TimerHandle[0]);
    clearInterval(TimerHandle[1]);
    clearInterval(TimerHandle[2]);
    clearInterval(TimerHandle[3]);
    clearInterval(TimerHandle[4]);
}

