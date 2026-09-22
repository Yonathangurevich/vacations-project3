import { appConfig } from "../utils/app-config"; 
import OpenAI from "openai";

class McpGptService {

    private openai = new OpenAI({
        apiKey: appConfig.openaiApiKey
    });

    public async getAnswer(question: string): Promise<string> {

        const body: OpenAI.Responses.ResponseCreateParams = {
            model: "gpt-5",
            input: question,
            tools: [
                {
                    type: "mcp",
                    server_label: "Vacations",
                    server_description: "Vacations MCP server.",
                    require_approval: "never",
                    server_url: appConfig.mcpServerUrl + "/sse"
                }
            ]
        };

        const response = await this.openai.responses.create(body);
        const completion = response.output_text;
        return completion;
    }

}

export const mcpGptService = new McpGptService();