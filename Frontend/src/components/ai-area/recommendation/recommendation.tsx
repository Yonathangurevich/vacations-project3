import { useForm } from "react-hook-form";
import "./recommendation.css";
import { AiRecommendationModel } from "../../../models/ai-recommendation-model";
import { useState } from "react";
import { vacationRecommendationService } from "../../../services/vacation-recommendation-service";
import { notify } from "../../../utils/notify";
import { Spinner } from "../../shared-area/spinner/spinner";
import { RecommendationCard } from "../recommendation-card/recommendation-card";
import { useTokenExpiration } from "../../../hooks/use-token-expiration";

export function Recommendation() {
    
    const {register, handleSubmit} = useForm<{destination: string}>();
    const [recommendation, setRecommendation] = useState<AiRecommendationModel>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useTokenExpiration(localStorage.getItem("token"));

    async function send(destination: {destination: string}) {
        try {
            setIsLoading(true)
            const recommendation = await vacationRecommendationService.getRecommendation(destination.destination);
            setRecommendation(recommendation);
        }
        catch(err: any) {
            notify.error(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="Recommendation">

            <form onSubmit={handleSubmit(send)}>
                <label>AI Recommendation</label>
                <input type="text" {...register("destination")} minLength={2} maxLength={30} required />
                <button>Send</button>
            </form>

            {isLoading && <Spinner />}

            {recommendation && <div>
                <h3>{recommendation.title}</h3>
                {recommendation.sections.map(r => <RecommendationCard key={r.title} section={r} />)}
            </div>}

        </div>
    );
}
