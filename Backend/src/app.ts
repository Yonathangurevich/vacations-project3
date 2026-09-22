import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { saver } from "smart-saver";
import { userController } from "./controllers/user-controller";
import { errorMiddleware } from "./middleware/error-middleware";
import { loggerMiddleware } from "./middleware/logger-middleware";
import { securityMiddleware } from "./middleware/security-middleware";
import { appConfig } from "./utils/app-config";
import { vacationsController } from "./controllers/vacations-controller";
import { reportController } from "./controllers/report-controller";
import { aiController } from "./controllers/ai-controller";
import { vacationMcpServer } from "./services/mcp-server";
import { sseHandlers } from "express-mcp-handler";
import { mcpController } from "./controllers/mcp-controller";

class App {

    public start(): void {

        // Configure smart-saver - images path:
        saver.config(path.join(__dirname, "assets", "images"));

        // Create our server object:
        const server = express();

        // System middleware:
        securityMiddleware.registerRateLimit(server); // Prevent DoS attacks.
        securityMiddleware.headerProtection(server); // Prevent header attacks.
        server.use(cors()); // Enable CORS.
        server.use(express.json()); // Configure express to create request.body from a given JSON.
        server.use(expressFileUpload()); // Configure express to create request.files from the request.

        // Register "before" middleware: 
        server.use(loggerMiddleware.logToConsole);
        server.use(securityMiddleware.preventXss);

        // Register controllers:
        server.use(userController.router);
        server.use(vacationsController.router);
        server.use(reportController.router);
        server.use(aiController.router);

        // Register MCP server:
        const mcpServer = vacationMcpServer.create();
        const mcpServerController = sseHandlers(() => mcpServer, {});
        server.get("/sse", mcpServerController.getHandler);
        server.post("/sse", mcpServerController.postHandler);
        server.post("/messages", mcpServerController.postHandler);

        server.use(mcpController.router);

        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Run server:
        server.listen(appConfig.port, () => console.log("Listening..."));
    }

}

const app = new App();
app.start();

