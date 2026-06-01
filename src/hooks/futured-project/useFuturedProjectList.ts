import { useCallback, useEffect, useState } from "react";
import {
  deleteFuturedProject,
  getFuturedProjects,
  type FuturedProjectResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export const useFuturedProjectList = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [data, setData] = useState<FuturedProjectResponse[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const loadFuturedProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFuturedProjects();
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
        description: "No se pudo cargar la lista de proyectos destacados",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    loadFuturedProjects();
  }, [loadFuturedProjects]);

  const handleDelete = useCallback(
    async (futuredProjectId: number) => {
      setBusy(true);
      try {
        const { status } = await deleteFuturedProject(futuredProjectId);
        if (status === 200 || status === 201 || status === 204) {
          notifySuccess({
            message: "Proyecto destacado eliminado",
            description: "El proyecto destacado se eliminó correctamente.",
          });
          await loadFuturedProjects();
          return;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description: "No se pudo eliminar el proyecto destacado",
        });
      } finally {
        setBusy(false);
      }
    },
    [loadFuturedProjects, notifyError, notifySuccess],
  );

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadFuturedProjects: loadFuturedProjects,
    setSuccessOnReload,
  };
};
