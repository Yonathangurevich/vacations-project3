import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./add-vacation.css";
import { VacationFormModel } from "../../../models/vacation-model";
import { notify } from "../../../utils/notify";
import { vacationService } from "../../../services/vacation-service";


export function AddVacation() {


    // take form details and watch for startDate
    const {register, handleSubmit, watch} = useForm<VacationFormModel>();
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString("sv-SE");
    
    // get startDate value:
    const startDate = watch("startDate");
    
    async function send(vacation:VacationFormModel) {
        try {
            await vacationService.addNewVacation(vacation);
            notify.success("Added new vacation");
            navigate("/vacations");
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">

			<form onSubmit={handleSubmit(send)}>
                
                <label>Destination:</label>
                <input type="text" {...register("destination")} required minLength={2} maxLength={30} />

                <label>Description:</label>
                <textarea {...register("description")} required minLength={2} maxLength={1000} />

                <label>Start On:</label>
                <input type="date"{...register("startDate")} required minLength={2} maxLength={20} min={today} />

                <label>End On:</label>
                <input type="date"{...register("endDate")} required minLength={2} maxLength={20} min={startDate} />

                <label>Price:</label>
                <input type="number" {...register("price")} required min={0} max={10_000} step="0.01" />

                <label>Cover Image:</label>
                <input type="file" accept="image/*" {...register("image")} required />

                <button>Add</button>
            </form>

        </div>
    );
}
