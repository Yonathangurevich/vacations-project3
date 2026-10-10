import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/user-service";

type JwtPayload = {
    exp: number;
}


export function useTokenExpiration(token: string | null): void {

    const navigate = useNavigate();

    useEffect(() => {

        if (!token) return;

        // a broken token would throw, so treat it as no token at all:
        let expirationTime: number;
        try {
            expirationTime = jwtDecode<JwtPayload>(token).exp * 1000;
        }
        catch {
            userService.logout();
            return;
        }

        // get expiration time left:
        const timeUntilExpiration = expirationTime - Date.now();

        // Token already expired:
        if (timeUntilExpiration <= 0) {
            userService.logout();
            navigate("/signin", { replace: true });
            return;
        }

        // Logout exactly when token expires:
        const timeout = setTimeout(() => {
            userService.logout();
            navigate("/signin", { replace: true });
        }, timeUntilExpiration);

        return () => clearTimeout(timeout);

    }, [token, navigate]);
}
