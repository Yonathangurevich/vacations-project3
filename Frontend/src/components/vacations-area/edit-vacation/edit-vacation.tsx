import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { VacationFormModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import "./edit-vacation.css";
import { useAdmin } from "../../../hooks/use-admin";

export function EditVacation() {
    
    useAdmin();

    const params = useParams()
    const vacationId: number = +params.vacationId!;
    const {register, handleSubmit, reset} = useForm<VacationFormModel>()
    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        vacationService.getOneVacation(vacationId)
            .then(vacation => {
                
                reset({
                    destination: vacation.destination,
                    description: vacation.description,
                    startDate: vacation.startDate,
                    endDate: vacation.endDate,
                    price: vacation.price
                });
                
                setImageUrl(vacation.imageUrl);
            })
            .catch(err => notify.error(err));
    }, [vacationId, reset]);
    
    async function send(vacation: VacationFormModel) {
        try {
            await vacationService.updateVacation(vacation, vacationId);
            notify.success(`vacation: ${vacation.destination} was updated`);
            navigate("/vacations");
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="EditVacation">

			<h2>Edit Vacation</h2>

            <form onSubmit={handleSubmit(send)}>

                <label>Destination:</label>
                <input type="text" {...register("destination")} required minLength={2} maxLength={30} />

                <label>Description:</label>
                <textarea {...register("description")} required minLength={2} maxLength={1000} />

                <label>Start On:</label>
                <input type="date"{...register("startDate")} required minLength={2} maxLength={20} />

                <label>End On:</label>
                <input type="date"{...register("endDate")} required minLength={2} maxLength={20} />

                <label>Price:</label>
                <input type="number" {...register("price")} required min={0} max={10_000} step="0.01" />

                <label>Cover Image:</label>
                {imageUrl && <img src={imageUrl}/>}

                <input type="file" accept="image/*" {...register("image")}/>

                <button>Update</button>

                <NavLink to="/home">Back</NavLink>
            </form>


        </div>
    );
}
