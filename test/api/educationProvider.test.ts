import { describe, it, expect, vi, beforeEach } from "vitest";
import { axiosClient } from "../../src/api/axiosClient";
import type { EducationPayload } from "../../src/interfaces/education/EducationPayload";
import type { EducationResponse } from "../../src/interfaces/education/EducationResponse";

vi.mock("../../src/api/axiosClient", () => ({
  axiosClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const axiosMock = axiosClient as unknown as {
  get: vi.Mock;
  post: vi.Mock;
  put: vi.Mock;
  delete: vi.Mock;
};

describe("educationProvider", () => {
  beforeEach(() => {
    axiosMock.get.mockReset();
    axiosMock.post.mockReset();
    axiosMock.put.mockReset();
    axiosMock.delete.mockReset();
  });

  it("fetches educations and returns data", async () => {
    const educations: EducationResponse[] = [
      {
        id: 1,
        institution: "Universidad Test",
        degree: "Ingeniería",
        degreeEng: "Engineering",
        startDate: "2020-01-01",
        endDate: "2024-01-01",
      },
    ];
    axiosMock.get.mockResolvedValueOnce({ data: educations });

    const { getEducations } = await import("../../src/api/educationProvider");
    const result = await getEducations();

    expect(axiosMock.get).toHaveBeenCalledWith("/education");
    expect(result).toEqual(educations);
  });

  it("fetches a single education by id", async () => {
    const education: EducationResponse = {
      id: 2,
      institution: "Universidad Test 2",
      degree: "Maestría",
      degreeEng: "Master",
      startDate: "2022-01-01",
      endDate: "2024-01-01",
    };
    axiosMock.get.mockResolvedValueOnce({ data: education });

    const { getEducation } = await import("../../src/api/educationProvider");
    const result = await getEducation(2);

    expect(axiosMock.get).toHaveBeenCalledWith("/education/2");
    expect(result).toEqual(education);
  });

  it("creates an education and returns status", async () => {
    const payload: EducationPayload = {
      institution: "Universidad Nueva",
      degree: "Doctorado",
      degreeEng: "PhD",
      startDate: "2024-01-01",
      endDate: "2026-01-01",
    };
    axiosMock.post.mockResolvedValueOnce({ status: 201 });

    const { createEducation } = await import("../../src/api/educationProvider");
    const result = await createEducation(payload);

    expect(axiosMock.post).toHaveBeenCalledWith("/education", payload);
    expect(result).toEqual({ status: 201 });
  });

  it("updates an education and returns status", async () => {
    const payload: EducationPayload = {
      institution: "Universidad Actualizada",
      degree: "Licenciatura",
      degreeEng: "Bachelor",
      startDate: "2020-01-01",
      endDate: "2024-01-01",
    };
    axiosMock.put.mockResolvedValueOnce({ status: 204 });

    const { updateEducation } = await import("../../src/api/educationProvider");
    const result = await updateEducation(5, payload);

    expect(axiosMock.put).toHaveBeenCalledWith("/education/5", payload);
    expect(result).toEqual({ status: 204 });
  });

  it("deletes an education and returns status", async () => {
    axiosMock.delete.mockResolvedValueOnce({ status: 204 });

    const { deleteEducation } = await import("../../src/api/educationProvider");
    const result = await deleteEducation(3);

    expect(axiosMock.delete).toHaveBeenCalledWith("/education/3");
    expect(result).toEqual({ status: 204 });
  });
});
