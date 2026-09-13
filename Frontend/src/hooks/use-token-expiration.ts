import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/user-service";

interface JwtPayload {
    exp: number;
}

export function useTokenExpiration(token: string | null): void {

    const navigate = useNavigate();

    useEffect(() => {

        // if there is no token:
        if (!token) {
            navigate("/signin");
            return;
        }

        // get jwt payload
        const payload = jwtDecode<JwtPayload>(token);

        // get expiration time left:
        const expirationTime = payload.exp * 1000;
        const timeUntilExpiration = expirationTime - Date.now();

        // Token already expired:
        if (timeUntilExpiration <= 0) {
            userService.logout();
            navigate("/signin");
            return;
        }

        // Logout exactly when token expires:
        const timeout = setTimeout(() => {
            navigate("/signin");
        }, timeUntilExpiration);

        return () => clearTimeout(timeout);

    }, [token, navigate]);
}