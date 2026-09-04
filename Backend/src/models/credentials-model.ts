import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Credentials Schema:
const CredentialsSchema = z.object({
    email: z.email().min(2).max(100),
    password: z.string().min(4).max(100)
});

// Credentials Interface (I = Interface):
type ICredentialsModel = z.infer<typeof CredentialsSchema>;

export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(user: CredentialsModel) {
        this.email = user.email;
        this.password = user.password;
    }

    public validate(): void {
        const result = CredentialsSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
}