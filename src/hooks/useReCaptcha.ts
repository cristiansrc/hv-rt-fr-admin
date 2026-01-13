import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useReCaptchaToken = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getReCaptchaToken = async (): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.warn("reCAPTCHA no está disponible");
      return null;
    }

    try {
      const token = await executeRecaptcha("login");
      return token;
    } catch (error) {
      console.error("Error al ejecutar reCAPTCHA:", error);
      return null;
    }
  };

  return { getReCaptchaToken };
};
