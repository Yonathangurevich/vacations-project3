import axios from "axios";
import { appConfig } from "../utils/app-config";
import { McpModel } from "../models/mcp-model";

class McpService {
	
    public async getMcpAnswer(question: McpModel): Promise<string> {
        const response = await axios.post<string>(appConfig.mcpServerUrl, question);
        const answer = response.data;
        return answer;
    }

}

export const mcpService = new McpService();
