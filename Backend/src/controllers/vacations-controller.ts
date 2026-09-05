import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { vacationsService } from "../services/vacations-service";
import { cyber } from "../utils/cyber";
import { VacationsFormModel } from "../models/vacations-model";
import { StatusCode } from "../models/enums";

class VacationsController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
       this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getVacationsByUserId);
       this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, this.getOneVacation);
       this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
       this.router.put("/api/vacations/:vacationId", securityMiddleware.verifyAdmin, this.updateVacation);
       this.router.delete("/api/vacations/:vacationId", securityMiddleware.verifyAdmin, this.deleteVacation);
    }

    private async getVacationsByUserId(request: Request, response: Response): Promise<void> {
        
        // get jwt token
        const authorization = request.headers.authorization;
        
        // get the userId
        const userId = cyber.decodeJwtTokenUserId(authorization);
        
        // get one vacation
        const vacations = await vacationsService.getVacationsByUserId(userId);
        
        // send response
        response.json(vacations);
    }

    private async getOneVacation(request: Request, response: Response): Promise<void> {
        
        // get the vacationId
        const userId = +request.params.vacationId;
        
        // get one vacation
        const vacations = await vacationsService.getOneVacation(userId);
        
        // send response
        response.json(vacations);
    }

    private async addVacation(request: Request, response: Response): Promise<void> {

        // pushing the uploaded image to the body
        request.body.image = request.files?.image;
        
        // building vacation model
        const vacation = new VacationsFormModel(request.body);

        // create new vacation
        const dbVacation = await vacationsService.addVacation(vacation);
        
        // send response
        response.status(StatusCode.Created).json(dbVacation);

    }

    private async updateVacation(request: Request, response: Response): Promise<void> {

        // pushing the uploaded image to the body
        request.body.image = request.files?.image;

        // pushing the vacationId from the url to the body
        request.body.vacationId = +request.params.vacationId;

        // building vacation model
        const vacation = new VacationsFormModel(request.body);

        // update the vacation
        const dbVacation = await vacationsService.updateVacation(vacation);

        // send created vacation
        response.json(dbVacation);
    }

    private async deleteVacation(request: Request, response: Response): Promise<void> {

        // get vacationId:
        const vacationId = +request.params.vacationId;
        
        // delete vacation
        await vacationsService.deleteVacation(vacationId);
        
        // send response
        response.sendStatus(StatusCode.NoContent);
    }

}

export const vacationsController = new VacationsController();
