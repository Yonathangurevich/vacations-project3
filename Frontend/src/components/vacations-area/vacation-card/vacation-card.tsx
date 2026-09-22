import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../../models/enums";
import { UserModel } from "../../../models/user-model";
import { VacationLikesCountModel } from "../../../models/vacation-model";
import { AppState } from "../../../redux/app-state";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import "./vacation-card.css";


type VacationCardProps = {

    vacation: VacationLikesCountModel;

    onLikeChanged: (
        vacationId: number,
        isLiked: boolean,
        likesCount: number
    ) => void;

    onDeleted: (vacationId: number) => void;
};


export function VacationCard(props: VacationCardProps) {

    const user = useSelector<AppState, UserModel>(state => state.user);
    const isAdmin = user?.roleId === Roles.Admin;

    const navigate = useNavigate();

    async function deleteVacation() {
        
        if (!confirm(`Delete ${props.vacation.destination}?`)) return;
        
        try {
            await vacationService.deleteVacation(props.vacation.vacationId);
            notify.success("Vacation has been deleted");
            props.onDeleted(props.vacation.vacationId);
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    async function toggleLike(): Promise<void> {

        try {

            if (props.vacation.isLiked) {

                // unlike the vacation:
                await vacationService.unlikeVacation(
                    props.vacation.vacationId
                );

                props.onLikeChanged(
                    props.vacation.vacationId,
                    false,
                    props.vacation.likesCount - 1
                );

            }
            else {

                // like the vacation:
                await vacationService.likeVacation(
                    props.vacation.vacationId
                );

                props.onLikeChanged(
                    props.vacation.vacationId,
                    true,
                    props.vacation.likesCount + 1
                );
            }

        }
        catch (err: any) {
            notify.error(err);
        }
    }


    return (
        <div className="VacationCard">


            <div className="vacation-image">

                <img src={props.vacation.imageUrl}/>

                <div className="vacation-actions">

                    {!isAdmin &&
                        <button onClick={toggleLike}>
                            {props.vacation.isLiked ? "❤️" : "🤍"}
                            {" "}Like {props.vacation.likesCount}
                        </button>
                    }

                    {isAdmin && <>
                        <button onClick={() => navigate(`/vacations/edit/${props.vacation.vacationId}`)}>Edit</button>
                        <button onClick={deleteVacation}>Delete</button>
                    </>}

                </div>


                <div className="vacation-destination">

                    <h2>{props.vacation.destination}</h2>

                </div>

            </div>


            <div className="vacation-dates">

                <span>📅</span>

                <span>
                    {props.vacation.startDate}
                    {" - "}
                    {props.vacation.endDate}
                </span>

            </div>


            <div className="vacation-info">

                <p>{props.vacation.description}</p>


                <div className="vacation-price">

                    ${props.vacation.price}

                </div>

            </div>


        </div>
    );
}