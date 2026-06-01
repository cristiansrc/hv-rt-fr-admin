import { axiosClient } from "./axiosClient";
import type { CoursePayload } from "../interfaces/course/CoursePayload";
import type { CourseResponse } from "../interfaces/course/CourseResponse";

export type { CoursePayload, CourseResponse };

const COURSE_ENDPOINT = "/course";

export const getCourses = async (): Promise<CourseResponse[]> => {
  const { data } = await axiosClient.get<CourseResponse[]>(COURSE_ENDPOINT);
  return data;
};

export const getCourse = async (id: number): Promise<CourseResponse> => {
  const { data } = await axiosClient.get<CourseResponse>(
    `${COURSE_ENDPOINT}/${id}`,
  );
  return data;
};

interface CourseCreateResult {
  status: number;
}

interface CourseUpdateResult {
  status: number;
}

interface CourseDeleteResult {
  status: number;
}

export type { CourseCreateResult, CourseUpdateResult, CourseDeleteResult };

export const createCourse = async (
  payload: CoursePayload,
): Promise<CourseCreateResult> => {
  const response = await axiosClient.post(COURSE_ENDPOINT, payload);
  return { status: response.status };
};

export const updateCourse = async (
  id: number,
  payload: CoursePayload,
): Promise<CourseUpdateResult> => {
  const response = await axiosClient.put(`${COURSE_ENDPOINT}/${id}`, payload);
  return { status: response.status };
};

export const deleteCourse = async (
  id: number,
): Promise<CourseDeleteResult> => {
  const response = await axiosClient.delete(`${COURSE_ENDPOINT}/${id}`);
  return { status: response.status };
};
