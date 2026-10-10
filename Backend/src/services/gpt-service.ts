import axios from "axios";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { appConfig } from "../utils/app-config";

class GptService {

	public async getCompletion(systemPrompt: string, userPrompt: string): Promise<string> {

        const body = {
            model: appConfig.openaiModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        };

        const options = {
            headers: {
                authorization: "Bearer " + appConfig.openaiApiKey
            },
            // timeout for the llm connection:
            timeout: 100_000,
        };

        try {

            const response = await axios.post(appConfig.openaiUrl, body, options);

            const completion = response.data?.choices?.[0]?.message?.content;

            // A well-formed http 200 can still carry an unusable body:
            if (!completion) {
                throw new ClientError(StatusCode.BadGateway, "The AI service returned an empty answer.");
            }

            return completion;
        }
        catch (err: any) {

            // if any error is part of any ClientError:
            if (err instanceof ClientError) throw err;

            // Anything else is the upstream service failing:
            throw new ClientError(StatusCode.BadGateway, "The AI service is currently unavailable.");
        }
    }

}

export const gptService = new GptService();