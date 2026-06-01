import { Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  createReference,
  getReference,
  updateReference,
  type ReferencePayload,
  type ReferenceResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export interface ReferenceFormValues {
  fullName: string;
  position: string;
  company?: string;
  companyEng?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  relationshipEng?: string;
}

interface UseReferenceFormOptions {
  referenceId?: number;
  mode: "create" | "edit";
  onSuccess?: (message: string) => void;
}

export const useReferenceForm = ({
  referenceId,
  mode,
  onSuccess,
}: UseReferenceFormOptions) => {
  const [form] = Form.useForm<ReferenceFormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadReference = useCallback(async () => {
    if (mode !== "edit" || !referenceId) {
      return;
    }
    setLoading(true);
    try {
      const data: ReferenceResponse = await getReference(referenceId);
      form.setFieldsValue({
        fullName: data.fullName,
        position: data.position,
        company: data.company ?? undefined,
        companyEng: data.companyEng ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        relationship: data.relationship ?? undefined,
        relationshipEng: data.relationshipEng ?? undefined,
      });
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar la referencia",
      });
    } finally {
      setLoading(false);
    }
  }, [referenceId, form, mode, notifyError]);

  useEffect(() => {
    loadReference();
  }, [loadReference]);

  const handleSubmit = useCallback(
    async (values: ReferenceFormValues) => {
      setSaving(true);
      try {
        const payload: ReferencePayload = {
          fullName: values.fullName,
          position: values.position,
          company: values.company,
          companyEng: values.companyEng,
          email: values.email,
          phone: values.phone,
          relationship: values.relationship,
          relationshipEng: values.relationshipEng,
        };
        const response =
          mode === "edit" && referenceId
            ? await updateReference(referenceId, payload)
            : await createReference(payload);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          const successMessage =
            mode === "edit" ? "Referencia actualizada" : "Referencia creada";
          if (onSuccess) {
            onSuccess(successMessage);
          } else {
            notifySuccess({
              message: successMessage,
              description:
                mode === "edit"
                  ? "La referencia se actualizó correctamente."
                  : "La referencia se creó correctamente.",
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
              ? "No se pudo actualizar la referencia"
              : "No se pudo crear la referencia",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [referenceId, mode, notifyError, notifySuccess, onSuccess],
  );

  return {
    form,
    isLoading,
    isSaving,
    handleSubmit,
  };
};
