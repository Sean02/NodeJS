const expect = require("expect");
const rewire = require("rewire");

let app = rewire("./index.js");
// app.__set__();

describe("Spy",()=>{
    let db = {saveUser:expect.createSpy()};
    app.__set__("db",db);


    it("should call spy correctly",()=>{
        let spy = expect.createSpy();
        spy("Sean",15);
        expect(spy).toHaveBeenCalled().toHaveBeenCalledWith("Sean",15);
    });

    it("should call saveUser with user obj",()=>{
        let email = "a@b.c";
        let password = "123";
        app.handleSignup(email,password);
        expect(db.saveUser).toHaveBeenCalledWith({email,password});
    });
});