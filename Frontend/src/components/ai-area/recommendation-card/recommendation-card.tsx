import { AiSectionModel } from "../../../models/ai-recommendation-model";
import "./recommendation-card.css";

type RecommendationCardProps = {
	section: AiSectionModel;
};

export function RecommendationCard(props: RecommendationCardProps) {
    return (
        <div className="RecommendationCard">

			<h4>{props.section.emoji}</h4>
			<h4>{props.section.title}</h4>
            <br />
            <p>{props.section.intro}</p>
            <br />
            <p>Highlights:</p>
            <br />
            <ul>
                {props.section.highlights.map((h, index) => <li key={index}>
                    {h}
                </li>)}
            </ul>
            <br />
            <p>💡Tip: </p>
            <p>{props.section.tip}</p>
        </div>
    );
}
