// Tools to be used by the MCP server
// Tools - what the MCP server do?

import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { vacationsService } from "./vacations-service";

class McpTools {

    public async getAllVacationsTool(): Promise<CallToolResult> {
        console.log("Using tool: getAllVacationsTool");
        const vacations = await vacationsService.getAllVacations();
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        };
        return result;
    }

    public async getActiveVacationCountTool(): Promise<CallToolResult> {
        console.log("Using tool: getActiveVacationCountTool");
        const vacations = await vacationsService.getActiveVacationCount();
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        };
        return result;
    }

    public async getVacationPriceStatisticsTool(): Promise<CallToolResult> {
        console.log("Using tool: getVacationPriceStatisticsTool");
        const vacations = await vacationsService.getVacationPriceStatistics();
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        };
        return result;
    }

    // public async getOneOrderTool(args: { id: number }): Promise<CallToolResult> {
    //     console.log("Using tool: getOneOrderTool");
    //     const order = await orderService.getOneOrder(args.id);
    //     const result: CallToolResult = {
    //         content: [{
    //             type: "text",
    //             text: JSON.stringify(order)
    //         }]
    //     };
    //     return result;
    // }

    // public async getOrdersByYearTool(args: { year: number }): Promise<CallToolResult> {
    //     console.log("Using tool: getOrdersByYearTool");
    //     const orders = await orderService.getOrdersByYear(args.year);
    //     const result: CallToolResult = {
    //         content: [{
    //             type: "text",
    //             text: JSON.stringify(orders)
    //         }]
    //     };
    //     return result;
    // }

}

export const mcpTools = new McpTools();
