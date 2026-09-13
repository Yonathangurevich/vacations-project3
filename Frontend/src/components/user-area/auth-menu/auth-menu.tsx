import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { UserModel } from "../../../models/user-model";
import { AppState } from "../../../redux/app-state";
import "./auth-menu.css";
import { userService } from "../../../services/user-service";

export function AuthMenu() {

    const user = useSelector<AppState, UserModel>(state => state.user);
    const navigate = useNavigate();

    function signOut() {
        userService.logout();
        navigate("/home");
    }

    return (
        <div className="AuthMenu">

            { !user && <div>
                <span>Hello Guest | </span>

                <NavLink to="/signup">Sign Up</NavLink>

                <span> | </span>

                <NavLink to="/signin">Sign In</NavLink>
            </div>}

            { user && <div>

                <span>Hello {user.firstName} {user.lastName} | </span>

                <button onClick={signOut}>Sign Out</button>

            </div>}

        </div>
    );
}
