import { expect } from "chai";
import express from "express";
import { Server } from "http";
import { after, before, describe, it } from "mocha";
import { errorMiddleware } from "../middleware/error-middleware";
import { Role } from "../models/enums";
import { cyber } from "../utils/cyber";
import { dal } from "../utils/dal";
import { reportController } from "./report-controller";

function buildTestServer(): express.Express {
    const server = express();
    server.use(express.json());
    server.use(reportController.router);
    server.use(errorMiddleware.routeNotFound);
    server.use(errorMiddleware.catchAll);
    return server;
}

const adminToken = cyber.generateToken({ userId: 1, email: "admin@vacations.com", roleId: Role.Admin } as any);
const userToken = cyber.generateToken({ userId: 2, email: "john@vacations.com", roleId: Role.User } as any);

describe("ReportController", () => {

    let server: Server;
    let baseUrl: string;

    before(async () => {
        await new Promise<void>(resolve => {
            server = buildTestServer().listen(0, () => {
                baseUrl = `http://localhost:${(server.address() as any).port}`;
                resolve();
            });
        });
    });

    after(async () => {
        await new Promise<void>(resolve => server.close(() => resolve()));
    });

    // ---------------------------------------------------------------
    // GET /api/report
    // Feeds the chart: destination on X, likes on Y.
    // ---------------------------------------------------------------
    it("GET /api/report returns one row per vacation with a numeric like count", async () => {

        const response = await fetch(`${baseUrl}/api/report`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        expect(response.status).to.equal(200);

        const report = await response.json();
        expect(report).to.be.an("array");

        // every vacation must appear, including ones nobody liked -
        // an INNER JOIN here would silently drop them:
        const total = await dal.execute("select count(*) as c from vacations") as any[];
        expect(report.length).to.equal(total[0].c);

        expect(report[0].destination).to.be.a("string");
        expect(report[0].likesCount).to.be.a("number");
    });

    it("GET /api/report counts likes correctly", async () => {

        const report = await (await fetch(`${baseUrl}/api/report`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        })).json();

        // compare the endpoint against the raw truth in the likes table:
        const truth = await dal.execute(`
            select v.destination, count(l.userId) as likesCount
            from vacations as v
            left join likes as l on v.vacationId = l.vacationId
            group by v.vacationId
        `) as any[];

        const reportTotal = report.reduce((sum: number, r: any) => sum + r.likesCount, 0);
        const truthTotal = truth.reduce((sum: number, r: any) => sum + Number(r.likesCount), 0);

        expect(reportTotal).to.equal(truthTotal);
    });

    // ---------------------------------------------------------------
    // GET /api/report/csv
    // The headers are the whole point - without them the browser renders
    // the text instead of saving a file.
    // ---------------------------------------------------------------
    it("GET /api/report/csv is served as a downloadable csv file", async () => {

        const response = await fetch(`${baseUrl}/api/report/csv`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        expect(response.status).to.equal(200);
        expect(response.headers.get("content-type")).to.contain("text/csv");
        expect(response.headers.get("content-disposition")).to.contain("attachment");
    });

    it("GET /api/report/csv produces one clean row per vacation", async () => {

        const csv = await (await fetch(`${baseUrl}/api/report/csv`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        })).text();

        const lines = csv.trim().split("\n");

        const total = await dal.execute("select count(*) as c from vacations") as any[];
        expect(lines.length).to.equal(total[0].c + 1); // + header row

        expect(lines[0]).to.equal("destination,likesCount");

        // Destinations contain commas ("Rome, Italy"). Unless they are escaped
        // or stripped, a row splits into three columns and Excel misreads it.
        // Every data row must therefore have exactly one separating comma:
        for (const line of lines.slice(1)) {
            const unquoted = line.replace(/"[^"]*"/g, "");
            expect(unquoted.split(",").length).to.equal(2);
        }
    });

    // ---------------------------------------------------------------
    // Both report routes are admin-only, per the spec.
    // ---------------------------------------------------------------
    it("refuses both report routes to a regular user", async () => {
        const headers = { Authorization: `Bearer ${userToken}` };
        expect((await fetch(`${baseUrl}/api/report`, { headers })).status).to.equal(403);
        expect((await fetch(`${baseUrl}/api/report/csv`, { headers })).status).to.equal(403);
    });

    it("refuses both report routes with no token", async () => {
        expect((await fetch(`${baseUrl}/api/report`)).status).to.equal(403);
        expect((await fetch(`${baseUrl}/api/report/csv`)).status).to.equal(403);
    });

});
