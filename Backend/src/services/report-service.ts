import { VacationReport } from "../models/vacation-report-model";
import { dal } from "../utils/dal";

class ReportService {

     public async getVacationReport(): Promise<VacationReport[]> {
        
        // sql:
        const sql = `
            select v.destination, count(l.userId) as likesCount
            from vacations as v
            left join likes as l on v.vacationId = l.vacationId
            group by v.vacationId
            order by likesCount desc
        `;

        // get reports
        const reports = await dal.execute(sql) as VacationReport[];

        // return reports
        return reports;
    }

    public async getCsvReport(): Promise<string> {
        
        // sql:
        const sql = `
            select v.destination, count(l.userId) as likesCount
            from vacations as v
            left join likes as l on v.vacationId = l.vacationId
            group by v.vacationId
            order by likesCount desc
        `;

        // get reports
        const reports = await dal.execute(sql) as VacationReport[];

        // create the csv string
        const csv = [
            "destination,likesCount",
            ...reports.map(r => `${r.destination.split(",").join("")},${r.likesCount}`)
        ].join("\n");

        // return csv
        return csv;
        
    }

}

export const reportService = new ReportService();