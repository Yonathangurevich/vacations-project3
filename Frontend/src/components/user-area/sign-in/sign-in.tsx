import { NavLink, useNavigate } from "react-router-dom";
import { CredentialModel } from "../../../models/credential-model";
import "./sign-in.css";
import { useForm } from "react-hook-form";
import { notify } from "../../../utils/notify";
import { userService } from "../../../services/user-service";
import { useId } from "react";

export function SignIn() {
    
    const { register, handleSubmit } = useForm<CredentialModel>();
    const navigate = useNavigate();
    
    // create random ids
    const emailId = useId();
    const passwordId = useId();
    const registerId = useId();

    // send user credentials
    async function send(credential:CredentialModel) {
        try {
            await userService.login(credential);
            notify.success("welcome back");
            navigate("/home");
        }
        catch(err: any) {
            notify.error(err);
        }
    }
    
    return (
        <div className="SignIn">

			<form onSubmit={handleSubmit(send)}>
                <label htmlFor={emailId}>Email: </label>
                <input id={emailId} type="email" {...register("email")} minLength={2} maxLength={100} required />

                <label htmlFor={passwordId}>Password: </label>
                <input id={passwordId} type="password" {...register("password")} minLength={4} maxLength={40} required />
                
                <button>Sign In</button>

                <label htmlFor={registerId}>don't have account?</label>
                <NavLink id={registerId} to={"/signup"} >register now</NavLink>
            </form>


        </div>
    );
}
