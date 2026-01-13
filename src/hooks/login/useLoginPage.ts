import { Form } from "antd";
import { useEffect } from "react";
import { useLogin, useIsAuthenticated } from "@refinedev/core";
import { useReCaptchaToken } from "../useReCaptcha";

export type LoginFormValues = {
  user: string;
  password: string;
};

export const useLoginPage = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const { mutate: login, isLoading: isLoginLoading, error } = useLogin();
  const { data, isLoading: isAuthLoading } = useIsAuthenticated();
  const hasSession = Boolean(data?.authenticated);
  const { getReCaptchaToken } = useReCaptchaToken();

  useEffect(() => {
    if (error) {
      form.setFieldsValue({ password: "" });
    }
  }, [error, form]);

  const onFinish = async ({ user, password }: LoginFormValues) => {
    const recaptchaToken = await getReCaptchaToken();
    
    login({
      username: user,
      password,
      recaptchaToken: recaptchaToken || undefined,
    });
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : undefined;

  return {
    form,
    isLoginLoading,
    errorMessage,
    onFinish,
    shouldRedirect: !isAuthLoading && hasSession,
  };
};
