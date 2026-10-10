import dotenv from "dotenv"; // npm install dotenv

// Loads .env values into: process.env object:
dotenv.config({ quiet: true });

class AppConfig {

    public readonly environment = process.env.ENVIRONMENT!;
    public readonly isDevelopment = this.environment === "development";
    public readonly isProduction = this.environment === "production";

    public readonly port = 4000;
    public readonly mysqlHost = process.env.MYSQL_HOST!;
    public readonly mysqlUser = process.env.MYSQL_USER!;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD!;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE!;
    public readonly jwtSecret = process.env.JWT_SECRET!;
    public readonly hashSalt = process.env.HASH_SALT!;

    public readonly vacationImagesBaseUrl = process.env.VACATION_IMAGES_BASE_URL!;

    public readonly openaiApiKey = process.env.OPENAI_API_KEY!;
    public readonly openaiModel = "gpt-4o";
    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";

    public readonly mcpServerUrl = process.env.MCP_SERVER_URL!;

}

export const appConfig = new AppConfig();
