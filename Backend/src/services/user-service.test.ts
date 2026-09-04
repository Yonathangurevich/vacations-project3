import { expect } from "chai";
import { after, describe, it } from "mocha";
import { CredentialsModel } from "../models/credentials-model";
import { Role } from "../models/enums";
import { UserModel } from "../models/user-model";
import { cyber } from "../utils/cyber";
import { dal } from "../utils/dal";
import { userService } from "./user-service";

// Decode a JWT payload without verifying it, so we can assert on its contents:
function decodePayload(token: string): any {
    const body = token.split(".")[1];
    return JSON.parse(Buffer.from(body, "base64").toString());
}

describe("UserService", () => {

    // A unique email per run, so re-running the suite never collides with itself:
    const testEmail = `test-${Date.now()}@test.com`;
    const testPassword = "1234";

    // Remove whatever this run inserted, so the database is left as we found it:
    after(async () => {
        await dal.execute("delete from users where email = ?", [testEmail]);
    });

    // ---------------------------------------------------------------
    // register
    // ---------------------------------------------------------------
    it("registers a new user, returns a token, and forces the User role", async () => {

        const user = new UserModel({
            firstName: "Test",
            lastName: "User",
            email: testEmail,
            password: testPassword,
            // Deliberately claiming Admin - the service must overrule this:
            roleId: Role.Admin
        } as UserModel);

        const token = await userService.addUser(user);

        expect(token).to.be.a("string");

        const payload = decodePayload(token);
        expect(payload.user.roleId).to.equal(Role.User);
        expect(payload.user.email).to.equal(testEmail);
        expect(payload.user.id).to.be.a("number");
        expect(payload.user.password).to.be.undefined;
    });

    // ---------------------------------------------------------------
    // register - failure
    // ---------------------------------------------------------------
    it("refuses to register an email that is already taken", async () => {

        const duplicate = new UserModel({
            firstName: "Test",
            lastName: "User",
            email: testEmail, // Same email the previous test just inserted.
            password: testPassword
        } as UserModel);

        try {
            await userService.addUser(duplicate);
            expect.fail("Expected a duplicate email to be rejected");
        }
        catch (err: any) {
            expect(err.status).to.equal(409);
        }
    });

    // ---------------------------------------------------------------
    // login
    // ---------------------------------------------------------------
    it("logs in with correct credentials and returns a token without the password", async () => {

        const credentials = new CredentialsModel({
            email: testEmail,
            password: testPassword
        } as CredentialsModel);

        const token = await userService.login(credentials);

        expect(token).to.be.a("string");

        const payload = decodePayload(token);
        expect(payload.user.email).to.equal(testEmail);
        expect(payload.user.password).to.be.undefined;
    });

    // ---------------------------------------------------------------
    // login - failure
    // ---------------------------------------------------------------
    it("refuses to log in with a wrong password", async () => {

        const credentials = new CredentialsModel({
            email: testEmail,
            password: "wrong-password"
        } as CredentialsModel);

        try {
            await userService.login(credentials);
            expect.fail("Expected a wrong password to be rejected");
        }
        catch (err: any) {
            expect(err.status).to.equal(401);
        }
    });

    // ---------------------------------------------------------------
    // password storage
    // This is what stops a database leak from becoming a password leak.
    // ---------------------------------------------------------------
    it("stores the password hashed, never in plain text", async () => {

        const rows = await dal.execute(
            "select password from users where email = ?",
            [testEmail]
        ) as { password: string }[];

        const stored = rows[0].password;

        expect(stored).to.not.equal(testPassword);
        expect(stored).to.equal(cyber.hash(testPassword));
    });

});
