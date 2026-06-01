import { axiosClient } from "./axiosClient";
import type { CustomSectionPayload } from "../interfaces/custom-section/CustomSectionPayload";
import type { CustomSectionResponse } from "../interfaces/custom-section/CustomSectionResponse";

export type { CustomSectionPayload, CustomSectionResponse };

const CUSTOM_SECTION_ENDPOINT = "/custom-section";

export const getCustomSections = async (): Promise<CustomSectionResponse[]> => {
  const { data } = await axiosClient.get<CustomSectionResponse[]>(
    CUSTOM_SECTION_ENDPOINT,
  );
  return data;
};

export const getCustomSection = async (
  id: number,
): Promise<CustomSectionResponse> => {
  const { data } = await axiosClient.get<CustomSectionResponse>(
    `${CUSTOM_SECTION_ENDPOINT}/${id}`,
  );
  return data;
};

interface CustomSectionCreateResult {
  status: number;
}

interface CustomSectionUpdateResult {
  status: number;
}

interface CustomSectionDeleteResult {
  status: number;
}

export type {
  CustomSectionCreateResult,
  CustomSectionUpdateResult,
  CustomSectionDeleteResult,
};

export const createCustomSection = async (
  payload: CustomSectionPayload,
): Promise<CustomSectionCreateResult> => {
  const response = await axiosClient.post(CUSTOM_SECTION_ENDPOINT, payload);
  return { status: response.status };
};

export const updateCustomSection = async (
  id: number,
  payload: CustomSectionPayload,
): Promise<CustomSectionUpdateResult> => {
  const response = await axiosClient.put(
    `${CUSTOM_SECTION_ENDPOINT}/${id}`,
    payload,
  );
  return { status: response.status };
};

export const deleteCustomSection = async (
  id: number,
): Promise<CustomSectionDeleteResult> => {
  const response = await axiosClient.delete(`${CUSTOM_SECTION_ENDPOINT}/${id}`);
  return { status: response.status };
};
