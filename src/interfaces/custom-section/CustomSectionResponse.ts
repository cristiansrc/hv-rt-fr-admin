export interface CustomSectionResponse {
  id: number;
  title: string;
  titleEng: string;
  content: string | null;
  contentEng: string | null;
  summaryPdf: string | null;
  summaryPdfEng: string | null;
  visible: boolean;
}
