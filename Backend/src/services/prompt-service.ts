import { AiResponseModel, VacationRequestModel } from "../models/vacation-request-model";
import { jsonSanitizer } from "../utils/json-sanitizer";
import { gptService } from "./gpt-service";

class PromptService {

    public async getRecommendations(vacation: VacationRequestModel): Promise<AiResponseModel> {

        // validate:
        vacation.validate();

        // The system prompt:
        const systemPrompt = "You are an expert travel guide who writes warm, vivid destination guides in flowing prose, the way a good guidebook reads.";

        // The user prompt:
        const userPrompt = `
            Write a vacation guide for ${vacation.destination}.

            Organize it into 5 to 7 themed sections. A section is an experience or an
            area of the destination, not a single attraction - for example an old town,
            a stretch of coastline, the local food scene, a day trip, the nightlife.

            For each section:
            - "emoji": one emoji that fits the theme.
            - "title": a short inviting heading written as an invitation, such as
              "Explore the Medieval Old Town" or "Taste the Island's Kitchen".
            - "intro": 2 to 4 full sentences of flowing prose. Describe what the place
              feels like to walk through, why it matters, and what the traveler will
              see there. Write in second person, present tense. Mention history,
              atmosphere and sensory detail. Do not write a dry one-line summary and
              do not use bullet points inside this field.
            - "highlights": 3 to 5 specific named spots inside that theme. Each one is
              a single string formatted as "Name - short explanation of what it is".
            - "tip": one practical piece of advice about timing, crowds, cost or
              getting around.

            Reply with a JSON object shaped exactly like this:
            {
                "title": "${vacation.destination} Vacation Recommendations",
                "sections": [
                    {
                        "emoji": "one emoji",
                        "title": "section heading",
                        "intro": "2 to 4 sentences of flowing prose",
                        "highlights": ["Name - short explanation", "Name - short explanation"],
                        "tip": "one practical tip"
                    }
                ]
            }
            Don't reply with anything else, just the above JSON.
        `;

        // Get completion:
        const completion = await gptService.getCompletion(systemPrompt, userPrompt);

        // Parse the reply into our own shape:
        const guide = jsonSanitizer.sanitize(completion);

        // Return the guide:
        return guide;
    }
}

export const promptService = new PromptService();
