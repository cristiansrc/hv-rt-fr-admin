import { useCallback, useEffect, useState } from "react";
import {
  deleteReference,
  getReferences,
  type ReferenceResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export const useReferenceList = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [data, setData] = useState<ReferenceResponse[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const loadReferences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReferences();
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
        description: "No se pudo cargar la lista de referencias",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  const handleDelete = useCallback(
    async (referenceId: number) => {
      setBusy(true);
      try {
        const { status } = await deleteReference(referenceId);
        if (status === 200 || status === 201 || status === 204) {
          notifySuccess({
            message: "Referencia eliminada",
            description: "La referencia se eliminó correctamente.",
          });
          await loadReferences();
          return;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description: "No se pudo eliminar la referencia",
        });
      } finally {
        setBusy(false);
      }
    },
    [loadReferences, notifyError, notifySuccess],
  );

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadReferences: loadReferences,
    setSuccessOnReload,
  };
};
