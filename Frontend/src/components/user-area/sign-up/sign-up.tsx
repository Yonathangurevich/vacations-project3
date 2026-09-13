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

    const firstName = useId();
    const lastName = useId();
    const email = useId();
    const password = useId();
    const loginId =useId();

    async function send(user: UserModel) {
        try {
            await userService.register(user);
            notify.success(`Welcome ${user.firstName}`);
            navigate("/home");
        }
        catch(err: any) {
            notify.error(err);
        }
    }
    
    return (
        <div className="SignUp">

			<form onSubmit={handleSubmit(send)}>
                <label htmlFor={firstName}>first name: </label>
                <input id={firstName} type="text" {...register("firstName")} minLength={2} maxLength={30} required />

                <label htmlFor={lastName}>last name: </label>
                <input id={lastName} type="text" {...register("lastName")} minLength={2} maxLength={50} required />
                
                <label htmlFor={email}>email: </label>
                <input id={email} type="email" {...register("email")} minLength={2} maxLength={100} required />
                
                <label htmlFor={password}>password: </label>
                <input id={password} type="password" {...register("password")} minLength={4} maxLength={40} required />

                <button>Register</button>

                <label htmlFor={loginId}>already a member?</label>
                <NavLink id={loginId} to={"/signin"} >login</NavLink>
            </form>

        </div>
    );
}
