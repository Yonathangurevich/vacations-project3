import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../pages-area/about/about";
import { Home } from "../../pages-area/home/home";
import { Page404 } from "../../pages-area/page404/page404";
import { SignIn } from "../../user-area/sign-in/sign-in";
import { SignUp } from "../../user-area/sign-up/sign-up";
import { AddVacation } from "../../vacation-area/add-vacation/add-vacation";
import { EditVacation } from "../../vacation-area/edit-vacation/edit-vacation";
import { Reports } from "../../admin-area/reports/reports";

export function Routing() {

    return (
        <Routes>

            {/* Default Route: */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Home: */}
            <Route path="/home" element={<Home />} />
            
            {/* Sign up: */}
            <Route path="/signup" element={<SignUp />} />

            {/* Sign in: */}
            <Route path="/signin" element={<SignIn />} />

            {/* Add a vacation - admin only: */}
            <Route path="/vacations/new" element={<AddVacation />} />

            {/* Edit a vacation - admin only: */}
            <Route path="/vacations/edit/:vacationId" element={<EditVacation />} />

            <Route path="/reports" element={<Reports />} />

            {/* About:  */}
            <Route path="/about" element={<About />} />

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
