<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head
  ><title>Accessibility | Student Loan Repayment Plan Estimator</title
  ></svelte:head
>

<main class="shell" aria-labelledby="page-title">
  <section class="hero-card">
    <p class="eyebrow">Accessibility</p>
    <h1 id="page-title">Accessibility statement</h1>
    <p class="lead">
      Accessibility support, interaction details, and known limitations will be
      documented here.
    </p>
    <nav aria-label="Primary"><a href={resolve('/')}>Back to estimator</a></nav>
  </section>
</main>
