import axios from "axios";
import { AiRecommendationModel } from "../models/ai-recommendation-model";
import { appConfig } from "../utils/app-config";

class VacationRecommendationService {

    // get AI recommendation:
    public async getRecommendation(destination: string): Promise<AiRecommendationModel> {
        destination.trim();
        const response = await axios.post<AiRecommendationModel>(appConfig.aiRecommendationUrl, { destination });
        const recommendation = response.data;
        return recommendation;
    }

}

export const vacationRecommendationService = new VacationRecommendationService();