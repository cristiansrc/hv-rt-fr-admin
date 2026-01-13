import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import * as api from "../../../src/api";
import { BASIC_DATA_DATE_FORMAT } from "../../../src/config/basic-data-config";
import { useEducationForm } from "../../../src/hooks/education/useEducationForm";

const { notifySuccess, notifyError, setFieldsValue } = vi.hoisted(() => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  setFieldsValue: vi.fn(),
}));

vi.mock("antd", async () => {
  const actual = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...actual,
    Form: {
      ...actual.Form,
      useForm: () => [{ setFieldsValue }],
    },
  };
});

vi.mock("../../../src/api");
vi.mock("../../../src/hooks/useNotifier", () => ({
  useNotifier: () => ({ notifySuccess, notifyError }),
}));

describe("useEducationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads an education when editing", async () => {
    (api.getEducation as unknown as vi.Mock).mockResolvedValue({
      id: 1,
      institution: "Universidad Test",
      area: "Ingeniería",
      areaEng: "Engineering",
      degree: "Licenciatura",
      degreeEng: "Bachelor",
      startDate: "2020-01-01",
      endDate: "2024-01-01",
      location: "Lima",
      locationEng: "Lima",
      highlights: ["Highlight 1"],
      highlightsEng: ["Highlight 1 EN"],
    });

    const { result } = renderHook(() =>
      useEducationForm({ educationId: 1, mode: "edit" }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.getEducation).toHaveBeenCalledWith(1);
    expect(setFieldsValue).toHaveBeenCalledWith({
      startDate: dayjs("2020-01-01"),
      endDate: dayjs("2024-01-01"),
      institution: "Universidad Test",
      area: "Ingeniería",
      areaEng: "Engineering",
      degree: "Licenciatura",
      degreeEng: "Bachelor",
      location: "Lima",
      locationEng: "Lima",
      highlights: ["Highlight 1"],
      highlightsEng: ["Highlight 1 EN"],
    });
  });

  it("handles missing dates when loading education", async () => {
    (api.getEducation as unknown as vi.Mock).mockResolvedValue({
      id: 1,
      institution: "Universidad Test",
      area: "Ingeniería",
      areaEng: "Engineering",
      degree: "Licenciatura",
      degreeEng: "Bachelor",
      startDate: undefined,
      endDate: undefined,
      location: "Lima",
      locationEng: "Lima",
      highlights: [],
      highlightsEng: [],
    });

    const { result } = renderHook(() =>
      useEducationForm({ educationId: 1, mode: "edit" }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(setFieldsValue).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: undefined,
        endDate: undefined,
      }),
    );
  });

  it("shows error when loading education fails", async () => {
    (api.getEducation as unknown as vi.Mock).mockRejectedValue(
      new Error("Failed to load"),
    );

    const { result } = renderHook(() =>
      useEducationForm({ educationId: 1, mode: "edit" }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo cargar el estudio",
    });
  });

  it("does not load when in create mode", async () => {
    const { result } = renderHook(() =>
      useEducationForm({ mode: "create" }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.getEducation).not.toHaveBeenCalled();
  });

  it("creates an education successfully", async () => {
    (api.createEducation as unknown as vi.Mock).mockResolvedValue({ status: 201 });

    const { result } = renderHook(() =>
      useEducationForm({ mode: "create" }),
    );

    await act(async () => {
      const success = await result.current.handleSubmit({
        institution: "New University",
        area: "Science",
        areaEng: "Science",
        degree: "PhD",
        degreeEng: "PhD",
        location: "Lima",
        locationEng: "Lima",
        startDate: dayjs("2024-01-01"),
        endDate: dayjs("2026-01-01"),
        highlights: [],
        highlightsEng: [],
      });

      expect(success).toBe(true);
    });

    expect(api.createEducation).toHaveBeenCalledWith({
      institution: "New University",
      area: "Science",
      areaEng: "Science",
      degree: "PhD",
      degreeEng: "PhD",
      startDate: "2024-01-01",
      endDate: "2026-01-01",
      location: "Lima",
      locationEng: "Lima",
      highlights: [],
      highlightsEng: [],
    });
    expect(notifySuccess).toHaveBeenCalledWith({
      message: "Estudio creado",
      description: "El estudio se creó correctamente.",
    });
  });

  it("updates an education successfully", async () => {
    (api.updateEducation as unknown as vi.Mock).mockResolvedValue({ status: 204 });

    const { result } = renderHook(() =>
      useEducationForm({ educationId: 1, mode: "edit" }),
    );

    await waitFor(async () => {
      const success = await result.current.handleSubmit({
        institution: "Updated University",
        area: "Engineering",
        areaEng: "Engineering",
        degree: "Master",
        degreeEng: "Master",
        location: "Lima",
        locationEng: "Lima",
        startDate: dayjs("2020-01-01"),
        endDate: dayjs("2022-01-01"),
        highlights: ["New highlight"],
        highlightsEng: ["New highlight EN"],
      });

      expect(success).toBe(true);
    });

    expect(api.updateEducation).toHaveBeenCalledWith(1, {
      institution: "Updated University",
      area: "Engineering",
      areaEng: "Engineering",
      degree: "Master",
      degreeEng: "Master",
      startDate: "2020-01-01",
      endDate: "2022-01-01",
      location: "Lima",
      locationEng: "Lima",
      highlights: ["New highlight"],
      highlightsEng: ["New highlight EN"],
    });
    expect(notifySuccess).toHaveBeenCalledWith({
      message: "Estudio actualizado",
      description: "El estudio se actualizó correctamente.",
    });
  }, 10000);

  it("calls onSuccess callback when provided", async () => {
    const onSuccessMock = vi.fn();
    (api.createEducation as unknown as vi.Mock).mockResolvedValue({ status: 201 });

    const { result } = renderHook(() =>
      useEducationForm({ mode: "create", onSuccess: onSuccessMock }),
    );

    await act(async () => {
      await result.current.handleSubmit({
        institution: "New University",
        area: "Science",
        areaEng: "Science",
        degree: "PhD",
        degreeEng: "PhD",
        location: "Lima",
        locationEng: "Lima",
        highlights: [],
        highlightsEng: [],
      });
    });

    expect(onSuccessMock).toHaveBeenCalledWith("Estudio creado");
    expect(notifySuccess).not.toHaveBeenCalled();
  });

  it("handles missing dates in form values", async () => {
    (api.createEducation as unknown as vi.Mock).mockResolvedValue({ status: 201 });

    const { result } = renderHook(() =>
      useEducationForm({ mode: "create" }),
    );

    await act(async () => {
      await result.current.handleSubmit({
        institution: "New University",
        area: "Science",
        areaEng: "Science",
        degree: "PhD",
        degreeEng: "PhD",
        location: "Lima",
        locationEng: "Lima",
        startDate: undefined,
        endDate: undefined,
        highlights: [],
        highlightsEng: [],
      });
    });

    expect(api.createEducation).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: "",
        endDate: "",
      }),
    );
  });

  it("handles missing highlights arrays", async () => {
    (api.createEducation as unknown as vi.Mock).mockResolvedValue({ status: 201 });

    const { result } = renderHook(() =>
      useEducationForm({ mode: "create" }),
    );

    await act(async () => {
      await result.current.handleSubmit({
        institution: "New University",
        area: "Science",
        areaEng: "Science",
        degree: "PhD",
        degreeEng: "PhD",
        location: "Lima",
        locationEng: "Lima",
        highlights: undefined,
        highlightsEng: undefined,
      });
    });

    expect(api.createEducation).toHaveBeenCalledWith(
      expect.objectContaining({
        highlights: [],
        highlightsEng: [],
      }),
    );
  });

  it("handles unexpected response status", async () => {
    (api.createEducation as unknown as vi.Mock).mockResolvedValue({ status: 500 });

    const { result } = renderHook(() =>
      useEducationForm({ mode: "create" }),
    );

    await act(async () => {
      const success = await result.current.handleSubmit({
        institution: "New University",
        area: "Science",
        areaEng: "Science",
        degree: "PhD",
        degreeEng: "PhD",
        location: "Lima",
        locationEng: "Lima",
        highlights: [],
        highlightsEng: [],
      });

      expect(success).toBe(false);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo crear el estudio",
    });
  });

  it("handles API errors during create", async () => {
    (api.createEducation as unknown as vi.Mock).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() =>
      useEducationForm({ mode: "create" }),
    );

    await act(async () => {
      const success = await result.current.handleSubmit({
        institution: "New University",
        area: "Science",
        areaEng: "Science",
        degree: "PhD",
        degreeEng: "PhD",
        location: "Lima",
        locationEng: "Lima",
        highlights: [],
        highlightsEng: [],
      });

      expect(success).toBe(false);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo crear el estudio",
    });
  });

  it("handles API errors during update", async () => {
    (api.updateEducation as unknown as vi.Mock).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() =>
      useEducationForm({ educationId: 1, mode: "edit" }),
    );

    await waitFor(async () => {
      const success = await result.current.handleSubmit({
        institution: "Updated University",
        area: "Engineering",
        areaEng: "Engineering",
        degree: "Master",
        degreeEng: "Master",
        location: "Lima",
        locationEng: "Lima",
        highlights: [],
        highlightsEng: [],
      });

      expect(success).toBe(false);
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: "Error",
      description: "No se pudo actualizar el estudio",
    });
  }, 10000);

  it("handles status 200 as success", async () => {
    (api.updateEducation as unknown as vi.Mock).mockResolvedValue({ status: 200 });

    const { result } = renderHook(() =>
      useEducationForm({ educationId: 1, mode: "edit" }),
    );

    await waitFor(async () => {
      const success = await result.current.handleSubmit({
        institution: "Updated University",
        area: "Engineering",
        areaEng: "Engineering",
        degree: "Master",
        degreeEng: "Master",
        location: "Lima",
        locationEng: "Lima",
        highlights: [],
        highlightsEng: [],
      });

      expect(success).toBe(true);
    });

    expect(notifySuccess).toHaveBeenCalledWith({
      message: "Estudio actualizado",
      description: "El estudio se actualizó correctamente.",
    });
  }, 10000);
});
