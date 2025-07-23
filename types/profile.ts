export type Tag = {
  label: string;
  variant: 'viola' | 'ar' | 'artist';
};

export interface UserProfile {
  id: string; // uuid
  firstname: string;
  lastname: string;
  username?: string;
  bio?: string;
  phone?: string;
  email?: string;
  tags?: Tag[];
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  image?: string;
  created_at?: string; // Supabase 
  updated_at?: string; // if u are going to use
}