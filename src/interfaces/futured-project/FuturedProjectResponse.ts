import type { ExperienceResponse } from "../experience/ExperienceResponse";
import type { ImageResponse } from "../image/ImageResponse";

export interface FuturedProjectResponse {
  id: number;
  name: string;
  nameEng: string;
  descriptionShort: string;
  description: string;
  descriptionShortEng: string;
  descriptionEng: string;
  experience: ExperienceResponse;
  imageListUrl: ImageResponse | null;
  imageUrl: ImageResponse | null;
}
