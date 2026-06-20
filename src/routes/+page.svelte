<script lang="ts">
  import { base, resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Student Loan Repayment Plan Estimator</title>
  <meta
    name="description"
    content="A privacy-first student loan repayment plan estimator bootstrap build."
  />
</svelte:head>

<main class="shell" aria-labelledby="page-title">
  <section class="hero-card">
    <div class="brand-row">
      <img src="{base}/brand/logo-mark.svg" alt="" class="logo-mark" />
      <p class="eyebrow">Bootstrap verified</p>
    </div>
    <h1 id="page-title">Student Loan Repayment Plan Estimator</h1>
    <p class="tagline">Estimate. Compare. Plan.</p>
    <p class="lead">
      This static SvelteKit foundation is ready for the estimator
      implementation. Your information will stay in this browser when the
      calculator is built.
    </p>
    <nav aria-label="Supporting pages">
      <a href={resolve('/methodology')}>Methodology</a>
      <a href={resolve('/sources')}>Sources</a>
      <a href={resolve('/accessibility')}>Accessibility</a>
    </nav>
  </section>
</main>
