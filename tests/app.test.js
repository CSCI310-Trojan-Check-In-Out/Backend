const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
    test("It should respond with 404", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("Resource not found");
    });
});

describe("Test the login route", () => {
    test("It should respond with 404", async () => {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        const response = await request(app).post("/account/login")
            .field("email", "null")
            .field("password", "null");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Username or password incorrect.");
    });
});