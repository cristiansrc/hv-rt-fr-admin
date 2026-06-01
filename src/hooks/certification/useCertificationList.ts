import { useCallback, useEffect, useState } from "react";
import {
  deleteCertification,
  getCertifications,
  type CertificationResponse,
} from "../../api";
import { useNotifier } from "../useNotifier";

export const useCertificationList = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [data, setData] = useState<CertificationResponse[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const loadCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCertifications();
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
        description: "No se pudo cargar la lista de certificaciones",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const handleDelete = useCallback(
    async (certificationId: number) => {
      setBusy(true);
      try {
        const { status } = await deleteCertification(certificationId);
        if (status === 200 || status === 201 || status === 204) {
          notifySuccess({
            message: "Certificación eliminada",
            description: "La certificación se eliminó correctamente.",
          });
          await loadCertifications();
          return;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description: "No se pudo eliminar la certificación",
        });
      } finally {
        setBusy(false);
      }
    },
    [loadCertifications, notifyError, notifySuccess],
  );

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadCertifications: loadCertifications,
    setSuccessOnReload,
  };
};
