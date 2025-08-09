import { supabase } from '@/lib/supabaseClient';
import type { UserProfile } from '@/types/profile';

export const fetchProfileById = async (id: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch profile:', error.message);
    return null;
  }

  return data as UserProfile;
};
