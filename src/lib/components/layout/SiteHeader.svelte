<script lang="ts">
  import { resolve } from '$app/paths';
  import BrandLogo from '$lib/components/brand/BrandLogo.svelte';
</script>

<header class="site-header">
  <a
    class="brand-link"
    href={resolve('/')}
    aria-label="Student Loan Repayment Plan Estimator home"
  >
    <BrandLogo variant="mark" label="" />
    <span>Student Loan Repayment Plan Estimator</span>
  </a>
  <nav class="site-nav" aria-label="Main navigation">
    <a href={resolve('/methodology')}>Methodology</a>
    <a href={resolve('/sources')}>Sources</a>
    <a href={resolve('/accessibility')}>Accessibility</a>
  </nav>
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
    padding: var(--space-3) var(--space-4);
    border: 1px solid rgba(255, 255, 255, 0.76);
    border-radius: var(--radius-lg);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: var(--shadow-soft);
    backdrop-filter: blur(14px);
  }

  .brand-link,
  .site-nav {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .brand-link {
    color: var(--color-ink);
    font-weight: 900;
    text-decoration: none;
  }

  .brand-link :global(.brand-logo.mark) {
    width: 2.75rem;
  }

  .site-nav {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .site-nav a {
    padding: 0.55rem 0.8rem;
    border-radius: var(--radius-pill);
    color: var(--color-ink-soft);
    font-size: 0.93rem;
    font-weight: 800;
    text-decoration: none;
  }

  .site-nav a:hover {
    background: rgba(255, 255, 255, 0.82);
    color: var(--color-ink);
  }

  @media (max-width: 720px) {
    .site-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .site-nav {
      justify-content: flex-start;
    }
  }
</style>
