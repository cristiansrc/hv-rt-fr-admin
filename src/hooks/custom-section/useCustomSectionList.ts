import { useCallback, useEffect, useState } from "react";
import {
  deleteCustomSection,
  getCustomSections,
  type CustomSectionResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export const useCustomSectionList = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [data, setData] = useState<CustomSectionResponse[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const loadCustomSections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCustomSections();
      setData(response ?? []);
      if (pendingMessage) {
        notifySuccess({
          message: pendingMessage,
          description: pendingMessage,
        });
        setPendingMessage(null);
      }
    } catch {
      notifyError({
        message: "Error",
        description: "No se pudo cargar la lista de secciones personalizadas",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    loadCustomSections();
  }, [loadCustomSections]);

  const handleDelete = useCallback(
    async (customSectionId: number) => {
      setBusy(true);
      try {
        const { status } = await deleteCustomSection(customSectionId);
        if (status === 200 || status === 201 || status === 204) {
          notifySuccess({
            message: "Sección personalizada eliminada",
            description: "La sección personalizada se eliminó correctamente.",
          });
          await loadCustomSections();
          return;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description: "No se pudo eliminar la sección personalizada",
        });
      } finally {
        setBusy(false);
      }
    },
    [loadCustomSections, notifyError, notifySuccess],
  );

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadCustomSections: loadCustomSections,
    setSuccessOnReload,
  };
};
