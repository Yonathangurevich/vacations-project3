import { expect } from "chai";
import express from "express";
import expressFileUpload from "express-fileupload";
import fs from "fs";
import { Server } from "http";
import path from "path";
import { after, before, describe, it } from "mocha";
import { saver } from "smart-saver";
import { errorMiddleware } from "../middleware/error-middleware";
import { Role } from "../models/enums";
import { cyber } from "../utils/cyber";
import { dal } from "../utils/dal";
import { vacationsController } from "./vacations-controller";

// Same router the real app mounts, on a throwaway server so the dev server
// can keep running on port 4000 while these tests execute:
function buildTestServer(): express.Express {
    const server = express();
    server.use(express.json());
    server.use(expressFileUpload());
    server.use(vacationsController.router);
    server.use(errorMiddleware.routeNotFound);
    server.use(errorMiddleware.catchAll);
    return server;
}

// Tokens are built directly - these tests are about vacations, not about login:
const adminToken = cyber.generateToken({ userId: 1, firstName: "Admin", lastName: "Istrator", email: "admin@vacations.com", password: "", roleId: Role.Admin } as any);
const userToken = cyber.generateToken({ userId: 2, firstName: "John", lastName: "Doe", email: "john@vacations.com", password: "", roleId: Role.User } as any);

const IMAGES_FOLDER = path.join(__dirname, "..", "assets", "images");

// A multipart body, because every write route takes form-data, not JSON:
function form(fields: Record<string, string>, withImage = false): FormData {
    const data = new FormData();
    for (const key in fields) data.append(key, fields[key]);
    if (withImage) data.append("image", new Blob([new Uint8Array([255, 216, 255, 224])], { type: "image/jpeg" }), "test.jpg");
    return data;
}

