import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { UserModel } from "../../../models/user-model";
import { AppState } from "../../../redux/app-state";

type AuthGuardProps = {
    children: JSX.Element;
};

// Blocks a page from anyone who is not signed in:
export function AuthGuard(props: AuthGuardProps): JSX.Element {

    // the user comes from redux, so this re-renders the moment someone logs out:
    const user = useSelector<AppState, UserModel>(state => state.user);

    // redirecting during render means the page never appears, not even for a frame:
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return props.children;
}
