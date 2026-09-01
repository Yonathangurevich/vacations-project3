import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Data Schema:
const DataSchema = z.object({
    id: z.number().int().positive().optional(),
});

// Data Interface (I = Interface):
type IDataModel = z.infer<typeof DataSchema>;

// Data Model:
export class DataModel implements IDataModel {

    public id: number;

    public constructor(Data: DataModel) { // Copy Constructor
        this.id = Data.id;
    }

    public validate(): void {
        const result = DataSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
    
}
