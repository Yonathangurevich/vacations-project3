import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpRegister } from "./mcp-register";

class VacationMcpServer {

    public create(): McpServer {
        
        // Create mcp server: 
        const mcpServer = new McpServer({
            name: "vacation-mcp-server",
            version: "1.0.0"
        });

        // Register tools: 
        mcpRegister.registerGetAllVacationsTool(mcpServer);
        mcpRegister.registerGetActiveVacationCountTool(mcpServer);
        mcpRegister.registerGetVacationPriceStatisticsTool(mcpServer);

        // Return the mcp server object: 
        return mcpServer;
    }

}

export const vacationMcpServer = new VacationMcpServer();
