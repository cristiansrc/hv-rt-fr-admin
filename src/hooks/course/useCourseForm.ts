import { Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  createCourse,
  getCourse,
  updateCourse,
  type CoursePayload,
  type CourseResponse,
} from "../../api";
import { BASIC_DATA_DATE_FORMAT } from "../../config/basic-data-config";
import { useNotifier } from "../useNotifier";

export interface CourseFormValues {
  name: string;
  nameEng: string;
  institution: string;
  institutionEng: string;
  completionDate?: Dayjs;
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
  certificateUrl?: string;
}

interface UseCourseFormOptions {
  courseId?: number;
  mode: "create" | "edit";
  onSuccess?: (message: string) => void;
}

export const useCourseForm = ({
  courseId,
  mode,
  onSuccess,
}: UseCourseFormOptions) => {
  const [form] = Form.useForm<CourseFormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const loadCourse = useCallback(async () => {
    if (mode !== "edit" || !courseId) {
      return;
    }
    setLoading(true);
    try {
      const data: CourseResponse = await getCourse(courseId);
      form.setFieldsValue({
        name: data.name,
        nameEng: data.nameEng,
        institution: data.institution,
        institutionEng: data.institutionEng,
        completionDate: data.completionDate
          ? dayjs(data.completionDate)
          : undefined,
        description: data.description ?? undefined,
        descriptionEng: data.descriptionEng ?? undefined,
        summaryPdf: data.summaryPdf ?? undefined,
        summaryPdfEng: data.summaryPdfEng ?? undefined,
        certificateUrl: data.certificateUrl ?? undefined,
      });
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar el curso",
      });
    } finally {
      setLoading(false);
    }
  }, [courseId, form, mode, notifyError]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleSubmit = useCallback(
    async (values: CourseFormValues) => {
      setSaving(true);
      try {
        const payload: CoursePayload = {
          name: values.name,
          nameEng: values.nameEng,
          institution: values.institution,
          institutionEng: values.institutionEng,
          completionDate: values.completionDate
            ? values.completionDate.format(BASIC_DATA_DATE_FORMAT)
            : undefined,
          description: values.description,
          descriptionEng: values.descriptionEng,
          summaryPdf: values.summaryPdf,
          summaryPdfEng: values.summaryPdfEng,
          certificateUrl: values.certificateUrl,
        };
        const response =
          mode === "edit" && courseId
            ? await updateCourse(courseId, payload)
            : await createCourse(payload);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          const successMessage =
            mode === "edit" ? "Curso actualizado" : "Curso creado";
          if (onSuccess) {
            onSuccess(successMessage);
          } else {
            notifySuccess({
              message: successMessage,
              description:
                mode === "edit"
                  ? "El curso se actualizó correctamente."
                  : "El curso se creó correctamente.",
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
              ? "No se pudo actualizar el curso"
              : "No se pudo crear el curso",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [courseId, mode, notifyError, notifySuccess, onSuccess],
  );

  return {
    form,
    isLoading,
    isSaving,
    handleSubmit,
  };
};
