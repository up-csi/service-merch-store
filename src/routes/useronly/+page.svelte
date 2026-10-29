<script lang="ts">
  import { refreshAll } from '$app/navigation';

  let { data } = $props();
  let { supabase } = $derived(data);

  async function logout() {

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }
    refreshAll();

  }
</script>

<div>Hello! If you can see me, then ur logged in</div>

<button onclick={logout}>
  Log Out
</button>