import "./recommendation.css";
import { AiRecommendationModel } from "../../../models/ai-recommendation-model";
import { ChangeEvent, useState } from "react";
import { vacationRecommendationService } from "../../../services/vacation-recommendation-service";
import { notify } from "../../../utils/notify";
import { Spinner } from "../../shared-area/spinner/spinner";
import { RecommendationCard } from "../recommendation-card/recommendation-card";
import { useTokenExpiration } from "../../../hooks/use-token-expiration";

export function Recommendation() {

    const token = localStorage.getItem("token");
    useTokenExpiration(token);

    // store user input:
    const [destination, setDestination] = useState<string>("");
    
    // store ai recommendations:
    const [recommendation, setRecommendation] = useState<AiRecommendationModel>();
    
    // set spinner to on or off:
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // get user destination:
    function putDestination(event: ChangeEvent<HTMLInputElement>): void {
        const destination = event.target.value;
        setDestination(destination);
    }

    // send the users destination to LLM:
    async function send() {
        try {
            setIsLoading(true);
            const recommendation = await vacationRecommendationService.getRecommendation(destination);
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

            <input type="text" onChange={putDestination} />
            <button onClick={send}>Send</button>

            {isLoading && <Spinner />}

            {recommendation && <div>
                <h3>{recommendation.title}</h3>
                {recommendation.sections.map(r => <RecommendationCard key={r.title} section={r} />)}
            </div>}

        </div>
    );
}
