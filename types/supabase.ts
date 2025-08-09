// types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          firstname: string;
          lastname: string;
          username?: string;
          bio?: string;
          phone?: string;
          instagramUrl?: string;
          twitterUrl?: string;
          linkedinUrl?: string;
          tag?: string;
          image?: string;
          onboarded: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          firstname: string;
          lastname: string;
          username?: string;
          bio?: string;
          phone?: string;
          instagramUrl?: string;
          twitterUrl?: string;
          linkedinUrl?: string;
          tag?: string;
          image?: string;
          onboarded?: boolean;
          created_at?: string;
        };
        Update: {
          email?: string;
          firstname?: string;
          lastname?: string;
          username?: string;
          bio?: string;
          phone?: string;
          instagramUrl?: string;
          twitterUrl?: string;
          linkedinUrl?: string;
          tag?: string;
          image?: string;
          onboarded?: boolean;
          created_at?: string;
        };
      };
      // 추가 테이블 있으면 여기에 작성
    };
  };
}

