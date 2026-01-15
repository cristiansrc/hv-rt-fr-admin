import { Form } from "antd";
import { useEffect, useState } from "react";
import { useLogin, useIsAuthenticated } from "@refinedev/core";
import { useAltcha } from "../useAltcha";

export type LoginFormValues = {
  user: string;
  password: string;
};

export const useLoginPage = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const { mutateAsync: login, error } = useLogin();
  const { data, isLoading: isAuthLoading } = useIsAuthenticated();
  const hasSession = Boolean(data?.authenticated);
  const { solveAltcha, isLoading: isAltchaLoading, error: altchaError } = useAltcha();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Desactivar el loading y limpiar formulario cuando hay un error
  useEffect(() => {
    if (error) {
      form.setFieldsValue({ password: "" });
      setIsSubmitting(false); // Desactivar el overlay cuando falla el login
    }
  }, [error, form]);

  const onFinish = async ({ user, password }: LoginFormValues) => {
    // Activar el loading inmediatamente
    setIsSubmitting(true);
    
    try {
      // Resolver el challenge de Altcha antes de hacer login
      const altchaPayload = await solveAltcha();
      
      if (!altchaPayload) {
        form.setFields([
          {
            name: "password",
            errors: [
              altchaError?.message || "Error al verificar Altcha. Intenta recargar la página.",
            ],
          },
        ]);
        setIsSubmitting(false);
        return;
      }

      // Esperar el resultado del login con await
      const result = await login({
        username: user,
        password,
        altcha: altchaPayload,
      });
      
      // Si login retorna sin error, mantener isSubmitting en true hasta que se redirija
      // Si no, el useEffect de error lo desactivará
    } catch (err) {
      // Si hay cualquier error, desactivar el loading para permitir reintentar
      console.error("Error en login:", err);
      setIsSubmitting(false);
    }
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : undefined;

  // El loading del overlay debe ser controlado SOLO por isSubmitting
  // No incluir isLoginLoading porque puede cambiar antes de que termine el proceso
  const isLoading = isSubmitting || isAltchaLoading;

  return {
    form,
    isLoginLoading: isLoading,
    errorMessage: errorMessage || (altchaError ? altchaError.message : undefined),
    onFinish,
    shouldRedirect: !isAuthLoading && hasSession,
  };
};
