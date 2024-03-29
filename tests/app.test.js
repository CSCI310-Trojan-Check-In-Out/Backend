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
        const response = await request(server).get("/notfound");
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
        // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        // process.env. = 'false';

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

    test("Change password test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('1').digest('hex'));
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/account/changePassword")
            .field("oldPassword", crypto.createHash('md5').update('1').digest('hex'))
            .field("newPassword", crypto.createHash('md5').update('2').digest('hex'));
        expect(response2.statusCode).toBe(200);
        expect(response2.text).toBe("OK");

        const response3 = await agent.post("/account/logout")
            .field("email", "ttrojan@usc.edu");
        expect(response3.statusCode).toBe(200);
        expect(response3.text).toBe("OK");

        const response4 = await agent.post("/account/login")
            .field("email", "ttrojan@usc.edu")
            .field("password", crypto.createHash('md5').update('2').digest('hex'));
        expect(response4.statusCode).toBe(200);
        expect(response4.type).toBe("application/json");

        await agent.post("/account/changePassword")
            .field("oldPassword", crypto.createHash('md5').update('2').digest('hex'))
            .field("newPassword", crypto.createHash('md5').update('1').digest('hex'));
        await agent.post("/account/logout")
            .field("email", "ttrojan@usc.edu");
    });

    test("Register / deleteAccount test", async () => {
        let agent = request.agent(server);
        const response = await agent.post("/account/register")
            .field("fullName", "John Doe")
            .field("uscId", "1234567")
            .field("password", crypto.createHash('md5').update('1').digest('hex'))
            .field("email", "jd@usc.edu")
            .field("isAdmin", "0")
            .field("major", "Computer Science");
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");

        const response2 = await agent.post("/account/deleteAccount")
            .field("email", "jd@usc.edu");
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
            .field("qrCodeToken", "bee5b55d-32a9-47c8-8782-713a29001716");
        expect(response2.statusCode).toBe(200);
        expect(response2.type).toBe("application/json");

        const response3 = await agent.post("/student/checkout")
            .field("qrCodeToken", "bee5b55d-32a9-47c8-8782-713a29001716");
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
            .field("qrCodeToken", "b0c3a5cf-f526-43cc-bdaf-2862ffa46e39");
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
            .field("qrCodeToken", "bee5b55d-32a9-47c8-8782-713a29001716");
        expect(response2.statusCode).toBe(200);

        const response3 = await agent.post("/student/checkin")
            .field("qrCodeToken", "bee5b55d-32a9-47c8-8782-713a29001716");
        expect(response3.statusCode).toBe(400);
        expect(response3.text).toBe("The client has unfinished check-in history. Please check out first.");

        await agent.post("/student/checkout")
            .field("qrCodeToken", "bee5b55d-32a9-47c8-8782-713a29001716");
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

describe("Manager route tests", () => {
    let server;
    let agent;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
        agent = request.agent(server);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("GET /manager/ endpoint", async () => {
        const response = await request(server).get("/manager");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Manager endpoint page. This is used to serve all APIs related to manager clients (upload CSV, view / edit history, etc.).");
    });


    test("POST /manager/* endpoints wrong content types", async () => {
      for(let i = 0; i < manager_post_endpoints.length; ++i){
        if(manager_post_endpoints[i] === '/list-all-buildings'){
          continue;
        }
        const response = await request(server)
            .post('/manager' + manager_post_endpoints[i])
            .send({});
        expect(response.statusCode).toBe(415);
        expect(response.text).toBe("Wrong form Content-Type. Should be multipart/form-data.");
      }
    });

    test("POST /manager/* not login endpoints", async () => {
      for(let i = 0; i < manager_post_endpoints.length; ++i){
        const response = await request(server)
            .post('/manager' + manager_post_endpoints[i])
            .field("dummy", "dummy");
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("The client is not logged in.");
      }
    });

    test("Invalid view profile", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      response = await agent.post('/manager/view-profile').field("dummy", "dummy");
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("Missing studentId.");
    });

    test("View profile succeed", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      response = await agent.post('/manager/view-profile')
                            .field("studentId", "1");
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });

    test("Invalid search visit history", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      response = await agent.post('/manager/search-visit-history')
                            .field("dummy", "dummy")
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("Missing form data.");
    });

    test("Search visit history succeed", async () => {
      var response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      response = await agent.post('/manager/search-visit-history')
                            .field("username", "tom");

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });

    test("Get qr code succeed", async () => {
      var response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      response = await agent.post('/manager/get-qr-code')
                            .field("placeId", "1");

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });

    test("List current students succeed", async () => {
      var response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      response = await agent.post('/manager/list-current-students')
                            .field("placeId", "1");

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });

    test("List all buildings succeed", async() => {
      var response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      response = await agent.post('/manager/list-all-buildings')

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });
});

describe("POST /manager/process-csv tests", () => {
    let server;
    let agent;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
        agent = request.agent(server);

    });

    afterAll((done) => {
        server.close(done);
    });
    test("Upload wrong file fail", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      const filePath = appRoot + `/testing_files/wrong_file.png`;
      // Make sure you return the request to async execute the tests
      response = await agent.post('/manager/process-csv').set({connection: 'keep-alive'})
            .attach('place-csv', filePath);
      expect(response.statusCode).toBe(422);
    });


    test("Upload file succeed", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      const filePath = appRoot + `/testing_files/testing.csv`;
      // Make sure you return the request to async execute the tests
      response = await agent.post('/manager/process-csv').set({connection: 'keep-alive'})
            .attach('place-csv', filePath);
      expect(response.statusCode).toBe(200);

    });

    test("Database update succeed", async () => {
      var response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      response = await agent.post('/manager/list-all-buildings').field("dummy", "dummy");
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      for(let i = 0; i < response.body.length; ++i){
          if(response.body[i].abbreviation === 'RTH'){
            return;
          }
      }
      fail();
    });
});

describe("POST /manager/update-capacity tests", () => {
    let server;
    let agent;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
        agent = request.agent(server);
    });

    afterAll((done) => {
        server.close(done);
    });
    test("Invalid fields", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      response = await agent.post('/manager/update-capacity')
                            .field("placeId", "1");
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("Missing form data.");

      response = await agent.post('/manager/update-capacity')
                            .field("capacity", "1");
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("Missing form data.");
    });


    test("Too small capacity", async () => {
      var response = await agent.post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'))
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      response = await agent.post('/manager/update-capacity')
                            .field("placeId", "1")
                            .field("capacity", "-1");
      expect(response.text).toBe("Cannot update because it is not greater than current number.");

    });

    test("Successful Update", async () => {
      var response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", crypto.createHash('md5').update('1').digest('hex'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
      response = await agent.post('/manager/update-capacity')
                            .field("placeId", "1")
                            .field("capacity", "312");
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe("Capacity Updated.");
    });
});
