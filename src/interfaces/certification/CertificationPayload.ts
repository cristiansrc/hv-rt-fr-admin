export interface CertificationPayload {
  name: string;
  nameEng: string;
  issuingOrganization: string;
  issuingOrganizationEng: string;
  issueDate: string;
  expirationDate?: string;
  verificationUrl?: string;
  credentialId?: string;
  description?: string;
  descriptionEng?: string;
  summaryPdf?: string;
  summaryPdfEng?: string;
}
