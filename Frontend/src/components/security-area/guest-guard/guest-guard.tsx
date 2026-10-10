import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { UserModel } from "../../../models/user-model";
import { AppState } from "../../../redux/app-state";

type GuestGuardProps = {
    children: JSX.Element;
};

// Keeps a signed-in user away from the sign in / sign up pages:
export function GuestGuard(props: GuestGuardProps): JSX.Element {

    const user = useSelector<AppState, UserModel>(state => state.user);

    if (user) {
        return <Navigate to="/vacations" replace />;
    }

    return props.children;
}
