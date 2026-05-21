export interface Certificate {
  _id: string;
  sequenceId: number;
  ref_no: string;
  full_name: string;
  date_of_birth?: string;
  passport_no?: string;
  nid_card_no?: string;
  father_name?: string;
  mother_name?: string;
  village?: string;
  post_office?: string;
  upazila?: string;
  district?: string;
  skill_title?: string;
  experience_years?: number;
  issue_date?: string;
  start_date?: string;
  end_date?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateInput {
  full_name: string;
  date_of_birth?: string;
  passport_no?: string;
  nid_card_no?: string;
  father_name?: string;
  mother_name?: string;
  village?: string;
  post_office?: string;
  upazila?: string;
  district?: string;
  skill_title?: string;
  experience_years?: number;
  issue_date?: string;
  start_date?: string;
  end_date?: string;
  status: "draft" | "published";
}

export interface UpdateCertificateInput extends Partial<CreateCertificateInput> {}

export interface User {
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  email: string | null;
  password: string | null;
  isAuthenticated: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CertificatesResponse {
  success: boolean;
  data: Certificate[];
  total?: number;
}

export interface CertificateResponse {
  success: boolean;
  data: Certificate;
}

export interface HeroBanner {
  id: string;
  url: string;
  publicId: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  publicId: string;
  updatedAt?: string;
}
