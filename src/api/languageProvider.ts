import { axiosClient } from "./axiosClient";
import type { LanguagePayload } from "../interfaces/language/LanguagePayload";
import type { LanguageResponse } from "../interfaces/language/LanguageResponse";

export type { LanguagePayload, LanguageResponse };

const LANGUAGE_ENDPOINT = "/language";

export const getLanguages = async (): Promise<LanguageResponse[]> => {
  const { data } = await axiosClient.get<LanguageResponse[]>(LANGUAGE_ENDPOINT);
  return data;
};

export const getLanguage = async (id: number): Promise<LanguageResponse> => {
  const { data } = await axiosClient.get<LanguageResponse>(
    `${LANGUAGE_ENDPOINT}/${id}`,
  );
  return data;
};

interface LanguageCreateResult {
  status: number;
}

interface LanguageUpdateResult {
  status: number;
}

interface LanguageDeleteResult {
  status: number;
}

export type {
  LanguageCreateResult,
  LanguageUpdateResult,
  LanguageDeleteResult,
};

export const createLanguage = async (
  payload: LanguagePayload,
): Promise<LanguageCreateResult> => {
  const response = await axiosClient.post(LANGUAGE_ENDPOINT, payload);
  return { status: response.status };
};

export const updateLanguage = async (
  id: number,
  payload: LanguagePayload,
): Promise<LanguageUpdateResult> => {
  const response = await axiosClient.put(`${LANGUAGE_ENDPOINT}/${id}`, payload);
  return { status: response.status };
};

export const deleteLanguage = async (
  id: number,
): Promise<LanguageDeleteResult> => {
  const response = await axiosClient.delete(`${LANGUAGE_ENDPOINT}/${id}`);
  return { status: response.status };
};
