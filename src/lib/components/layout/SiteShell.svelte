<script lang="ts">
  import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
  import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
</script>

<div class="page-shell">
  <SiteHeader />
  <slot />
  <SiteFooter />
</div>
