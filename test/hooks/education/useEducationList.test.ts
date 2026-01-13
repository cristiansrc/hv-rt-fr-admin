import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import * as api from "../../../src/api";
import { useEducationList } from "../../../src/hooks/education/useEducationList";

const { notifySuccess, notifyError } = vi.hoisted(() => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

vi.mock("../../../src/api");
vi.mock("../../../src/hooks/useNotifier", () => ({
  useNotifier: () => ({ notifySuccess, notifyError }),
}));

describe("useEducationList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads educations on mount", async () => {
    const educations = [
      {
        id: 1,
        institution: "Universidad Test",
        degree: "Licenciatura",
        degreeEng: "Bachelor",
        startDate: "2020-01-01",
        endDate: "2024-01-01",
      },
    ];
    (api.getEducations as unknown as vi.Mock).mockResolvedValue(educations);

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.getEducations).toHaveBeenCalled();
    expect(result.current.data).toEqual(educations);
  });

  it("handles null response from API", async () => {
    (api.getEducations as unknown as vi.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });

  it("shows error when loading fails", async () => {
    (api.getEducations as unknown as vi.Mock).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo cargar la lista de estudios",
    });
  });

  it("deletes an education successfully", async () => {
    const educations = [
      {
        id: 1,
        institution: "Universidad Test",
        degree: "Licenciatura",
        degreeEng: "Bachelor",
        startDate: "2020-01-01",
        endDate: "2024-01-01",
      },
    ];
    (api.getEducations as unknown as vi.Mock).mockResolvedValue(educations);
    (api.deleteEducation as unknown as vi.Mock).mockResolvedValue({ status: 204 });

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(api.deleteEducation).toHaveBeenCalledWith(1);
    expect(notifySuccess).toHaveBeenCalledWith({
      message: "Estudio eliminado",
      description: "El estudio se eliminó correctamente.",
    });
    expect(api.getEducations).toHaveBeenCalledTimes(2); // Once on mount, once after delete
  });

  it("handles delete with status 200", async () => {
    (api.getEducations as unknown as vi.Mock).mockResolvedValue([]);
    (api.deleteEducation as unknown as vi.Mock).mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(notifySuccess).toHaveBeenCalled();
  });

  it("handles delete with status 201", async () => {
    (api.getEducations as unknown as vi.Mock).mockResolvedValue([]);
    (api.deleteEducation as unknown as vi.Mock).mockResolvedValue({ status: 201 });

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(notifySuccess).toHaveBeenCalled();
  });

  it("handles unexpected delete response status", async () => {
    (api.getEducations as unknown as vi.Mock).mockResolvedValue([]);
    (api.deleteEducation as unknown as vi.Mock).mockResolvedValue({ status: 500 });

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo eliminar el estudio",
    });
  });

  it("handles delete API errors", async () => {
    (api.getEducations as unknown as vi.Mock).mockResolvedValue([]);
    (api.deleteEducation as unknown as vi.Mock).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo eliminar el estudio",
    });
  });

  it("sets pending message and shows it after reload", async () => {
    const educations = [
      {
        id: 1,
        institution: "Universidad Test",
        degree: "Licenciatura",
        degreeEng: "Bachelor",
        startDate: "2020-01-01",
        endDate: "2024-01-01",
      },
    ];
    (api.getEducations as unknown as vi.Mock).mockResolvedValue(educations);

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSuccessOnReload("Estudio guardado");
    });

    await act(async () => {
      await result.current.reloadEducations();
    });

    expect(notifySuccess).toHaveBeenCalledWith({
      message: "Estudio guardado",
      description: "Estudio guardado",
    });
  });

  it("shows pending message only after successful reload", async () => {
    (api.getEducations as unknown as vi.Mock)
      .mockResolvedValueOnce([]) // Initial load succeeds
      .mockRejectedValueOnce(new Error("First error")) // Automatic reload from useEffect fails
      .mockRejectedValueOnce(new Error("Second error")) // Manual reload fails
      .mockResolvedValueOnce([]); // Second manual reload succeeds

    const { result } = renderHook(() => useEducationList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear any calls from initial load
    vi.clearAllMocks();

    // Set pending message - this will trigger useEffect which will call loadEducations
    // We've mocked it to fail, so the message should not be shown
    act(() => {
      result.current.setSuccessOnReload("Estudio guardado");
    });

    // Wait for the automatic reload triggered by useEffect to complete (it will fail)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 1000 });

    // After the automatic reload fails, pendingMessage should still be set
    // but notifySuccess should not have been called (because it failed)
    expect(notifySuccess).not.toHaveBeenCalled();

    // Clear any calls from the automatic reload
    vi.clearAllMocks();

    // Now test manual reload that fails
    await act(async () => {
      try {
        await result.current.reloadEducations();
      } catch {
        // Expected to fail
      }
    });

    // After the failed manual reload, pendingMessage should still be set
    // but notifySuccess should not have been called (because it failed)
    expect(notifySuccess).not.toHaveBeenCalled();

    // Second manual reload succeeds, message should be shown
    await act(async () => {
      await result.current.reloadEducations();
    });

    expect(notifySuccess).toHaveBeenCalledWith({
      message: "Estudio guardado",
      description: "Estudio guardado",
    });
  });
});
