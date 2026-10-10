import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Vacation Schema:
const VacationRequestSchema = z.object({
    destination: z.string().min(2).max(40)
});

// Vacation Interface (I = Interface):
type IVacationRequestModel = z.infer<typeof VacationRequestSchema>;

export class VacationRequestModel implements IVacationRequestModel {
    
    destination: string;

    public constructor(request: VacationRequestModel) {
        this.destination = request.destination;
    }

    public validate(): void {
        const result = VacationRequestSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
}

// section type model
export type AiSectionModel = {
    emoji: string;
    title: string;
    intro: string;
    highlights: string[];
    tip: string;
}

// The whole guide, as the model returns it:
export type AiResponseModel = {
    title: string;
    sections: AiSectionModel[];
}