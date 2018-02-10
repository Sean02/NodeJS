let r = 0
let g = 0
let b = 0
//points
let p = [[255,255,255], [255,0,0], [0,255,255], [0,255,0], [255,0,255], [0,0,255], [255,218,185], [0,0,0], [153,153,255], [255,255,0]]
let s = 0 //status
let spdU = 100 //spd for user to set
let spd = (1/spdU)*10000
let spdP = spd //[same format as spd] spd that user changed to which is pending, equal to spd means no change
let progress = spd //%
let ri = 0
let gi = 0
let bi = 0


function setup(){
    createCanvas(2000,1500)
    background(0)
}

function draw(){
    CreateBuf()
    background(r,g,b)
    //text("hi",0,0)
    fill((255-r), (255-g), (255-b))
    text("color "+ (s+1).toString() + "/" + p.length.toString() + "  Prog:" + (Math.round(progress/spd*100000)/1000).toString() + "%\nR:" + r.toString() + "\nG:" +g.toString() + "\nB:" + b.toString() + "\nR inc:" + ri.toString() + "\nG inc:" + gi.toString() + "\nB inc:" + bi.toString(), 0, 10)
   // text(, 0, 20)
    //print(s.toString()+" "+r.toString()+" "+g.toString()+" "+b.toString())
    //print(ri.toString()+" "+gi.toString()+" "+bi.toString())
}

function CreateBuf(){
    if (progress >= spd){// to point, set new goal
        //check if need to change spd
        if (!(spd == spdP)){
            spd = spdP
        }
        let thiss = s
        let nexts = s + 1
        print (thiss)
        print(nexts)

        if (nexts > p.length-1){
            nexts = 0
        }

        progress = 0
        s = nexts

        //make sure r,g,b is exactly at the value
        r = p[thiss][0]
        g = p[thiss][1]
        b = p[thiss][2]

        //set interval
        ri = (p[nexts][0] - p[thiss][0]) / spd
        gi = (p[nexts][1] - p[thiss][1]) / spd
        bi = (p[nexts][2] - p[thiss][2]) / spd


    }else{//just add the increment


        progress += 1
        r += ri
        g += gi
        b += bi

    }

}

function changeSpd(){
    let ans = prompt("Enter a number. New speed will apply at next color. (num+ -> spd+; num- -> spd-)\nCurrent Speed: "+spdU.toString())
    if (!(ans == "")){
        spdU = parseInt(ans)
        spdP = (1/spdU)*10000
    }
    progress = spd
}

function add(){
    let ans = prompt("Input the color(s) you want to add in RGB (three 0-255 numbers). Separate colors with commma(,), separate RGB numbers with space. \nFor ex.: 185 204 98,254 10 25")
    let colors = ans.split(",")

    colors.forEach(function(item){
        let nums = item.split(" ")
        // nums.forEach(function(item){
        //         item = Number(item)

        //     }
        // )
        p.push([parseInt(nums[0]), parseInt(nums[1]), parseInt(nums[2])])
        }
    )
    
}

function mouseClicked(){
    progress = spd
}