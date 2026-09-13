class AppConfig {

	public readonly vacationsUrl = "http://localhost:4000/api/vacations";
    public readonly registerUrl = "http://localhost:4000/api/register";
    public readonly loginUrl = "http://localhost:4000/api/login";
    public readonly reportUrl = "http://localhost:4000/api/report";


    public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();
