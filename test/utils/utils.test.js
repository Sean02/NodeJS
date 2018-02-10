const expect = require("expect");
const utils = require("./utils");

it("should add two numbers",()=>{ //bad code
    let res = utils.add(33,11);
    if (res !== 44){
        throw new Error(`Expected 44, but got ${res}`);
    }
});

it("should be the square of the number",()=>{ //the right way to do it
   let res = utils.square(3);
   expect(res).toBe(9).toBeA("number");
});

it("should not expect different values", ()=>{
    expect(0).toNotBe(1);
});

it("should expect some obj", ()=>{
    expect({name:"Sean"}).toEqual({name:"Sean"});
});

it("should include/exclude some value", ()=>{
    expect([2,3,4]).toNotInclude(5);
    expect([2,3,4]).toExclude(5);
    expect({name:"Sean",age:15,location:"here"}).toInclude({age:15});
});

it("should async add 2 numbers", (done)=>{
    utils.asyncAdd(4,3,(sum)=>{
        expect(sum).toBe(7).toBeA("number");
        done();
        });
});