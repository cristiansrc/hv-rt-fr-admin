import { Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  createCustomSection,
  getCustomSection,
  updateCustomSection,
  type CustomSectionPayload,
  type CustomSectionResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export interface CustomSectionFormValues {
  title: string;
  titleEng: string;
  content?: string;
  contentEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
  visible: boolean;
}

interface UseCustomSectionFormOptions {
  customSectionId?: number;
  mode: "create" | "edit";
  onSuccess?: (message: string) => void;
}

export const useCustomSectionForm = ({
  customSectionId,
  mode,
  onSuccess,
}: UseCustomSectionFormOptions) => {
  const [form] = Form.useForm<CustomSectionFormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadCustomSection = useCallback(async () => {
    if (mode !== "edit" || !customSectionId) {
      return;
    }
    setLoading(true);
    try {
      const data: CustomSectionResponse = await getCustomSection(customSectionId);
      form.setFieldsValue({
        title: data.title,
        titleEng: data.titleEng,
        content: data.content ?? undefined,
        contentEng: data.contentEng ?? undefined,
        summaryPdf: data.summaryPdf ?? undefined,
        summaryPdfEng: data.summaryPdfEng ?? undefined,
        visible: data.visible,
      });
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar la sección personalizada",
      });
    } finally {
      setLoading(false);
    }
  }, [customSectionId, form, mode, notifyError]);

  useEffect(() => {
    loadCustomSection();
  }, [loadCustomSection]);

  const handleSubmit = useCallback(
    async (values: CustomSectionFormValues) => {
      setSaving(true);
      try {
        const payload: CustomSectionPayload = {
          title: values.title,
          titleEng: values.titleEng,
          content: values.content,
          contentEng: values.contentEng,
          summaryPdf: values.summaryPdf,
          summaryPdfEng: values.summaryPdfEng,
          visible: values.visible,
        };
        const response =
          mode === "edit" && customSectionId
            ? await updateCustomSection(customSectionId, payload)
            : await createCustomSection(payload);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          const successMessage =
            mode === "edit"
              ? "Sección personalizada actualizada"
              : "Sección personalizada creada";
          if (onSuccess) {
            onSuccess(successMessage);
          } else {
            notifySuccess({
              message: successMessage,
              description:
                mode === "edit"
                  ? "La sección personalizada se actualizó correctamente."
                  : "La sección personalizada se creó correctamente.",
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
              ? "No se pudo actualizar la sección personalizada"
              : "No se pudo crear la sección personalizada",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [customSectionId, mode, notifyError, notifySuccess, onSuccess],
  );

  return {
    form,
    isLoading,
    isSaving,
    handleSubmit,
  };
};
