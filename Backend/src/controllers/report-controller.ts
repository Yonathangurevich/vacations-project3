import express, {Request, Response, Router} from "express";
import { reportService } from "../services/report-service";
import { securityMiddleware } from "../middleware/security-middleware";

class ReportController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/report", securityMiddleware.verifyAdmin, this.getVacationReport);
        this.router.get("/api/report/csv", securityMiddleware.verifyAdmin, this.getCsvReport);
    }

    private async getVacationReport(request: Request, response: Response): Promise<void> {
        
        // get vacation reports
        const report = await reportService.getVacationReport();
        
        // return reponse
        response.json(report);
    }

    private async getCsvReport(request: Request, response: Response): Promise<void> {
        
        // get csv content
        const csv = await reportService.getCsvReport();
        
        // response with csv
        response
            .setHeader("Content-Type", "text/csv")
            .setHeader("Content-Disposition", 'attachment; filename="users.csv"')
            .send(csv);
    }

}

export const reportController = new ReportController();