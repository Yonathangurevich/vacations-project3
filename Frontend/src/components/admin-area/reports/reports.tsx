import { useEffect, useState } from "react";
import "./reports.css";
import { ReportModel } from "../../../models/report-model";
import { reportService } from "../../../services/report-service";
import { notify } from "../../../utils/notify";
import { VacationReportChart } from "../vacation-report-chart/vacation-report-chart";
import { useAdmin } from "../../../hooks/use-admin";

export function Reports() {

    useAdmin();

    const [reports, setReports] = useState<ReportModel[]>([]);

    useEffect(() => {
        reportService.getVacationReport()
            .then(reports => setReports(reports))
            .catch(err => notify.error(err));
    }, []);

    async function downloadCsv(): Promise<void> {
        try {
            await reportService.getCsvReport();
            notify.success("CSV will start download now!");
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Reports">

            <h2>Vacations Report</h2>

            <VacationReportChart reports={reports} />

            <button onClick={downloadCsv}>Download Csv</button>
        </div>
    );
}


