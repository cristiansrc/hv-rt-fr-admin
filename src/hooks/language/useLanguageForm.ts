import { Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  createLanguage,
  getLanguage,
  updateLanguage,
  type LanguagePayload,
  type LanguageResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export interface LanguageFormValues {
  language: string;
  languageEng: string;
  readingLevel: string;
  writingLevel: string;
  speakingLevel: string;
}

interface UseLanguageFormOptions {
  languageId?: number;
  mode: "create" | "edit";
  onSuccess?: (message: string) => void;
}

export const useLanguageForm = ({
  languageId,
  mode,
  onSuccess,
}: UseLanguageFormOptions) => {
  const [form] = Form.useForm<LanguageFormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadLanguage = useCallback(async () => {
    if (mode !== "edit" || !languageId) {
      return;
    }
    setLoading(true);
    try {
      const data: LanguageResponse = await getLanguage(languageId);
      form.setFieldsValue({
        language: data.language,
        languageEng: data.languageEng,
        readingLevel: data.readingLevel,
        writingLevel: data.writingLevel,
        speakingLevel: data.speakingLevel,
      });
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar el idioma",
      });
    } finally {
      setLoading(false);
    }
  }, [languageId, form, mode, notifyError]);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  const handleSubmit = useCallback(
    async (values: LanguageFormValues) => {
      setSaving(true);
      try {
        const payload: LanguagePayload = {
          language: values.language,
          languageEng: values.languageEng,
          readingLevel: values.readingLevel,
          writingLevel: values.writingLevel,
          speakingLevel: values.speakingLevel,
        };
        const response =
          mode === "edit" && languageId
            ? await updateLanguage(languageId, payload)
            : await createLanguage(payload);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          const successMessage =
            mode === "edit" ? "Idioma actualizado" : "Idioma creado";
          if (onSuccess) {
            onSuccess(successMessage);
          } else {
            notifySuccess({
              message: successMessage,
              description:
                mode === "edit"
                  ? "El idioma se actualizó correctamente."
                  : "El idioma se creó correctamente.",
            });
          }
          return true;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description:
            mode === "edit"
              ? "No se pudo actualizar el idioma"
              : "No se pudo crear el idioma",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [languageId, mode, notifyError, notifySuccess, onSuccess],
  );

  return {
    form,
    isLoading,
    isSaving,
    handleSubmit,
  };
};
