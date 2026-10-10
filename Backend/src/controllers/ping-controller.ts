import express, {Request, Response, Router} from "express";
import { StatusCode } from "../models/enums";

class PingController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/ping", this.ping);
    }

    // for docker's healthcheck:
    private async ping(request: Request, response: Response): Promise<void> {
        response.sendStatus(StatusCode.OK);
    }

}

export const pingController = new PingController();
