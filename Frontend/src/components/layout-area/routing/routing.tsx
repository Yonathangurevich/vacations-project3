import { Navigate, Route, Routes } from "react-router-dom";
import { Reports } from "../../admin-area/reports/reports";
import { McpQuestions } from "../../ai-area/mcp-questions/mcp-questions";
import { Recommendation } from "../../ai-area/recommendation/recommendation";
import { Page404 } from "../../pages-area/page404/page404";
import { AdminGuard } from "../../security-area/admin-guard/admin-guard";
import { AuthGuard } from "../../security-area/auth-guard/auth-guard";
import { GuestGuard } from "../../security-area/guest-guard/guest-guard";
import { SignIn } from "../../user-area/sign-in/sign-in";
import { SignUp } from "../../user-area/sign-up/sign-up";
import { AddVacation } from "../../vacations-area/add-vacation/add-vacation";
import { EditVacation } from "../../vacations-area/edit-vacation/edit-vacation";
import { Vacations } from "../../vacations-area/vacations/vacations";

export function Routing() {

    return (
        <Routes>

            {/* Default Route: */}
            <Route path="/" element={<Navigate to="/vacations" />} />

            {/* vacations: */}
            <Route path="/vacations" element={<AuthGuard><Vacations /></AuthGuard>} />

            {/* Sign up: */}
            <Route path="/signup" element={<GuestGuard><SignUp /></GuestGuard>} />

            {/* Sign in: */}
            <Route path="/signin" element={<GuestGuard><SignIn /></GuestGuard>} />

            {/* Add a vacation - admin only: */}
            <Route path="/vacations/new" element={<AdminGuard><AddVacation /></AdminGuard>} />

            {/* Edit a vacation - admin only: */}
            <Route path="/vacations/edit/:vacationId" element={<AdminGuard><EditVacation /></AdminGuard>} />

            {/* Reports - admin only: */}
            <Route path="/reports" element={<AdminGuard><Reports /></AdminGuard>} />

            {/* AI recommendation: */}
            <Route path="/recommendation" element={<AuthGuard><Recommendation /></AuthGuard>} />

            {/* MCP questions: */}
            <Route path="/mcp" element={<AuthGuard><McpQuestions /></AuthGuard>} />

            {/* Page not found: */}
            <Route path="/404" element={<Page404 />} />
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
