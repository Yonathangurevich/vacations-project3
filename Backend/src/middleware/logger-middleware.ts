import { NextFunction, Request, Response } from "express";
import colors from "colors/safe";

class LoggerMiddleware {

    // Pass-Through Middleware:
    public logToConsole(request: Request, response: Response, next: NextFunction): void {
        const method = request.method;
        const route = request.originalUrl;
        const body = request.body ?? null;
        
        // Create a copy of the body with the masked password if it exists
        const safeBody = body?.password 
            ? { ...body, password: "*".repeat(body.password.length) } 
            : body;
        console.log(colors.green(`${method} ${route} | body: ${safeBody ? JSON.stringify(safeBody) : 'null'}`));

        next(); // Continue to next middleware / controller
    }

}

export const loggerMiddleware = new LoggerMiddleware();
