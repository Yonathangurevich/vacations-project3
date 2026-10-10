import express, { Request, Response, Router } from "express";
import { CredentialsModel } from "../models/credentials-model";
import { StatusCode } from "../models/enums";
import { UserModel } from "../models/user-model";
import { userService } from "../services/user-service";

class UserController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.post("/api/register", this.addUser);
        this.router.post("/api/login", this.login);
    }

    // Add user:
    private async addUser(request: Request, response: Response): Promise<void> {
        const user = new UserModel(request.body);
        const token = await userService.addUser(user);
        response.status(StatusCode.Created).json(token);
    }

    // Login:
    private async login(request: Request, response: Response): Promise<void> {
        const credentials = new CredentialsModel(request.body);
        const token = await userService.login(credentials);
        response.json(token);
    }
}

export const userController = new UserController();