describe("VacationsController", () => {

    let server: Server;
    let baseUrl: string;

    // Everything this suite creates, so `after` can remove it:
    const createdVacationIds: number[] = [];
    const createdImageNames: string[] = [];

    before(async () => {
        saver.config(IMAGES_FOLDER);
        await new Promise<void>(resolve => {
            server = buildTestServer().listen(0, () => {
                baseUrl = `http://localhost:${(server.address() as any).port}`;
                resolve();
            });
        });
    });

    // Leave the database and the images folder exactly as we found them:
    after(async () => {
        for (const vacationId of createdVacationIds) {
            await dal.execute("delete from vacations where vacationId = ?", [vacationId]);
        }
        for (const imageName of createdImageNames) {
            const filePath = path.join(IMAGES_FOLDER, imageName);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await new Promise<void>(resolve => server.close(() => resolve()));
    });

    // Create a vacation through the API and register it for cleanup:
    async function createVacation(overrides: Record<string, string> = {}): Promise<any> {
        const response = await fetch(`${baseUrl}/api/vacations`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({
                destination: "Test Destination",
                description: "A description long enough to pass validation.",
                startDate: "2027-05-01",
                endDate: "2027-05-10",
                price: "1450",
                ...overrides
            }, true)
        });
        const vacation = await response.json();
        if (vacation?.vacationId) {
            createdVacationIds.push(vacation.vacationId);
            createdImageNames.push(vacation.imageName);
        }
        return vacation;
    }

    // ---------------------------------------------------------------
    // GET /api/vacations
    // The single most important response in the app - it drives every card.
    // ---------------------------------------------------------------
    it("GET /api/vacations returns every vacation, sorted by start date, in wire shape", async () => {

        const response = await fetch(`${baseUrl}/api/vacations`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).to.equal(200);

        const vacations = await response.json();
        expect(vacations).to.be.an("array");
        expect(vacations.length).to.be.greaterThan(0);

        // price must be a number, not the string MySQL returns for DECIMAL:
        expect(vacations[0].price).to.be.a("number");

        // dates must be plain YYYY-MM-DD, and must NOT be shifted by timezone:
        expect(vacations[0].startDate).to.match(/^\d{4}-\d{2}-\d{2}$/);

        // isLiked must be a real boolean, not MySQL's 0/1:
        expect(vacations[0].isLiked).to.be.a("boolean");

        // the client should not have to build image URLs itself:
        expect(vacations[0].imageUrl).to.be.a("string");

        // sorted ascending by start date, as the spec requires:
        const startDates = vacations.map((v: any) => v.startDate);
        expect(startDates).to.deep.equal([...startDates].sort());
    });

    // ---------------------------------------------------------------
    // Dates must survive the round trip.
    // toISOString() in a GMT+2 timezone silently shifts every date one day
    // earlier - this asserts the stored date is the date returned.
    // ---------------------------------------------------------------
    it("GET /api/vacations returns the same dates that are stored, with no timezone shift", async () => {

        const created = await createVacation({ startDate: "2027-06-15", endDate: "2027-06-20" });

        const response = await fetch(`${baseUrl}/api/vacations`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const vacations = await response.json();
        const found = vacations.find((v: any) => v.vacationId === created.vacationId);

        expect(found.startDate).to.equal("2027-06-15");
        expect(found.endDate).to.equal("2027-06-20");
    });

    // ---------------------------------------------------------------
    // isLiked is per-user, and likesCount is global.
    // Confusing the two is invisible until someone else logs in.
    // ---------------------------------------------------------------
    it("GET /api/vacations reports isLiked for the requesting user only", async () => {

        const created = await createVacation();

        // John (userId 2) likes it, Dana (userId 3) does not:
        await dal.execute("insert into likes (userId, vacationId) values (2, ?)", [created.vacationId]);

        const danaToken = cyber.generateToken({ userId: 3, roleId: Role.User } as any);

        const asJohn = await (await fetch(`${baseUrl}/api/vacations`, { headers: { Authorization: `Bearer ${userToken}` } })).json();
        const asDana = await (await fetch(`${baseUrl}/api/vacations`, { headers: { Authorization: `Bearer ${danaToken}` } })).json();

        const johnsView = asJohn.find((v: any) => v.vacationId === created.vacationId);
        const danasView = asDana.find((v: any) => v.vacationId === created.vacationId);

        expect(johnsView.isLiked).to.be.true;
        expect(danasView.isLiked).to.be.false;

        // the count is the same for both - it is everyone's likes:
        expect(johnsView.likesCount).to.equal(1);
        expect(danasView.likesCount).to.equal(1);
    });

    // ---------------------------------------------------------------
    // POST /api/vacations
    // ---------------------------------------------------------------
    it("POST /api/vacations creates a vacation and stores a generated image name", async () => {

        const vacation = await createVacation({ destination: "Created City" });

        expect(vacation.vacationId).to.be.a("number");
        expect(vacation.destination).to.equal("Created City");

        // the stored name must be the generated uuid, never the uploaded file name:
        expect(vacation.imageName).to.not.equal("test.jpg");
        expect(vacation.imageName).to.match(/^[0-9a-f-]{36}\.jpg$/);

        // and the file must actually exist on disk:
        expect(fs.existsSync(path.join(IMAGES_FOLDER, vacation.imageName))).to.be.true;
    });

    // ---------------------------------------------------------------
    // Validation rules the spec states explicitly.
    // Each of these must be enforced on the server, whatever the form does.
    // ---------------------------------------------------------------
    it("POST /api/vacations rejects a price above 10,000", async () => {
        const response = await fetch(`${baseUrl}/api/vacations`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "Too Expensive", description: "A valid description here.", startDate: "2027-05-01", endDate: "2027-05-10", price: "99999" }, true)
        });
        expect(response.status).to.equal(422);
    });

    it("POST /api/vacations rejects an end date before the start date", async () => {
        const response = await fetch(`${baseUrl}/api/vacations`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "Backwards", description: "A valid description here.", startDate: "2027-05-10", endDate: "2027-05-01", price: "100" }, true)
        });
        expect(response.status).to.equal(422);
    });

    it("POST /api/vacations rejects a start date in the past", async () => {
        const response = await fetch(`${baseUrl}/api/vacations`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "Time Travel", description: "A valid description here.", startDate: "2020-01-01", endDate: "2020-01-10", price: "100" }, true)
        });
        expect(response.status).to.equal(422);
    });

    it("POST /api/vacations rejects a request with no image", async () => {
        const response = await fetch(`${baseUrl}/api/vacations`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "No Image", description: "A valid description here.", startDate: "2027-05-01", endDate: "2027-05-10", price: "100" })
        });
        expect(response.status).to.equal(422);
    });

    // ---------------------------------------------------------------
    // PUT /api/vacations/:id
    // The image is optional here, and past dates ARE allowed - both are
    // deliberate differences from add, and both are easy to break.
    // ---------------------------------------------------------------
    it("PUT /api/vacations/:id keeps the existing image when no new one is sent", async () => {

        const created = await createVacation();

        const response = await fetch(`${baseUrl}/api/vacations/${created.vacationId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "Edited", description: "An edited description.", startDate: "2027-07-01", endDate: "2027-07-10", price: "500" })
        });

        expect(response.status).to.equal(200);

        const updated = await response.json();
        expect(updated.destination).to.equal("Edited");
        expect(updated.price).to.equal(500);

        // the image must be untouched:
        expect(updated.imageName).to.equal(created.imageName);
        expect(fs.existsSync(path.join(IMAGES_FOLDER, created.imageName))).to.be.true;
    });

    it("PUT /api/vacations/:id replaces the image and deletes the old file", async () => {

        const created = await createVacation();

        const response = await fetch(`${baseUrl}/api/vacations/${created.vacationId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "New Image", description: "An edited description.", startDate: "2027-07-01", endDate: "2027-07-10", price: "500" }, true)
        });

        const updated = await response.json();
        createdImageNames.push(updated.imageName);

        expect(updated.imageName).to.not.equal(created.imageName);

        // the old file must be gone, or the folder grows forever:
        expect(fs.existsSync(path.join(IMAGES_FOLDER, created.imageName))).to.be.false;
    });

    it("PUT /api/vacations/:id allows past dates, because a finished vacation can be edited", async () => {

        const created = await createVacation();

        const response = await fetch(`${baseUrl}/api/vacations/${created.vacationId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "Past Edit", description: "An edited description.", startDate: "2020-01-01", endDate: "2020-01-10", price: "500" })
        });

        expect(response.status).to.equal(200);
    });

    it("PUT /api/vacations/:id returns 404 for a vacation that does not exist", async () => {
        const response = await fetch(`${baseUrl}/api/vacations/999999`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: form({ destination: "Ghost", description: "A valid description here.", startDate: "2027-05-01", endDate: "2027-05-10", price: "100" })
        });
        expect(response.status).to.equal(404);
    });

    // ---------------------------------------------------------------
    // DELETE /api/vacations/:id
    // ---------------------------------------------------------------
    it("DELETE /api/vacations/:id removes the vacation and its likes", async () => {

        const created = await createVacation();
        await dal.execute("insert into likes (userId, vacationId) values (2, ?)", [created.vacationId]);

        const response = await fetch(`${baseUrl}/api/vacations/${created.vacationId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        expect(response.status).to.equal(204);

        const rows = await dal.execute("select * from vacations where vacationId = ?", [created.vacationId]) as any[];
        expect(rows.length).to.equal(0);

        // the foreign key must cascade, or orphan likes accumulate:
        const likes = await dal.execute("select * from likes where vacationId = ?", [created.vacationId]) as any[];
        expect(likes.length).to.equal(0);
    });

    it("DELETE /api/vacations/:id returns 404 for a vacation that does not exist", async () => {
        const response = await fetch(`${baseUrl}/api/vacations/999999`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        expect(response.status).to.equal(404);
    });

    // ---------------------------------------------------------------
    // Likes - the core user action in the whole spec.
    // ---------------------------------------------------------------
    it("POST and DELETE /api/vacations/:id/like add and remove exactly one like", async () => {

        const created = await createVacation();

        const liked = await fetch(`${baseUrl}/api/vacations/${created.vacationId}/like`, {
            method: "POST",
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(liked.status).to.equal(204);

        let rows = await dal.execute("select * from likes where vacationId = ?", [created.vacationId]) as any[];
        expect(rows.length).to.equal(1);

        const unliked = await fetch(`${baseUrl}/api/vacations/${created.vacationId}/like`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(unliked.status).to.equal(204);

        rows = await dal.execute("select * from likes where vacationId = ?", [created.vacationId]) as any[];
        expect(rows.length).to.equal(0);
    });

    it("POST /api/vacations/:id/like refuses a second like from the same user", async () => {

        const created = await createVacation();
        const url = `${baseUrl}/api/vacations/${created.vacationId}/like`;

        await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${userToken}` } });
        const second = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${userToken}` } });

        expect(second.status).to.equal(409);

        const rows = await dal.execute("select * from likes where vacationId = ?", [created.vacationId]) as any[];
        expect(rows.length).to.equal(1);
    });

    it("POST /api/vacations/:id/like refuses an admin, per the spec", async () => {

        const created = await createVacation();

        const response = await fetch(`${baseUrl}/api/vacations/${created.vacationId}/like`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        expect(response.status).to.equal(403);
    });

    // ---------------------------------------------------------------
    // Guards.
    // Every protected page in the spec rests on these.
    // ---------------------------------------------------------------
    it("rejects requests with no token", async () => {
        expect((await fetch(`${baseUrl}/api/vacations`)).status).to.equal(401);
    });

    it("rejects a forged token", async () => {
        const response = await fetch(`${baseUrl}/api/vacations`, {
            headers: { Authorization: "Bearer not.a.real.token" }
        });
        expect(response.status).to.equal(401);
    });

    it("refuses admin-only writes to a regular user", async () => {

        const created = await createVacation();
        const headers = { Authorization: `Bearer ${userToken}` };

        const posted = await fetch(`${baseUrl}/api/vacations`, {
            method: "POST", headers,
            body: form({ destination: "Sneaky", description: "A valid description here.", startDate: "2027-05-01", endDate: "2027-05-10", price: "100" }, true)
        });
        expect(posted.status).to.equal(403);

        const deleted = await fetch(`${baseUrl}/api/vacations/${created.vacationId}`, { method: "DELETE", headers });
        expect(deleted.status).to.equal(403);
    });

});
