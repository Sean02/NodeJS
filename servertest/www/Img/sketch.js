let img
let x = 0
let y = 0
let w = 100
let h = 100
let p = 0

function setup(){
    createCanvas(1800,900)
    background(0)
    img = loadImage("m.jpg")
}

function draw(){
    image(img,x-p,y,w,h)
    x += w
    
    if (x>width-w){
    	y += h
    	x = 0
    }

    if (y>height-h){
    	y = 0
    	if (p==0){
    		p = -w/2
    	}else{
    		p = 0
    	}
    }
}