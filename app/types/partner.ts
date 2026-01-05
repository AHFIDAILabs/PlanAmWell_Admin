export type PartnerType =
  | "individual"
  | "business"
  | string; // backend-safe fallback

export interface PartnerImage {
  url?: string;        // older responses
  imageUrl?: string;  // newer uploads
}

export interface Partner {
  _id: string;

  // Core identity
  name: string;
  partnerType: PartnerType;
  isActive: boolean;

  // Contact
  email?: string;
  phone?: string;
  website?: string;
  businessAddress?: string;

  // Profile
  profession?: string;
  description?: string;
  logo?: string;

  // Media
  partnerImage?: PartnerImage;

  // Social
  socialLinks?: string[];

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}
