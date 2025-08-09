export type Tag = {
  label: string;
  variant: 'viola' | 'ar' | 'artist';
};

export interface UserProfile {
  id: string;
  image?: string;
  firstname: string;
  lastname: string;
  username: string;
  bio?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  tag?: string;
  created_at?: string;
  onboarded?: boolean;
}
