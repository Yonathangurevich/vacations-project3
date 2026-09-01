import express, { Request, Response, Router } from "express";
import { dataService } from "../services/data-service";

// Contains routes, without logic.
class DataController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.get("/api/get___", this.get___);
    }

    private async get___(request: Request, response: Response): Promise<void> {
        const data = await dataService.get___();
        response.json(data);
    }

}

export const dataController = new DataController();
