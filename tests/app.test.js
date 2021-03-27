const request = require("supertest");
const http = require("http");
const app = require("../app");

describe("Test the root path", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("It should respond with 404", async () => {
        const response = await request(server).get("/");
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Resource not found");
    });
});

describe("Test the login route", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("It should respond with 404", async () => {
        const response = await request(server).post("/account/login")
            .field("email", "null")
            .field("password", "null");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Username or password incorrect.");
    });
});