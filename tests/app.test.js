const request = require("supertest");
const http = require("http");
const crypto = require("crypto");
const app = require("../app");

const manager_post_endpoints = ['/process-csv', '/add-place', '/remove-place',
  '/update-capacity', '/get-qr-code', '/search-visit-history', '/list-all-buildings', '/list-current-students', '/view-profile'];

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
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
    });

    test("Login failure test", async () => {
        const response = await request(server).post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('0').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Username or password incorrect.");
    });

    test("Login / Logout test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/account/logout")
            .field("email", "ttrojan@usc.edu");
        expect(response2.statusCode).toBe(200);
        expect(response2.text).toBe("OK");
    });

    test("Unauthorized session test", async () => {
        const userEndpoints = ['/logout', '/changePassword', '/deleteAccount', '/updateProfilePicture'];
        for(key in userEndpoints) {
            const response = await request(server).post("/account" + userEndpoints[key])
                .field("email", "ttrojan@usc.edu");
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("The client is not logged in.");
        }
    });
});

describe("Student route tests", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("Check in / Check out test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/student/checkin")
            .field("qrCodeToken", "b0c3a5cf-f526-43cc-bdaf-2862ffa46e38");
        expect(response2.statusCode).toBe(200);
        expect(response2.type).toBe("application/json");

        const response3 = await agent.post("/student/checkout")
            .field("qrCodeToken", "b0c3a5cf-f526-43cc-bdaf-2862ffa46e38");
        expect(response3.statusCode).toBe(200);
        expect(response3.text).toBe("OK");
    });

    test("Invalid QR Code test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/student/checkin")
            .field("qrCodeToken", "INVALID");
        expect(response2.statusCode).toBe(400);
        expect(response2.text).toBe("Invalid token or capacity full.");
    });

    test("Existing visit history test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/student/checkin")
            .field("qrCodeToken", "b0c3a5cf-f526-43cc-bdaf-2862ffa46e38");
        expect(response2.statusCode).toBe(200);

        const response3 = await agent.post("/student/checkin")
            .field("qrCodeToken", "b0c3a5cf-f526-43cc-bdaf-2862ffa46e38");
        expect(response3.statusCode).toBe(400);
        expect(response3.text).toBe("The client has unfinished check-in history. Please check out first.");

        await agent.post("/student/checkout")
            .field("qrCodeToken", "b0c3a5cf-f526-43cc-bdaf-2862ffa46e38");
    });

    test("Past history test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/student/pastHistory")
            .field("lookupTimeStr", "360000");
        expect(response2.statusCode).toBe(200);
        expect(response2.type).toBe("application/json");
    });
});

describe("Manager generic endpoint tests", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("Manager GET endpoint", async () => {
        const response = await request(server).get("/manager");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Manager endpoint page. This is used to serve all APIs related to manager clients (upload CSV, view / edit history, etc.).");
    });


    test("Manager endpoints wrong POST content types", async () => {
      for(let i = 0; i < manager_post_endpoints.length; ++i){
        const response = await request(server)
            .post('/manager' + manager_post_endpoints[i])
            .send({});
        expect(response.statusCode).toBe(415);
        expect(response.text).toBe("Wrong form Content-Type. Should be multipart/form-data.");
      }
    });

    test("Manager endpoint not login endpoints", async () => {
      for(let i = 0; i < manager_post_endpoints.length; ++i){
        const response = await request(server)
            .post('/manager' + manager_post_endpoints[i])
            .field("dummy", "dummy");
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("The client is not logged in.");
      }
    });
});

describe("Manager process-csv test", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
        request(server).post("/account/login")
            .send({email: "ttrojan@usc.edu", password: "1234567"});

    });

    afterAll((done) => {
        server.close(done);
    });

    test("Manager GET endpoint", async () => {
        const response = await request(server).get("/manager");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Manager endpoint page. This is used to serve all APIs related to manager clients (upload CSV, view / edit history, etc.).");
    });


    test("Manager endpoints wrong POST content types", async () => {
      for(let i = 0; i < manager_post_endpoints.length; ++i){
        const response = await request(server)
            .post('/manager' + manager_post_endpoints[i])
            .send({});
        expect(response.statusCode).toBe(415);
        expect(response.text).toBe("Wrong form Content-Type. Should be multipart/form-data.");
      }
    });

    test("Manager endpoint not login endpoints", async () => {
      for(let i = 0; i < manager_post_endpoints.length; ++i){
        const response = await request(server)
            .post('/manager' + manager_post_endpoints[i])
            .field("dummy", "dummy");
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("The client is not logged in.");
      }
    });
});
