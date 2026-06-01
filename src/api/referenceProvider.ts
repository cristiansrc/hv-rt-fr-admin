import { axiosClient } from "./axiosClient";
import type { ReferencePayload } from "../interfaces/reference/ReferencePayload";
import type { ReferenceResponse } from "../interfaces/reference/ReferenceResponse";

export type { ReferencePayload, ReferenceResponse };

const REFERENCE_ENDPOINT = "/reference";

export const getReferences = async (): Promise<ReferenceResponse[]> => {
  const { data } = await axiosClient.get<ReferenceResponse[]>(
    REFERENCE_ENDPOINT,
  );
  return data;
};

export const getReference = async (id: number): Promise<ReferenceResponse> => {
  const { data } = await axiosClient.get<ReferenceResponse>(
    `${REFERENCE_ENDPOINT}/${id}`,
  );
  return data;
};

interface ReferenceCreateResult {
  status: number;
}

interface ReferenceUpdateResult {
  status: number;
}

interface ReferenceDeleteResult {
  status: number;
}

export type {
  ReferenceCreateResult,
  ReferenceUpdateResult,
  ReferenceDeleteResult,
};

export const createReference = async (
  payload: ReferencePayload,
): Promise<ReferenceCreateResult> => {
  const response = await axiosClient.post(REFERENCE_ENDPOINT, payload);
  return { status: response.status };
};

export const updateReference = async (
  id: number,
  payload: ReferencePayload,
): Promise<ReferenceUpdateResult> => {
  const response = await axiosClient.put(
    `${REFERENCE_ENDPOINT}/${id}`,
    payload,
  );
  return { status: response.status };
};

export const deleteReference = async (
  id: number,
): Promise<ReferenceDeleteResult> => {
  const response = await axiosClient.delete(`${REFERENCE_ENDPOINT}/${id}`);
  return { status: response.status };
};
