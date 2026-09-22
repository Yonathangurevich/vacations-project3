import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

export type VacationCountModel = {
    vacationCount: number;
}

export type VacationPriceStatisticsModel = {
    averagePrice: number; 
    minPrice: number;
    maxPrice: number;
    vacationCount: number;
}

const McpQuestionSchema = z.object({
    question: z.string().min(2).max(100)
});

type IMcpQuestion = z.infer<typeof McpQuestionSchema>;

export class McpQuestionModel implements IMcpQuestion {
    
    question: string;

    public constructor(question: McpQuestionModel) {
        this.question = question.question;
    }
    
    
    public validate(): void {
        const result = McpQuestionSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
} 