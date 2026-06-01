import { Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  createFuturedProject,
  getFuturedProject,
  updateFuturedProject,
  type ExperienceResponse,
  type FuturedProjectPayload,
  type FuturedProjectResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export interface FuturedProjectFormValues {
  name: string;
  nameEng: string;
  experienceId?: number;
  descriptionShort: string;
  description: string;
  descriptionShortEng: string;
  descriptionEng: string;
  imageListUrlId?: number;
  imageUrlId?: number;
}

interface UseFuturedProjectFormOptions {
  futuredProjectId?: number;
  mode: "create" | "edit";
  onSuccess?: (message: string) => void;
}

export const useFuturedProjectForm = ({
  futuredProjectId,
  mode,
  onSuccess,
}: UseFuturedProjectFormOptions) => {
  const [form] = Form.useForm<FuturedProjectFormValues>();
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceResponse | null>(null);

  const loadFuturedProject = useCallback(async () => {
    if (mode !== "edit" || !futuredProjectId) {
      return;
    }
    setLoading(true);
    try {
      const data: FuturedProjectResponse =
        await getFuturedProject(futuredProjectId);
      form.setFieldsValue({
        name: data.name,
        nameEng: data.nameEng,
        experienceId: data.experience.id,
        descriptionShort: data.descriptionShort,
        description: data.description,
        descriptionShortEng: data.descriptionShortEng,
        descriptionEng: data.descriptionEng,
        imageListUrlId: data.imageListUrl?.id ?? undefined,
        imageUrlId: data.imageUrl?.id ?? undefined,
      });
      setSelectedExperience(data.experience);
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar el proyecto destacado",
      });
    } finally {
      setLoading(false);
    }
  }, [futuredProjectId, form, mode, notifyError]);

  useEffect(() => {
    loadFuturedProject();
  }, [loadFuturedProject]);

  const handleExperienceSelect = useCallback(
    (selectedIds: number[], selectedRecords: ExperienceResponse[]) => {
      if (selectedRecords.length) {
        setSelectedExperience(selectedRecords[0]);
      }
      if (selectedIds.length) {
        form.setFieldsValue({ experienceId: selectedIds[0] });
      }
    },
    [form],
  );

  const handleSubmit = useCallback(
    async (values: FuturedProjectFormValues) => {
      setSaving(true);
      try {
        const payload: FuturedProjectPayload = {
          name: values.name,
          nameEng: values.nameEng,
          experienceId: values.experienceId ?? 0,
          descriptionShort: values.descriptionShort,
          description: values.description,
          descriptionShortEng: values.descriptionShortEng,
          descriptionEng: values.descriptionEng,
          imageListUrlId: values.imageListUrlId,
          imageUrlId: values.imageUrlId,
        };
        const response =
          mode === "edit" && futuredProjectId
            ? await updateFuturedProject(futuredProjectId, payload)
            : await createFuturedProject(payload);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          const successMessage =
            mode === "edit"
              ? "Proyecto destacado actualizado"
              : "Proyecto destacado creado";
          if (onSuccess) {
            onSuccess(successMessage);
          } else {
            notifySuccess({
              message: successMessage,
              description:
                mode === "edit"
                  ? "El proyecto destacado se actualizó correctamente."
                  : "El proyecto destacado se creó correctamente.",
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
              ? "No se pudo actualizar el proyecto destacado"
              : "No se pudo crear el proyecto destacado",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [futuredProjectId, mode, notifyError, notifySuccess, onSuccess],
  );

  return {
    form,
    isLoading,
    isSaving,
    selectedExperience,
    handleExperienceSelect,
    handleSubmit,
  };
};
