let p = 30;
let total = 0;
let trueTimes = 0;

let guessP = 0;
let generations = [];

function unknownNum(){
    return (Math.random() * 100 <= p);
}

function RndNum(a) {
    return (Math.random() * 100 <= a);
}

setInterval(main, 10);


function main() {
    learn();
    // total += 1;
    // if (RndNum()) {
    //     trueTimes += 1;
    // }
    // console.log(Math.floor(trueTimes / total * 1000) / 10 + "%");
}


function learn(){
    if (unknownNum() === RndNum()){

    }
}