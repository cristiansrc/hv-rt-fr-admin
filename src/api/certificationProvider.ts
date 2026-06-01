import { axiosClient } from "./axiosClient";
import type { CertificationPayload } from "../interfaces/certification/CertificationPayload";
import type { CertificationResponse } from "../interfaces/certification/CertificationResponse";

export type { CertificationPayload, CertificationResponse };

const CERTIFICATION_ENDPOINT = "/certification";

export const getCertifications = async (): Promise<CertificationResponse[]> => {
  const { data } = await axiosClient.get<CertificationResponse[]>(
    CERTIFICATION_ENDPOINT,
  );
  return data;
};

export const getCertification = async (
  id: number,
): Promise<CertificationResponse> => {
  const { data } = await axiosClient.get<CertificationResponse>(
    `${CERTIFICATION_ENDPOINT}/${id}`,
  );
  return data;
};

interface CertificationCreateResult {
  status: number;
}

interface CertificationUpdateResult {
  status: number;
}

interface CertificationDeleteResult {
  status: number;
}

export type {
  CertificationCreateResult,
  CertificationUpdateResult,
  CertificationDeleteResult,
};

export const createCertification = async (
  payload: CertificationPayload,
): Promise<CertificationCreateResult> => {
  const response = await axiosClient.post(CERTIFICATION_ENDPOINT, payload);
  return { status: response.status };
};

export const updateCertification = async (
  id: number,
  payload: CertificationPayload,
): Promise<CertificationUpdateResult> => {
  const response = await axiosClient.put(
    `${CERTIFICATION_ENDPOINT}/${id}`,
    payload,
  );
  return { status: response.status };
};

export const deleteCertification = async (
  id: number,
): Promise<CertificationDeleteResult> => {
  const response = await axiosClient.delete(`${CERTIFICATION_ENDPOINT}/${id}`);
  return { status: response.status };
};
