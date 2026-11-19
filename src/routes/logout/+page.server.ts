import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw redirect(303, '/login');
  }
  return;

};

export const actions: Actions = {
    google_logout: async ({ locals : { supabase } }) => {
        const { error } = await supabase.auth.signOut();
        if (error) {
        console.error('Error signing out:', error.message);
            return;
        }
        console.error('Logout Successful');
        
        redirect(303, '/login');
}
};
