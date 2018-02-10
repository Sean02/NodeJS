let initTime
let MainTimer
//___________buf___________
let pivot = 0
let pivotSpd = 0.05
let dis = " "
let prevDis = ""
let pos //[x, y, draw_function requested width]
let siz = 60
let XspaceInBetween = 35
let YspaceInBetween = 100
//_________________________



function setup(){
    createCanvas(windowWidth, windowHeight)
    background(255)
    fill(0)
    textFont("Calibri",siz)
    //print ("If 'new Date().getTime()'worked, it should have a test output below...")
    //print (new Date().getTime())
    //print (FormatSeconds(new Date().getTime()/1000))
    pos = [width/2,height/2]
    initTime = new Date().getTime() //-7190000//2h/- 3598000// //add a headstart here
    Update()
    MainTimer = setInterval(function(){ Update() }, 200);
}

function Update(){
    let t = Math.floor((new Date().getTime()-initTime)/1000)
    if (dis == FormatSeconds(t)){
        return 0
    }
    prevDis = dis
    pivot = 0
    dis = FormatSeconds(t)
    //print(dis)
}



function draw(){
    //translate(0,height/2)
    background(255)
    dis = dis.toString()
    pos[2] = dis.length*XspaceInBetween //request width
    pos[0] = width/2 - pos[2]/2//reset x
    pos[1] = height/2 - YspaceInBetween/4*3
    //print(dis+" "+dis.length)
    for (i=0; i<dis.length; i++){
        //if (prevDis.length >= i+1){
            //item exists
            var d = dis.charAt(i)
            var p = prevDis.charAt(i)
            //print("processing d= "+d)

            if (d == p){
                //item the same, no animation
                printNum(d, i, 0)
            }else{
                //changed, ANIMATION!!! go according to pivot
                printNum(d, Math.abs(0-i), pivot - 1)
                printNum(p, Math.abs(0-i), pivot)
                ////printNum(d - 2, Math.abs(0-i), pivot + 1)
                // //print(dis.length-i) // need to split it into individual characters
            }
        //}
    }
    if (pivot < 1){
        pivot += pivotSpd
        ////print (pivot)
    }else{
        pivot = 1
    }
    //put this last: draw the boundaries:
    noStroke()
    fill(255)
    //rect(0,0,pos[0],height)
    rect(0,0,width,pos[1]-YspaceInBetween/4*3)
    rect(0,pos[1]+YspaceInBetween/4,width,YspaceInBetween+1)
    //rect(pos[0]+pos[2],pos[1]-YspaceInBetween/4*3-1,width,YspaceInBetween+2)
}


function printNum(num, xPos, yPos){//the number to //print, xPos compared to default(x), 1=XspaceInBetween, yPos compared to default(y), 1 = YspaceInBetween
    fill(0)
    text(num.toString(), pos[0]+xPos*XspaceInBetween, pos[1]+yPos*YspaceInBetween)
}

function FormatSeconds(sec){ //[sec, min, hrs, day]
    //let ans = []
    let ansPlain = "" //todo
    let secL = sec // seconds left
    let d = Math.floor(secL /60 /60 /24)
    secL -= d * (60 *60 *24)
    let h = Math.floor(secL /60 /60)
    secL -= h * (60 *60)
    let m = Math.floor(secL /60)
    secL -= m * (60)
    // let s = secL
    
    if (d > 0){
        //ans = [secL,m,h,d]
        //todo//check if missing "0"
        if(secL<10){secL="0"+secL}
        if(h<10){h="0"+h}
        if(m<10){m="0"+m}
        if(d<10){d="0"+d}
        ansPlain = d +":" +h +":" +m +" " +secL
    }else if(h > 0){
        //ans = [secL,m,h]
        if(secL<10){secL="0"+secL}
        if(h<10){h="0"+h}
        if(m<10){m="0"+m}
        ansPlain = h +":" +m +":" +secL
    }else if(m > 0){
        //ans = [secL,m]
        if(secL<10){secL="0"+secL}
        if(m<10){m="0"+m}
        ansPlain = m +":" +secL
    }else{ // s > 0
        //ans = [secL]
        if(secL<10){secL="0"+secL}
        ansPlain = secL
    }
    //return ans
    //print("in FormatSeconds: ans= "+ansPlain)
    return ansPlain
}