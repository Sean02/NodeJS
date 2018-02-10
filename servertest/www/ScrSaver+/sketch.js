let boxes
let img

function setup(){
    img = loadImage("./d.jpg")
    boxes = []
    createCanvas(1800,900) //1800,900
    background(0)
    fill(255)
    for (i=0; i<2; i++){
        boxes.push(new Box())
    }
}

function draw(){
    background(0)
    boxes.forEach(
        function myFunction(item, index, arr) {
            item.draw()
        }
    )
}

function mouseClicked() {
    let exit = false;
    boxes.forEach(
        function myFunction(item, index, arr) {
            if (item.inRange(mouseX,mouseY)==true){
                boxes.splice(index, 1)
                exit = true
                return
            }
        }
    )

    if (!exit){
        boxes.push(new Box())
    }
}



class Box{

    constructor(){
        this.imgH = 100
        this.imgW = 150
        this.x = Math.floor(random(width-this.imgH))
        this.y = Math.floor(random(height-this.imgW))
        this.spdW = Math.floor(random(5,15))
        this.spdH = Math.floor(random(3,13))
        this.r = this.RndRGB()
        this.g = this.RndRGB()
        this.b = this.RndRGB()
    }

    draw(){
        if ( ((this.x >= width-this.imgW) && (this.y >= height-this.imgH)) || ((this.x <= 0)  && (this.y <= 0)) || ((this.x >= width-this.imgW) && (this.y <= 0)) || ((this.x <= 0)  && (this.y >= height-this.imgH)) ){
            alert("THE BOX IS AT A CORNER!!!!!!!!!!")
        }//this is done at the start of the second frame, so the last draw could refresh and stick
        this.CreateBuf()
        this.CreateBox()
    }

    CreateBuf(){
        this.x += this.spdW
        this.y += this.spdH

        if ((this.x >= width-this.imgW) || (this.x <= 0)){
            this.spdW *= -1
            this.r = this.RndRGB()
            this.g = this.RndRGB()
            this.b= this.RndRGB()
            if (this.x <= 0){
                this.x+=1
            }else{
                this.x-=1
            }
        }

        if ((this.y >= height-this.imgH) || (this.y <= 0)){
            this.spdH *= -1
            this.r = this.RndRGB()
            this.g = this.RndRGB()
            this.b = this.RndRGB()
            if (this.y <= 0){
                this.y+=1
            }else{
                this.y-=1
            }
        }

    }

    CreateBox(spdW, spdH){
        tint(this.r, this.g, this.b)
        image(img,this.x,this.y,this.imgW,this.imgH)
    }

    inRange(x, y){
        return ((x>=this.x) && (y>=this.y) && (x<=this.x+this.imgW) && (y<=this.y+this.imgH))
    }

    RndRGB(){
        return Math.floor(random(155)) + 100
    }

}