import { useSelector } from "react-redux";
import { AppState } from "../redux/app-state";
import { UserModel } from "../models/user-model";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Roles } from "../models/enums";
import { notify } from "../utils/notify";
import { userService } from "../services/user-service";

// Custom hook for checking if user is Admin:
export function useAdmin(): void {

    const user = useSelector<AppState, UserModel>(state => state.user);
    const navigate = useNavigate();

    // get token
    const token = localStorage.getItem("token");
    
    // check if user got token and also admin:
    const isAdmin = !!token && user?.roleId === Roles.Admin;
    
    useEffect(() => {
        if (!isAdmin) {
            userService.logout();
            notify.error("You are not authorized!");
            navigate("/signin", { replace: true });
        }
    }, [isAdmin, navigate]);

}
