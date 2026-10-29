<script lang="ts">
  let { data } = $props();
  let { supabase } = $derived(data);

</script>

<div>Hello! If you can see me, then ur logged in</div>
<div>You're on the useronly child page!</div>