import { expect } from "chai";
import express from "express";
import { Server } from "http";
import { after, before, describe, it } from "mocha";
import { errorMiddleware } from "../middleware/error-middleware";
import { Role } from "../models/enums";
import { dal } from "../utils/dal";
import { userController } from "./user-controller";

// We do NOT import app.ts here: it calls listen() at import time and would
// occupy the real port. Instead we mount the same router on a throwaway
// server, so the routes under test are exactly the production ones.
function buildTestServer(): express.Express {
    const server = express();
    server.use(express.json());
    server.use(userController.router);
    server.use(errorMiddleware.routeNotFound);
    server.use(errorMiddleware.catchAll);
    return server;
}

describe("UserController", () => {

    let server: Server;
    let baseUrl: string;

    const testEmail = `ctrl-${Date.now()}@test.com`;
    const testPassword = "1234";

    // Start on port 0 so the OS picks a free port - no clash with a running dev server:
    before(async () => {
        await new Promise<void>(resolve => {
            server = buildTestServer().listen(0, () => {
                const port = (server.address() as any).port;
                baseUrl = `http://localhost:${port}`;
                resolve();
            });
        });
    });

    after(async () => {
        await dal.execute("delete from users where email = ?", [testEmail]);
        await new Promise<void>(resolve => server.close(() => resolve()));
    });

    // ---------------------------------------------------------------
    // POST /api/register
    // ---------------------------------------------------------------
    it("POST /api/register returns 201 and a token", async () => {

        const response = await fetch(`${baseUrl}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: "Ctrl",
                lastName: "Tester",
                email: testEmail,
                password: testPassword
            })
        });

        expect(response.status).to.equal(201);

        const token = await response.json();
        expect(token).to.be.a("string");
    });

    // ---------------------------------------------------------------
    // POST /api/register - validation
    // Proves errors travel through the error middleware as a status code,
    // instead of crashing the server or returning 200.
    // ---------------------------------------------------------------
    it("POST /api/register returns 422 for an invalid email", async () => {

        const response = await fetch(`${baseUrl}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: "Ctrl",
                lastName: "Tester",
                email: "not-an-email",
                password: testPassword
            })
        });

        expect(response.status).to.equal(422);
    });

    // ---------------------------------------------------------------
    // POST /api/login
    // ---------------------------------------------------------------
    it("POST /api/login returns 200 and a token for correct credentials", async () => {

        const response = await fetch(`${baseUrl}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testEmail, password: testPassword })
        });

        expect(response.status).to.equal(200);

        const token = await response.json();
        expect(token).to.be.a("string");
    });

    // ---------------------------------------------------------------
    // POST /api/login - failure
    // ---------------------------------------------------------------
    it("POST /api/login returns 401 for a wrong password", async () => {

        const response = await fetch(`${baseUrl}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testEmail, password: "wrong-password" })
        });

        expect(response.status).to.equal(401);
    });

});
