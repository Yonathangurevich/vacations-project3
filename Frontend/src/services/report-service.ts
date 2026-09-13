import axios from "axios";
import { ReportModel } from "../models/report-model";
import { appConfig } from "../utils/app-config";

class ReportService {
	
    public async getVacationReport(): Promise<ReportModel[]> {
        const response = await axios.get<ReportModel[]>(appConfig.reportUrl);
        const reports = response.data;
        return reports; 
    }

    public async getCsvReport(): Promise<void> {
        
        const response = await axios.get<string>(appConfig.reportUrl + "/csv", {
            responseType: "blob"
        });
        
        const blob = new Blob([response.data], { type: "text/csv" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "vacations-report.csv";

        link.click();

        URL.revokeObjectURL(url);

    }

}

export const reportService = new ReportService();
