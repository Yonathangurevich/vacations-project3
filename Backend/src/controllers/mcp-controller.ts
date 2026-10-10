import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { McpQuestionModel } from "../models/vacation-mcp-model";
import { mcpGptService } from "../services/mcp-gpt-service";

class McpController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/mcp/vacations", securityMiddleware.verifyLoggedIn, this.getAnswer);
    }

    private async getAnswer(request: Request, response: Response): Promise<void> {
        const questionModel = new McpQuestionModel(request.body);
        questionModel.validate();
        const answer = await mcpGptService.getAnswer(questionModel.question);
        response.json(answer);
    }

}

export const mcpController = new McpController();