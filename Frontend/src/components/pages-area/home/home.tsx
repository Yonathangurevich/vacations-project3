import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTokenExpiration } from "../../../hooks/use-token-expiration";
import { VacationLikesCountModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { VacationCard } from "../../vacations-area/vacation-card/vacation-card";
import "./home.css";
import { Roles } from "../../../models/enums";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { UserModel } from "../../../models/user-model";

type VacationFilter = "all" | "liked" | "active" | "notStarted";

export function Home() {

    // Check token expiration:
    const token = localStorage.getItem("token");
    useTokenExpiration(token);

    const user = useSelector<AppState, UserModel>(state => state.user);

    const navigate = useNavigate();

    // Vacations:
    const [vacations, setVacations] = useState<VacationLikesCountModel[]>([]);

    // Current filter:
    const [filter, setFilter] = useState<VacationFilter>("all");

    // Current page:
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Amount of vacations per page:
    const vacationsPerPage = 9;

    function removeVacation(vacationId: number): void {
        setVacations(vacations => vacations.filter(v => v.vacationId !== vacationId));
    }

    const isAdmin = user?.roleId === Roles.Admin;

    useEffect(() => {

        vacationService.getAllVacations()
            .then(vacations => {

                // Sort vacations by start date:
                vacations.sort((a, b) =>
                    a.startDate.localeCompare(b.startDate)
                );

                setVacations(vacations);
            })
            .catch(err => notify.error(err));

    }, []);

    // Get today's date:
    const today = new Date().toLocaleDateString("sv-SE");

    // Filter vacations:
    const filteredVacations = vacations.filter(v => {

        switch (filter) {

            case "liked":
                return v.isLiked;

            case "active":
                return v.startDate <= today &&
                       v.endDate >= today;

            case "notStarted":
                return v.startDate > today;

            case "all":
            default:
                return true;
        }
    });

    // Amount of pages based on number of vacations:
    const totalPages = Math.ceil(
        filteredVacations.length / vacationsPerPage
    );

    const startIndex = (currentPage - 1) * vacationsPerPage;
    
    // Displayed vacations per page:
    const displayedVacations = filteredVacations.slice(
        startIndex,
        startIndex + vacationsPerPage
    );

    // Change filter:
    function changeFilter(filter: VacationFilter): void {
        setFilter(filter);
        setCurrentPage(1);
    }

    // Update vacation after like/unlike:
    function updateVacation(
        vacationId: number,
        isLiked: boolean,
        likesCount: number
    ): void {

        setVacations(vacations =>
            vacations.map(v =>
                v.vacationId === vacationId
                    ? { ...v, isLiked, likesCount }
                    : v
            )
        );
    }

    // Deleting the last card on a page would leave us on an empty page:
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="Home">

            {isAdmin &&
                <div className="admin-actions">
                    <button onClick={() => navigate("/vacations/new")}>
                        Add Vacation
                    </button>
                </div>
            }

			 <div className="vacation-filters">

                <button onClick={() => changeFilter("all")}>
                    All Vacations
                </button>

                {!isAdmin && <button onClick={() => changeFilter("liked")}>
                    My Likes
                </button>}

                <button onClick={() => changeFilter("active")}>
                    Active Vacations
                </button>

                <button onClick={() => changeFilter("notStarted")}>
                    Future Vacations
                </button>

            </div>


            <div className="vacations-container">

                {displayedVacations.map(v =>
                    <VacationCard
                        key={v.vacationId}
                        vacation={v}
                        onLikeChanged={updateVacation}
                        onDeleted={removeVacation}
                    />
                )}

            </div>


            <div className="pagination">

                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>


                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map(page =>
                    <button
                        key={page}
                        disabled={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                )}


                <button
                    disabled={currentPage === totalPages ||totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}>
                        Next
                </button>

            </div>


        </div>
    );
}
