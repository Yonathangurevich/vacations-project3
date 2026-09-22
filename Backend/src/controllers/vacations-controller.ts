import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { vacationsService } from "../services/vacations-service";
import { cyber } from "../utils/cyber";
import { VacationsFormModel } from "../models/vacations-model";
import { Role, StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import { saver } from "smart-saver";

class VacationsController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getAllVacationsForUser);
        this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, this.getOneVacation);
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations/:vacationId", securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:vacationId", securityMiddleware.verifyAdmin, this.deleteVacation);
        this.router.post("/api/vacations/like/:vacationId", securityMiddleware.verifyLoggedIn, this.likeVacation);
        this.router.delete("/api/vacations/like/:vacationId", securityMiddleware.verifyLoggedIn, this.unlikeVacation);
        this.router.get("/api/vacations/images/:imageName", this.getImage);
    }

    // get all vacation
    private async getAllVacationsForUser(request: Request, response: Response): Promise<void> {
        
        // get jwt token
        const authorization = request.headers.authorization;
        
        // get the userId
        const userId = cyber.decodeJwtTokenUserId(authorization);
        
        // get one vacation
        const vacations = await vacationsService.getAllVacationsForUser(userId);
        
        // send response
        response.json(vacations);
    }

    // get one vacation
    private async getOneVacation(request: Request, response: Response): Promise<void> {
        
        // get the vacationId
        const vacationId = +request.params.vacationId;
        
        // get one vacation
        const vacations = await vacationsService.getOneVacation(vacationId);
        
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

        private async likeVacation(request: Request, response: Response): Promise<void> {

        // get jwt token
        const authorization = request.headers.authorization;

        // admins are not allowed to like vacations:
        if (cyber.decodeJwtTokenRoleId(authorization) === Role.Admin) {
            throw new ClientError(StatusCode.Forbidden, "Admins can't like vacations");
        }

        // get the userId
        const userId = cyber.decodeJwtTokenUserId(authorization);

        // get the vacationId
        const vacationId = +request.params.vacationId;

        // like the vacation
        await vacationsService.likeVacation(vacationId, userId);

        // send response
        response.sendStatus(StatusCode.NoContent);
    }

    private async unlikeVacation(request: Request, response: Response): Promise<void> {

        // get jwt token
        const authorization = request.headers.authorization;

        // get the userId
        const userId = cyber.decodeJwtTokenUserId(authorization);

        // get the vacationId
        const vacationId = +request.params.vacationId;

        // unlike the vacation
        await vacationsService.unlikeVacation(vacationId, userId);

        // send response
        response.sendStatus(StatusCode.NoContent);
    }

    private async getImage(request: Request, response: Response): Promise<void> {

        // get image name from params:
        const imageName = request.params.imageName.toString();
        
        // get image file path:
        const filePath = saver.getFilePath(imageName);

        // send response:
        response.sendFile(filePath);

    }


}

export const vacationsController = new VacationsController();
