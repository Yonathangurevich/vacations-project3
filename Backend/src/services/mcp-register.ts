import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";
import z from "zod";

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
            description: "Get all database count for active vacations."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getActiveVacationCountTool);
    }

    public registerGetVacationPriceStatisticsTool(mcpServer: McpServer): void {
        const uniqueName = "get_price_statistics";
        const config = {
            description: "Get all database count for average, min and max vacation price."
        };
        mcpServer.registerTool(uniqueName, config, mcpTools.getVacationPriceStatisticsTool);
    }

    // public registerGetOneOrderTool(mcpServer: McpServer): void {
    //     const uniqueName = "get_one_order";
    //     const config = {
    //         description: "Get database order by given id.",
    //         inputSchema: z.object({ id: z.number() })
    //     };
    //     mcpServer.registerTool(uniqueName, config, mcpTools.getOneOrderTool);
    // }

    // public registerGetOrdersByYearTool(mcpServer: McpServer): void {
    //     const uniqueName = "get_orders_by_year";
    //     const config = {
    //         description: "Get database orders by given year.",
    //         inputSchema: z.object({ year: z.number() })
    //     };
    //     mcpServer.registerTool(uniqueName, config, mcpTools.getOrdersByYearTool);
    // }

}

export const mcpRegister = new McpRegister();
