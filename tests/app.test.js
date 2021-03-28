const request = require("supertest");
const http = require("http");
const app = require("../app");

describe("Generic web server tests", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("GET test", async () => {
        const response = await request(server).get("/account");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Account endpoint page. This is used to serve all APIs related to account management (registration, log in, etc.).");
    });

    test("404 test", async () => {
        const response = await request(server).get("/");
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Resource not found");
    });

    test("GET on POST route test", async () => {
        const response = await request(server).get("/account/login");
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Resource not found");
    });

    test("Wrong content type on POST route test", async () => {
        const response = await request(server)
            .post("/account/login")
            .send({email: "ttrojan@usc.edu", password: "1234567"});
        expect(response.statusCode).toBe(415);
        expect(response.text).toBe("Wrong form Content-Type. Should be multipart/form-data.");
    });

    test("Missing form data test", async () => {
        const response = await request(server).post("/account/login")
            .field("email", "ttrojan@usc.edu");
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Missing form data.");
    });
});

describe("Account route tests", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("Login success test", async () => {
        const response = await request(server).post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", "1234567");
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
    });

    test("Login failure test", async () => {
        const response = await request(server).post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", "000000");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Username or password incorrect.");
    });
});