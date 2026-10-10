import { useForm } from "react-hook-form";
import "./sign-up.css";
import { UserModel } from "../../../models/user-model";
import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
import { userService } from "../../../services/user-service";
import { useId } from "react";

export function SignUp() {
    
    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    const firstNameId = useId();
    const lastNameId = useId();
    const emailId = useId();
    const passwordId = useId();
    const loginIdId =useId();

    async function send(user: UserModel) {
        try {
            await userService.register(user);
            notify.success(`Welcome ${user.firstName}`);
            navigate("/vacations");
        }
        catch(err: any) {
            notify.error(err);
        }
    }
    
    return (
        <div className="SignUp">

			<form onSubmit={handleSubmit(send)}>
                <label htmlFor={firstNameId}>First name: </label>
                <input id={firstNameId} type="text" {...register("firstName")} minLength={2} maxLength={30} required />

                <label htmlFor={lastNameId}>Last name: </label>
                <input id={lastNameId} type="text" {...register("lastName")} minLength={2} maxLength={50} required />
                
                <label htmlFor={emailId}>Email: </label>
                <input id={emailId} type="email" {...register("email")} minLength={2} maxLength={100} required />
                
                <label htmlFor={passwordId}>Password: </label>
                <input id={passwordId} type="password" {...register("password")} minLength={4} maxLength={40} required />

                <button>Register</button>

                <label htmlFor={loginIdId}>Already a member?</label>
                <NavLink id={loginIdId} to={"/signin"}>Sign in</NavLink>
            </form>

        </div>
    );
}
