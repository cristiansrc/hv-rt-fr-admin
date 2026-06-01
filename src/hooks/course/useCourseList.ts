import { useCallback, useEffect, useState } from "react";
import { deleteCourse, getCourses, type CourseResponse } from "../../api";
import { useNotifier } from "../useNotifier";

export const useCourseList = () => {
  const { notifyError, notifySuccess } = useNotifier();
  const [isLoading, setLoading] = useState(true);
  const [isBusy, setBusy] = useState(false);
  const [data, setData] = useState<CourseResponse[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCourses();
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
        description: "No se pudo cargar la lista de cursos",
      });
    } finally {
      setLoading(false);
    }
  }, [notifyError, notifySuccess, pendingMessage]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDelete = useCallback(
    async (courseId: number) => {
      setBusy(true);
      try {
        const { status } = await deleteCourse(courseId);
        if (status === 200 || status === 201 || status === 204) {
          notifySuccess({
            message: "Curso eliminado",
            description: "El curso se eliminó correctamente.",
          });
          await loadCourses();
          return;
        }
        throw new Error("Respuesta inesperada");
      } catch {
        notifyError({
          message: "Error",
          description: "No se pudo eliminar el curso",
        });
      } finally {
        setBusy(false);
      }
    },
    [loadCourses, notifyError, notifySuccess],
  );

  const setSuccessOnReload = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  return {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadCourses: loadCourses,
    setSuccessOnReload,
  };
};
