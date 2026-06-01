import { axiosClient } from "./axiosClient";
import type { FuturedProjectPayload } from "../interfaces/futured-project/FuturedProjectPayload";
import type { FuturedProjectResponse } from "../interfaces/futured-project/FuturedProjectResponse";

export type { FuturedProjectPayload, FuturedProjectResponse };

const FUTURED_PROJECT_ENDPOINT = "/futured-project";

export const getFuturedProjects = async (): Promise<FuturedProjectResponse[]> => {
  const { data } = await axiosClient.get<FuturedProjectResponse[]>(
    FUTURED_PROJECT_ENDPOINT,
  );
  return data;
};

export const getFuturedProject = async (
  id: number,
): Promise<FuturedProjectResponse> => {
  const { data } = await axiosClient.get<FuturedProjectResponse>(
    `${FUTURED_PROJECT_ENDPOINT}/${id}`,
  );
  return data;
};

interface FuturedProjectCreateResult {
  status: number;
}

interface FuturedProjectUpdateResult {
  status: number;
}

interface FuturedProjectDeleteResult {
  status: number;
}

export type {
  FuturedProjectCreateResult,
  FuturedProjectUpdateResult,
  FuturedProjectDeleteResult,
};

export const createFuturedProject = async (
  payload: FuturedProjectPayload,
): Promise<FuturedProjectCreateResult> => {
  const response = await axiosClient.post(FUTURED_PROJECT_ENDPOINT, payload);
  return { status: response.status };
};

export const updateFuturedProject = async (
  id: number,
  payload: FuturedProjectPayload,
): Promise<FuturedProjectUpdateResult> => {
  const response = await axiosClient.put(
    `${FUTURED_PROJECT_ENDPOINT}/${id}`,
    payload,
  );
  return { status: response.status };
};

export const deleteFuturedProject = async (
  id: number,
): Promise<FuturedProjectDeleteResult> => {
  const response = await axiosClient.delete(`${FUTURED_PROJECT_ENDPOINT}/${id}`);
  return { status: response.status };
};
