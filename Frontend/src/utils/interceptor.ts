import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { userService } from "../services/user-service";

class Interceptor {

    public create(): void {

        // Registering a request interceptor:
        axios.interceptors.request.use((httpRequest: InternalAxiosRequestConfig) => {

            // Get the token: 
            const token = localStorage.getItem("token");

            // Save token in header: 
            if (token) {
                httpRequest.headers.Authorization = "Bearer " + token;
            }

            // Return given request so axios could send this one:
            return httpRequest;
        });

        // Registering a response interceptor:
        axios.interceptors.response.use(

            // all good - hand the response back untouched:
            httpResponse => httpResponse,

            // the server said the token is no longer good, so whatever the
            // browser still holds is wrong - clear it and let the guards
            // send the user to the sign in page:
            (err: AxiosError) => {

                if (err.response?.status === 401) {
                    userService.logout();
                }

                return Promise.reject(err);
            }
        );

    }

}

export const interceptor = new Interceptor();
