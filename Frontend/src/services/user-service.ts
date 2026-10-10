import { UserModel } from "../models/user-model";
import { jwtDecode } from "jwt-decode";
import { store } from "../redux/store";
import { userSlice } from "../redux/user-slice";
import axios from "axios";
import { appConfig } from "../utils/app-config";
import { CredentialModel } from "../models/credential-model";

class UserService {
	
    public constructor() {

        try {

            // Get token from local storage:
            const token = localStorage.getItem("token");
    
            // If we have token - save user in global state:
            if (token) {
                const dbUser = jwtDecode<{ user: UserModel }>(token).user;
                const action = userSlice.actions.initUser(dbUser);
                store.dispatch(action);
            }
        }
        catch(err: any) {
            throw new Error("You'r not logged in!");
        }

    }

    // Register new user:
    public async register(user: UserModel): Promise<void> {
        
        // send user to backend
        const response = await axios.post<string>(appConfig.registerUrl, user);
        
        // get jwt
        const token = response.data;

        // extract user
        const dbUser = jwtDecode<{user: UserModel}>(token).user;

        // send user to global state
        const action = userSlice.actions.initUser(dbUser);
        store.dispatch(action);

        // set token to local storage
        localStorage.setItem("token", token);
    }

    // Login existing user:
    public async login(credentials: CredentialModel): Promise<void> {

        // send user to backend
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        
        // get jwt
        const token = response.data;

        // extract user
        const dbUser = jwtDecode<{ user: UserModel }>(token).user;

        // send user to global state
        const action = userSlice.actions.initUser(dbUser);
        store.dispatch(action);

        // set token to local storage
        localStorage.setItem("token", token);
    }

    public logout(): void {
        
        // Remove user from the global state:
        const action = userSlice.actions.logoutUser();
        store.dispatch(action);

        // Remove token from local storage:
        localStorage.removeItem("token");
    } 



}

export const userService = new UserService();
