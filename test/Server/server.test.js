const request = require("supertest");

let app = require("./server.js").app;

it("should return hello world",(done)=>{
    request(app)
        .get("/")
        .expect(200)
        .expect("Hello World!")
        .end(done);
});