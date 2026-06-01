export interface ReferenceResponse {
  id: number;
  fullName: string;
  position: string;
  company: string | null;
  companyEng: string | null;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  relationshipEng: string | null;
}
