export interface CoursePayload {
  name: string;
  nameEng: string;
  institution: string;
  institutionEng: string;
  completionDate?: string;
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
  certificateUrl?: string;
}
