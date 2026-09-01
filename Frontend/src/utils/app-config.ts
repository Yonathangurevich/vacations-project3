class AppConfig {
	public readonly dataUrl = "http://localhost:4000/api/____";

    public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();
