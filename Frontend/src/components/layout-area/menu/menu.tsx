import { NavLink } from "react-router-dom";
import "./menu.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { UserModel } from "../../../models/user-model";
import { Roles } from "../../../models/enums";

export function Menu() {

    const user = useSelector<AppState, UserModel>(state => state.user);
    const isAdmin = user?.roleId === Roles.Admin;

    return (
        <div className="Menu">

            <NavLink to="/home">Home</NavLink>

            {isAdmin && <NavLink to="/reports">Reports</NavLink>}
            
            <NavLink to="/about">About</NavLink>

        </div>
    );
}
