// types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          image_url: string;
          instagram: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          image_url: string;
          instagram: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          image_url?: string;
          instagram?: string;
        };
      };
      // Add more if i needed
    };
  };
}
