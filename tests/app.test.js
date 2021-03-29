const request = require("supertest");
const http = require("http");
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
        // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        // process.env. = 'false';

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

describe("Generic /manager endpoint tests", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
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
});

describe("POST /manager/process-csv test", () => {
    let server;
    beforeAll((done) => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("Upload file test", async () => {
      const response = await request(server).post("/account/login")
          .field("email", "arron@usc.edu")
          .field("password", "1234567");
      console.log(response.text);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");

      // Declare a newName contains the timestamp
      const newName = Date.now().toString();
      const filePath = appRoot + `/testing_files/testing.csv`;
      // Make sure you return the request to async execute the tests
      response = await request(server)
            .post('/manager/process-csv')
            .attach('place-csv', filePath);
      expect(response.statusCode).toBe(200);
    });

    test("Database update succeed", async () => {

    });
});
