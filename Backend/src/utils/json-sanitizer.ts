import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { AiResponseModel } from "../models/vacation-request-model";

class JsonSanitizer {

	public sanitize(text: string): AiResponseModel {

        try {

            // Even in json_object mode a model can wrap the reply in ```json
            // fences, so cut everything outside the outermost braces:
            const start = text.indexOf("{");
            const end = text.lastIndexOf("}");

            if (start === -1 || end === -1) {
                throw new ClientError(StatusCode.BadGateway, "The AI service returned an unreadable answer.");
            }

            const json = text.substring(start, end + 1);

            const guide = JSON.parse(json) as AiResponseModel;

            // The json parsed, but it may not have the model structure:
            if (!Array.isArray(guide?.sections)) {
                throw new ClientError(StatusCode.BadGateway, "The AI service returned an unexpected answer.");
            }

            return guide;
        }
        catch (err: any) {

            // Our own error - let it through untouched:
            if (err instanceof ClientError) throw err;

            // JSON.parse failed on something that looked like json:
            throw new ClientError(StatusCode.BadGateway, "The AI service returned an unreadable answer.");
        }
    }

}

export const jsonSanitizer = new JsonSanitizer();
