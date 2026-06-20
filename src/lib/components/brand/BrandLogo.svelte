<script lang="ts">
  import { base } from '$app/paths';

  export let variant: 'horizontal' | 'mark' | 'monochrome' = 'horizontal';
  export let label = 'Student Loan Repayment Plan Estimator';

  const fileByVariant = {
    horizontal: 'logo-horizontal.svg',
    mark: 'logo-mark.svg',
    monochrome: 'logo-monochrome.svg'
  };
</script>

<img
  class="brand-logo {variant}"
  src="{base}/brand/{fileByVariant[variant]}"
  alt={label}
/>

<style>
  .brand-logo {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .brand-logo.horizontal {
    width: min(100%, 28rem);
  }

  .brand-logo.mark,
  .brand-logo.monochrome {
    width: 4rem;
  }
</style>
