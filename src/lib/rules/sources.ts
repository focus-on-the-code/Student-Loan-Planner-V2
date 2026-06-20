import { sourceId } from '$lib/domain/types';
import type { SourceRecord } from '$lib/rules/types';

export const SOURCE_RETRIEVED_ON = '2026-06-20';

export const SOURCE_IDS = {
  riseFinalRule: sourceId('federal-register-rise-final-rule-2026-05-01'),
  fsaBigUpdates: sourceId('fsa-one-big-beautiful-bill-updates'),
  ecfrDirectLoans: sourceId('ecfr-34-cfr-part-685-direct-loans'),
  ecfrFfel: sourceId('ecfr-34-cfr-part-682-ffel'),
  ecfrPerkins: sourceId('ecfr-34-cfr-part-674-perkins'),
  icrAnnualUpdate2026: sourceId('federal-register-icr-formula-2026'),
  fsaPslf: sourceId('fsa-public-service-loan-forgiveness'),
  hhsPovertyGuidelines: sourceId('hhs-aspe-2026-poverty-guidelines'),
  irsCanceledDebt: sourceId('irs-topic-431-canceled-debt'),
  taxpayerAdvocateForgivenessTaxes: sourceId(
    'tas-student-loan-forgiveness-taxes-2026'
  ),
  svelteKitAdapterStatic: sourceId('sveltekit-adapter-static-docs'),
  svelteKitProjectStructure: sourceId(
    'sveltekit-project-structure-page-options'
  ),
  githubPagesActions: sourceId('github-pages-custom-actions-docs'),
  wcag22: sourceId('w3c-wcag-22')
} as const;

export const sourceRecords: readonly SourceRecord[] = [
  {
    id: SOURCE_IDS.riseFinalRule,
    title:
      'Reimagining and Improving Student Education—Federal Student Loan Program Final Regulations',
    publisher: 'U.S. Department of Education / Federal Register',
    url: 'https://www.federalregister.gov/documents/2026/05/01/2026-08556/reimagining-and-improving-student-education-federal-student-loan-program-final-regulations',
    retrievedOn: SOURCE_RETRIEVED_ON,
    publishedOn: '2026-05-01',
    effectiveFrom: '2026-07-01',
    sourceType: 'federal-register',
    notes: 'Primary source for the July 1, 2026 repayment-rule baseline.'
  },
  {
    id: SOURCE_IDS.fsaBigUpdates,
    title: 'One Big Beautiful Bill Act Updates',
    publisher: 'Federal Student Aid',
    url: 'https://studentaid.gov/announcements-events/big-updates/',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'agency-guidance',
    notes:
      'Agency-facing operational update page for borrower-facing transition guidance.'
  },
  {
    id: SOURCE_IDS.ecfrDirectLoans,
    title: '34 CFR Part 685 — William D. Ford Federal Direct Loan Program',
    publisher: 'Electronic Code of Federal Regulations',
    url: 'https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-685',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'regulation',
    notes:
      'Current eCFR Direct Loan repayment provisions; automated access may require eCFR API fallback.'
  },
  {
    id: SOURCE_IDS.ecfrFfel,
    title: '34 CFR Part 682 — Federal Family Education Loan Program',
    publisher: 'Electronic Code of Federal Regulations',
    url: 'https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-682',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'regulation',
    notes:
      'Current eCFR FFEL repayment provisions; automated access may require eCFR API fallback.'
  },
  {
    id: SOURCE_IDS.ecfrPerkins,
    title: '34 CFR Part 674 — Federal Perkins Loan Program',
    publisher: 'Electronic Code of Federal Regulations',
    url: 'https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-674',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'regulation',
    notes: 'Current eCFR Perkins repayment provisions.'
  },
  {
    id: SOURCE_IDS.icrAnnualUpdate2026,
    title:
      'Annual Updates to the Income Contingent Repayment (ICR) Plan Formula for 2026',
    publisher: 'U.S. Department of Education / Federal Register',
    url: 'https://www.federalregister.gov/documents/2026/06/09/2026-11540/annual-updates-to-the-income-contingent-repayment-icr-plan-formula-for-2026-william-d-ford-federal',
    retrievedOn: SOURCE_RETRIEVED_ON,
    publishedOn: '2026-06-09',
    sourceType: 'federal-register',
    notes: 'Annual ICR formula update source for 2026 factors.'
  },
  {
    id: SOURCE_IDS.fsaPslf,
    title: 'Public Service Loan Forgiveness',
    publisher: 'Federal Student Aid',
    url: 'https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'agency-guidance',
    notes: 'Borrower-facing PSLF guidance and payment-count resources.'
  },
  {
    id: SOURCE_IDS.hhsPovertyGuidelines,
    title: '2026 Poverty Guidelines',
    publisher:
      'HHS Office of the Assistant Secretary for Planning and Evaluation',
    url: 'https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines',
    retrievedOn: SOURCE_RETRIEVED_ON,
    publishedOn: '2026',
    sourceType: 'annual-data',
    notes:
      'Annual poverty-guideline source used by income-driven repayment formulas.'
  },
  {
    id: SOURCE_IDS.irsCanceledDebt,
    title: 'Topic No. 431, Canceled Debt—Is It Taxable or Not?',
    publisher: 'Internal Revenue Service',
    url: 'https://www.irs.gov/taxtopics/tc431',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'agency-guidance',
    notes: 'General IRS guidance for canceled-debt tax treatment.'
  },
  {
    id: SOURCE_IDS.taxpayerAdvocateForgivenessTaxes,
    title: 'What to Know about Student Loan Forgiveness and Your Taxes',
    publisher: 'Taxpayer Advocate Service',
    url: 'https://www.taxpayeradvocate.irs.gov/news/tax-tips/what-to-know-about-student-loan-forgiveness-and-your-taxes/2026/03/',
    retrievedOn: SOURCE_RETRIEVED_ON,
    publishedOn: '2026-03-23',
    sourceType: 'agency-guidance',
    notes:
      'Taxpayer Advocate summary of student-loan forgiveness tax considerations.'
  },
  {
    id: SOURCE_IDS.svelteKitAdapterStatic,
    title: 'Static site generation / adapter-static',
    publisher: 'SvelteKit documentation',
    url: 'https://svelte.dev/docs/kit/adapter-static',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'technical-doc',
    notes: 'Technical source for static site generation behavior.'
  },
  {
    id: SOURCE_IDS.svelteKitProjectStructure,
    title: 'Project structure and page options',
    publisher: 'SvelteKit documentation',
    url: 'https://svelte.dev/docs/kit/project-structure',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'technical-doc',
    notes: 'Technical source for SvelteKit route and page-option conventions.'
  },
  {
    id: SOURCE_IDS.githubPagesActions,
    title: 'GitHub Pages custom workflows and publishing source',
    publisher: 'GitHub Docs',
    url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages',
    retrievedOn: SOURCE_RETRIEVED_ON,
    sourceType: 'technical-doc',
    notes:
      'Technical source for GitHub Pages deployment workflow configuration.'
  },
  {
    id: SOURCE_IDS.wcag22,
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    publisher: 'World Wide Web Consortium',
    url: 'https://www.w3.org/TR/WCAG22/',
    retrievedOn: SOURCE_RETRIEVED_ON,
    publishedOn: '2023-10-05',
    sourceType: 'technical-doc',
    notes: 'Accessibility target reference for WCAG 2.2 Level AA.'
  }
] as const;

export const sourceRecordsById = new Map(
  sourceRecords.map((record) => [record.id, record])
);
