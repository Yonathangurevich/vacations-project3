import { Navigate, Route, Routes } from "react-router-dom";
import { Reports } from "../../admin-area/reports/reports";
import { McpQuestions } from "../../ai-area/mcp-questions/mcp-questions";
import { Recommendation } from "../../ai-area/recommendation/recommendation";
import { About } from "../../pages-area/about/about";
import { Page404 } from "../../pages-area/page404/page404";
import { SignIn } from "../../user-area/sign-in/sign-in";
import { SignUp } from "../../user-area/sign-up/sign-up";
import { AddVacation } from "../../vacations-area/add-vacation/add-vacation";
import { EditVacation } from "../../vacations-area/edit-vacation/edit-vacation";
import { Vacations } from "../../vacations-area/vacations/vacations";

export function Routing() {

    return (
        <Routes>

            {/* Default Route: */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Home: */}
            <Route path="/vacations" element={<Vacations />} />
            
            {/* Sign up: */}
            <Route path="/signup" element={<SignUp />} />

            {/* Sign in: */}
            <Route path="/signin" element={<SignIn />} />

            {/* Add a vacation - admin only: */}
            <Route path="/vacations/new" element={<AddVacation />} />

            {/* Edit a vacation - admin only: */}
            <Route path="/vacations/edit/:vacationId" element={<EditVacation />} />

            <Route path="/reports" element={<Reports />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/mcp" element={<McpQuestions />} />

            {/* About:  */}
            <Route path="/about" element={<About />} />

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
