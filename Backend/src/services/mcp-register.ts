import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";

class McpRegister {

    public registerGetAllVacationsTool(mcpServer: McpServer): void {
        const uniqueName = "get_all_vacations";
        const config = {
            description: "Get all database vacations."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getAllVacationsTool);
    }

    public registerGetActiveVacationCountTool(mcpServer: McpServer): void {
        const uniqueName = "count_active_vacations";
        const config = {
            description: "Get the number of vacations happening right now."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getActiveVacationCountTool);
    }

    public registerGetVacationPriceStatisticsTool(mcpServer: McpServer): void {
        const uniqueName = "get_price_statistics";
        const config = {
            description: "Get the average, minimum and maximum vacation price."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getVacationPriceStatisticsTool);
    }

}

export const mcpRegister = new McpRegister();
