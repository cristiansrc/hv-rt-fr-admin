import { useCallback, useEffect, useState } from "react";
import { deleteLanguage, getLanguages, type LanguageResponse } from "../../api";
import { useNotifier } from "../useNotifier";

export const useLanguageList = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [data, setData] = useState<LanguageResponse[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const loadLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLanguages();
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
        description: "No se pudo cargar la lista de idiomas",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  const handleDelete = useCallback(
    async (languageId: number) => {
      setBusy(true);
      try {
        const { status } = await deleteLanguage(languageId);
        if (status === 200 || status === 201 || status === 204) {
          notifySuccess({
            message: "Idioma eliminado",
            description: "El idioma se eliminó correctamente.",
          });
          await loadLanguages();
          return;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description: "No se pudo eliminar el idioma",
        });
      } finally {
        setBusy(false);
      }
    },
    [loadLanguages, notifyError, notifySuccess],
  );

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadLanguages: loadLanguages,
    setSuccessOnReload,
  };
};
