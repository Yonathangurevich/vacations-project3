import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { VacationRequestModel } from "../models/vacation-request-model";
import { promptService } from "../services/prompt-service";

class AiController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.post("/api/ai/recommendations", securityMiddleware.verifyLoggedIn, this.getRecommendations);
    }

    // Get AI travel recommendations for a destination:
    private async getRecommendations(request: Request, response: Response): Promise<void> {

        // building the request model
        const vacationRequest = new VacationRequestModel(request.body);

        // get the recommendations
        const guide = await promptService.getRecommendations(vacationRequest);

        // send response
        response.json(guide);
    }

}

export const aiController = new AiController();
