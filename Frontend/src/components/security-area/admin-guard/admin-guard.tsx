import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Roles } from "../../../models/enums";
import { UserModel } from "../../../models/user-model";
import { AppState } from "../../../redux/app-state";

type AdminGuardProps = {
    children: JSX.Element;
};

// Blocks a page from anyone who is not an admin:
export function AdminGuard(props: AdminGuardProps): JSX.Element {

    const user = useSelector<AppState, UserModel>(state => state.user);

    // not signed in at all:
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // signed in, but a regular user - send them to the vacations page:
    if (user.roleId !== Roles.Admin) {
        return <Navigate to="/vacations" replace />;
    }

    return props.children;
}
