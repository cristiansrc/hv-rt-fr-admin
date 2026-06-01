import { Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  createCertification,
  getCertification,
  updateCertification,
  type CertificationPayload,
  type CertificationResponse,
} from "../../api";
import { BASIC_DATA_DATE_FORMAT } from "../../config/basic-data-config";
import { useNotifier } from "../useNotifier";

export interface CertificationFormValues {
  name: string;
  nameEng: string;
  issuingOrganization: string;
  issuingOrganizationEng: string;
  issueDate?: Dayjs;
  expirationDate?: Dayjs;
  verificationUrl?: string;
  credentialId?: string;
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
}

interface UseCertificationFormOptions {
  certificationId?: number;
  mode: "create" | "edit";
  onSuccess?: (message: string) => void;
}

export const useCertificationForm = ({
  certificationId,
  mode,
  onSuccess,
}: UseCertificationFormOptions) => {
  const [form] = Form.useForm<CertificationFormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadCertification = useCallback(async () => {
    if (mode !== "edit" || !certificationId) {
      return;
    }
    setLoading(true);
    try {
      const data: CertificationResponse = await getCertification(certificationId);
      form.setFieldsValue({
        name: data.name,
        nameEng: data.nameEng,
        issuingOrganization: data.issuingOrganization,
        issuingOrganizationEng: data.issuingOrganizationEng,
        issueDate: data.issueDate ? dayjs(data.issueDate) : undefined,
        expirationDate: data.expirationDate
          ? dayjs(data.expirationDate)
          : undefined,
        verificationUrl: data.verificationUrl ?? undefined,
        credentialId: data.credentialId ?? undefined,
        description: data.description ?? undefined,
        descriptionEng: data.descriptionEng ?? undefined,
        summaryPdf: data.summaryPdf ?? undefined,
        summaryPdfEng: data.summaryPdfEng ?? undefined,
      });
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar la certificación",
      });
    } finally {
      setLoading(false);
    }
  }, [certificationId, form, mode, notifyError]);

  useEffect(() => {
    loadCertification();
  }, [loadCertification]);

  const handleSubmit = useCallback(
    async (values: CertificationFormValues) => {
      setSaving(true);
      try {
        const payload: CertificationPayload = {
          name: values.name,
          nameEng: values.nameEng,
          issuingOrganization: values.issuingOrganization,
          issuingOrganizationEng: values.issuingOrganizationEng,
          issueDate: values.issueDate
            ? values.issueDate.format(BASIC_DATA_DATE_FORMAT)
            : "",
          expirationDate: values.expirationDate
            ? values.expirationDate.format(BASIC_DATA_DATE_FORMAT)
            : undefined,
          verificationUrl: values.verificationUrl,
          credentialId: values.credentialId,
          description: values.description,
          descriptionEng: values.descriptionEng,
          summaryPdf: values.summaryPdf,
          summaryPdfEng: values.summaryPdfEng,
        };
        const response =
          mode === "edit" && certificationId
            ? await updateCertification(certificationId, payload)
            : await createCertification(payload);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          const successMessage =
            mode === "edit"
              ? "Certificación actualizada"
              : "Certificación creada";
          if (onSuccess) {
            onSuccess(successMessage);
          } else {
            notifySuccess({
              message: successMessage,
              description:
                mode === "edit"
                  ? "La certificación se actualizó correctamente."
                  : "La certificación se creó correctamente.",
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
              ? "No se pudo actualizar la certificación"
              : "No se pudo crear la certificación",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [certificationId, mode, notifyError, notifySuccess, onSuccess],
  );

  return {
    form,
    isLoading,
    isSaving,
    handleSubmit,
  };
};
