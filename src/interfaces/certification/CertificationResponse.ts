export interface CertificationResponse {
  id: number;
  name: string;
  nameEng: string;
  issuingOrganization: string;
  issuingOrganizationEng: string;
  issueDate: string;
  expirationDate: string | null;
  verificationUrl: string | null;
  credentialId: string | null;
  description: string | null;
  descriptionEng: string | null;
  summaryPdf: string | null;
  summaryPdfEng: string | null;
}
