import {
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ReportModel } from "../../../models/report-model";
import "./vacation-report-chart.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type VacationReportChartProps = {
	 reports: ReportModel[];
};

export function VacationReportChart(props: VacationReportChartProps) {

    // X axis: destination. Y axis: how many likes that vacation has.
    const data = {

        labels: props.reports.map(r => r.destination),

        datasets: [
            {
                label: "Likes",
                data: props.reports.map(r => r.likesCount),
                backgroundColor: "#4e7fff"
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 }
            }
        }
    };

    return (
        <div className="VacationReportChart">

			<Bar data={data} options={options} />

        </div>
    );
}
