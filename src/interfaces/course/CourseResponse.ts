export interface CourseResponse {
  id: number;
  name: string;
  nameEng: string;
  institution: string;
  institutionEng: string;
  completionDate: string;
  description: string | null;
  descriptionEng: string | null;
  summaryPdf: string | null;
  summaryPdfEng: string | null;
  certificateUrl: string | null;
}
