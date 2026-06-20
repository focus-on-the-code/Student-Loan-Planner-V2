<script lang="ts">
  import { resolve } from '$app/paths';
  import BrandLogo from '$lib/components/brand/BrandLogo.svelte';
</script>

<svelte:head>
  <title>Student Loan Repayment Plan Estimator</title>
  <meta
    name="description"
    content="A privacy-first student loan repayment plan estimator bootstrap build."
  />
</svelte:head>

<main aria-labelledby="page-title">
  <section class="glass-card hero-card">
    <div class="hero-grid">
      <div>
        <p class="eyebrow">Bootstrap verified · Static SvelteKit foundation</p>
        <h1 id="page-title">Student Loan Repayment Plan Estimator</h1>
        <p class="tagline">Estimate. Compare. Plan.</p>
        <p class="lead">
          This design-ready shell establishes the brand system, layout
          primitives, and static build foundation for the full repayment
          estimator. Your information will stay in this browser when the
          calculator is built.
        </p>
        <div class="action-row" aria-label="Primary actions">
          <a class="button-link primary" href={resolve('/methodology')}
            >Review methodology</a
          >
          <a class="button-link" href={resolve('/sources')}>View sources</a>
          <a class="button-link" href={resolve('/accessibility')}
            >Accessibility</a
          >
        </div>
      </div>
      <div class="logo-panel" aria-label="Brand preview">
        <BrandLogo variant="horizontal" />
      </div>
    </div>
    <div class="card-grid" aria-label="Bootstrap foundation highlights">
      <article class="info-card">
        <strong>Static by default</strong>
        <span
          >Prerendered SvelteKit output configured for GitHub Pages deployment.</span
        >
      </article>
      <article class="info-card">
        <strong>Private by design</strong>
        <span
          >No server, accounts, analytics, or runtime borrower-data API
          dependency.</span
        >
      </article>
      <article class="info-card">
        <strong>Ready for rules</strong>
        <span
          >Presentation shell is separated from the upcoming domain and
          calculation engine.</span
        >
      </article>
    </div>
  </section>
</main>
