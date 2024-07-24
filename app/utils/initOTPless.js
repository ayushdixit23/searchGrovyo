export const initOTPless = (callback) => {
	const otplessInit = Reflect.get(window, "otplessInit");
	const loadScript = () => {
		const isScriptLoaded = document.getElementById("otpless-sdk");
		if (isScriptLoaded) return;

		const script = document.createElement("script");
		script.id = "otpless-sdk";
		script.type = "text/javascript";
		script.src = "https://otpless.com/v2/headless.js";
		script.setAttribute("data-appid", "CZ0C3TQLX7LM7L3R4D7D");
		script.onload = () => {
			window.OTPlessSignin = new OTPless(callback);
		};
		document.body.appendChild(script);
	};

	otplessInit ? otplessInit() : loadScript();

	Reflect.set(window, "otpless", callback);
};
