---
title: "Student Loan Repayment Plan Estimator V2"
subtitle: "Product Requirements Document, Software Architecture, and Agentic Build Plan"
author: "Neon Dreams Engineering Division"
date: "June 2026"
version: "2.0 - Two-Stage Codex Build Handoff"
---

# Document status

| Field | Value |
|---|---|
| Product | Student Loan Repayment Plan Estimator V2 |
| Tagline | Estimate. Compare. Plan. |
| Product owner | Neon Dreams Engineering Division |
| Repository | `focus-on-the-code/student-loan-planner` |
| Planned public URL | `https://focus-on-the-code.github.io/student-loan-planner/` |
| Release target | Public beta |
| Architecture | Static SvelteKit application with TypeScript |
| Backend | None |
| Hosting | GitHub Pages |
| Deployment | Automated GitHub Actions deployment on changes to `main` |
| Rules review baseline | June 18, 2026 |
| Privacy model | All borrower data remains in the browser; no analytics or tracking |
| Accessibility target | WCAG 2.2 Level AA |
| Copyright | © June 2026 Neon Dreams Engineering Division |

# 1. Executive summary

The Student Loan Repayment Plan Estimator is a privacy-first, browser-based public-beta tool that helps current and prospective federal student loan borrowers estimate and compare repayment options. It is an estimator, not an official eligibility determination, loan-servicing tool, tax calculator, or source of financial or legal advice.

The application will guide a borrower through either a quick estimate or a more detailed estimate, calculate available or potentially available federal repayment plans, and show a clear comparison of projected monthly payments, annual payments, total borrower payments, repayment timelines, remaining balances, possible forgiveness, estimated forgiveness taxes, and plan-specific benefits and tradeoffs.

The primary experience is a one-page estimator. After onboarding, the borrower can edit inputs directly beside the results and see the estimates update live. The default comparison shows the three clearly eligible plans with the lowest current monthly payments, using projected total borrower payments as the tie-breaker. A control expands the results to show all remaining plans, including potentially eligible, transitional, unavailable, and ineligible plans with concise explanations.

The production implementation will use SvelteKit, Svelte, TypeScript, and `@sveltejs/adapter-static`. It will be fully prerendered and deployed to GitHub Pages. A GitHub Actions workflow will test, build, package, and deploy the site automatically after changes reach the `main` branch. There will be no application server, database, user account system, analytics, advertising, tracking, or runtime API dependency.

The existing single-file HTML prototype is a visual and interaction reference only. Its simplified calculation logic must not be treated as production rules. The user-facing “Design tone / Light vaporwave” description card must be removed. The visual influence remains an internal design direction, not product copy.

**V2 build-strategy change:** Codex must not create and validate the entire framework, dependency graph, browser test stack, application, and deployment pipeline in one task from an empty repository. The implementation is explicitly divided into two Codex tasks. Task 1 creates and proves a minimal, reproducible SvelteKit repository with a genuine lockfile and one green static build. After the repository is committed and the Codex Cloud environment is configured and cache-reset against that real project, Task 2 implements the full estimator. This sequencing is a release requirement, not a suggestion.

No pull request may be merged merely because files were generated or a deployment workflow happened to publish. The merge gate is evidence-based: dependency installation, checks, unit tests, production build, browser smoke test, GitHub CI, and deployed-site verification must all be green for the relevant stage.

# 2. Product identity

## 2.1 Name and tagline

**Product name:** Student Loan Repayment Plan Estimator  
**Tagline:** Estimate. Compare. Plan.

## 2.2 Attribution

The product remains brand-neutral and must not imply affiliation with the U.S. Department of Education, Federal Student Aid, a loan servicer, a law firm, a tax professional, or a financial advisory firm.

The footer must include:

> © June 2026 Neon Dreams Engineering Division

No contact email is required.

## 2.3 Logo requirements

Codex must create original, local SVG logo assets. The logo must be an abstract, brand-neutral mark combining:

- three ascending or diverging repayment-path lines;
- a small horizon, arc, or sun form;
- pastel blue, pink, yellow, and orange accents;
- a dark navy or near-black wordmark;
- simple geometry that remains legible at favicon size.

The logo must not use:

- a U.S. government seal or government-like insignia;
- a graduation cap;
- a dollar sign;
- a bank building;
- a shield that implies official certification;
- third-party trademarks.

Required deliverables:

- `/static/brand/logo-horizontal.svg`
- `/static/brand/logo-mark.svg`
- `/static/brand/logo-monochrome.svg`
- `/static/favicon.svg`
- `/static/favicon-32.png`
- `/static/apple-touch-icon.png`

All raster derivatives must be generated from the original SVG assets and committed to the repository. The SVGs must include accessible `<title>` elements where rendered as meaningful images. Decorative instances must use empty alternative text or `aria-hidden="true"`.

# 3. Product vision, goals, and non-goals

## 3.1 Vision

Make federal student loan repayment choices easier to understand by translating complex plan rules into transparent estimates, plain-language comparisons, and editable scenarios without collecting or transmitting borrower data.

## 3.2 Product goals

1. Let a borrower obtain a useful estimate with only a small set of inputs.
2. Let a borrower add details when known without blocking progress when information is unknown.
3. Distinguish clearly eligible, potentially eligible, unavailable, transitional, and ineligible plans.
4. Explain why a plan is or is not shown.
5. Estimate monthly, annual, and lifetime borrower costs under each modeled plan.
6. Show how payments and balances may change over time.
7. Explain plan-specific benefits and tradeoffs, including RAP interest protection and principal support.
8. Model PSLF at an estimator level when the borrower supplies public-service assumptions.
9. Provide an estimate-quality indicator based on the completeness of the borrower’s inputs.
10. Keep all financial and household information inside the browser.
11. Meet WCAG 2.2 Level AA and work well on current mobile and desktop browsers.
12. Make legal and annual rule changes maintainable through versioned, source-backed data and code.
13. Deploy automatically to GitHub Pages when the repository’s `main` branch changes.
14. Use a reproducible two-stage Codex process so dependency installation and validation occur against files that exist before the implementation task starts.
15. Prevent deployment when required CI checks fail.

## 3.3 Non-goals

Version 1 must not:

- provide an official repayment-plan eligibility determination;
- apply for, enroll in, or switch a borrower’s repayment plan;
- connect to StudentAid.gov or a loan servicer;
- import NSLDS or credit-report data;
- store user accounts or cloud scenarios;
- calculate a full federal or state tax return;
- recommend a tax filing status as tax advice;
- model private student loans as repayment-plan options;
- provide legal, tax, investment, or financial advice;
- scrape federal websites automatically;
- use runtime network requests to obtain rules or borrower information;
- include advertising, analytics, tracking pixels, session replay, or behavior profiling;
- provide a native PDF generator in version 1;
- provide side-by-side saved-scenario comparison;
- provide a custom domain.

# 4. Intended users

## 4.1 Primary audience

The estimator is intended for:

- current federal student loan borrowers;
- new borrowers planning repayment;
- Parent PLUS borrowers;
- graduate and professional borrowers;
- public-service employees exploring PSLF;
- borrowers with FFEL or Perkins loans;
- financial-aid counselors and nonprofit educators using the estimator as an explanatory aid.

The interface must assume beginner-level financial literacy by default. Technical details must remain available through expandable explanations, methodology content, source links, and calculation disclosures.

## 4.2 Representative user needs

### Borrower seeking the lowest current payment

“I need to know which eligible plan has the lowest payment now and what I may give up in exchange.”

### Borrower minimizing lifetime cost

“I can afford more now, but I want to know which plan is expected to cost the least overall.”

### Public-service borrower

“I need to understand which eligible plans support PSLF and how my existing qualifying months change the projection.”

### Parent PLUS borrower

“I need the tool to identify that my options differ from ordinary Direct Loan borrowers and tell me which details are missing.”

### Borrower with incomplete records

“I do not know every disbursement date or prior repayment-plan detail, but I still want a useful estimate and a list of facts I need to confirm.”

### Counselor

“I need a transparent estimate that explains its assumptions and can be printed for discussion.”

# 5. Release scope

## 5.1 Loan-program scope

Version 1 supports federal loans only:

- Direct Subsidized Loans;
- Direct Unsubsidized Loans;
- Direct PLUS Loans made to graduate or professional students;
- Direct Parent PLUS Loans;
- Direct Consolidation Loans;
- FFEL Subsidized and Unsubsidized Loans;
- FFEL PLUS and Consolidation Loans;
- Federal Perkins Loans.

Private loans are out of scope. The UI may display a short informational message explaining that private-loan repayment is determined by the private lender and is not modeled.

## 5.2 Repayment-plan scope

The rules engine must model or describe the following:

| Plan or path | Version 1 treatment |
|---|---|
| Repayment Assistance Plan (RAP) | Full estimator model |
| Tiered Standard | Full estimator model |
| Standard Repayment | Full estimator model |
| Graduated Repayment | Full estimator model |
| Extended Repayment | Full estimator model |
| Income-Based Repayment, 10% variant | Full estimator model |
| Income-Based Repayment, 15% variant | Full estimator model |
| Pay As You Earn (PAYE) | Full formula model with strict grandfathering/uncertainty handling |
| Income-Contingent Repayment (ICR) | Full estimator model, including annual factor tables |
| FFEL Income-Sensitive Repayment | Estimator model with documented lender-formula limitation |
| Perkins repayment | Estimator and informational model |
| Parent PLUS transition routes | Eligibility and scenario modeling to estimator-level fidelity |
| PSLF | Projection layer over qualifying repayment plans |
| Alternative Repayment Plan | Informational only; no invented custom payment formula |
| SAVE/REPAYE | Historical/unavailable status only unless future official rules restore availability |

The application must be rules-version aware and must not present every plan as universally available.

# 6. Legal, tax, and estimation posture

## 6.1 Required disclaimer

The main estimator and print report must display a concise version of the following. The methodology page must display the full version.

> This tool provides estimates for educational and planning purposes only. It is not financial, tax, or legal advice and does not determine official eligibility, payment amounts, qualifying payment counts, or forgiveness. Federal student loan rules can change, and individual results depend on loan records and circumstances that may not be fully represented here. Before making a final decision, confirm current rules and account information with Federal Student Aid and your loan servicer, and consider advice from qualified financial, tax, or legal professionals who represent your interests.

## 6.2 Tax disclaimer

Whenever forgiveness tax is shown, display:

> This is a simplified estimate, not a tax calculation. The estimator does not determine whether a discharge is taxable or calculate your full federal or state tax liability.

## 6.3 Filing-status disclaimer

When comparing married filing jointly and married filing separately, display:

> This comparison shows estimated student-loan effects only. It does not calculate the broader tax costs, credits, deductions, or filing consequences of either status.

## 6.4 Terminology

Use “estimate,” “projected,” and “potential” consistently. Avoid “guaranteed,” “you qualify,” and “best plan” without qualification. Prefer:

- “Appears eligible based on your entries”;
- “Potentially eligible—more information is needed”;
- “Lowest estimated payment now”;
- “Lowest projected borrower payments under these assumptions.”

# 7. Information architecture and routes

The estimator is primarily a one-page application with three supporting static routes.

| Route | Purpose |
|---|---|
| `/` | Landing, guided input, live scenario editor, results, charts, plan details, print control |
| `/methodology` | Calculation approach, assumptions, limitations, rounding, estimate-quality logic |
| `/sources` | Current official source registry, rules version, review date, and change log summary |
| `/accessibility` | Accessibility statement, supported interactions, known limitations, feedback guidance without contact email |

All routes must be fully prerendered and compatible with the GitHub Pages base path `/student-loan-planner`.

No sensitive input may be encoded in route parameters, hashes, or query strings.

# 8. Core user experience

## 8.1 Landing state

The landing state must include:

- product logo, name, and tagline;
- a one-sentence explanation;
- a clear “Start estimate” button;
- brief privacy statement: “Your information stays in this browser.”;
- short disclaimer;
- links to Methodology, Sources, and Accessibility.

Do not show a card explaining the design aesthetic. The words “vaporwave,” “80s,” and “design tone” must not appear in the production user interface.

## 8.2 Input-mode choice

At the start, users can choose:

- **Quick estimate:** aggregated balance and a small number of household assumptions;
- **Detailed estimate:** loan-level entries and expanded repayment history.

The recommended default is Quick estimate. The detailed mode must be available before and after results.

## 8.3 Guided onboarding

Onboarding uses short, progressive steps. The exact step count may adapt, but the recommended structure is:

1. Loan overview
2. Loan types and dates
3. Income and household
4. Forgiveness and repayment history
5. Assumptions review

Nonessential questions must include “I don’t know” or “Skip for now.” Skipping must not block progress.

Each question that affects eligibility must include a short “Why we ask” explanation.

## 8.4 Results workspace

After initial calculation, the page becomes a live scenario workspace:

- Results remain visible.
- A persistent editable input panel appears on desktop.
- A sticky “Adjust estimate” button opens a bottom sheet or full-screen drawer on mobile.
- Changes recalculate after a 300–500 ms debounce.
- Existing results remain visible while updating.
- Use a small, nonblocking “Updating estimate…” status.
- Announce significant result changes through an `aria-live="polite"` region.

The user must never be forced back through the original wizard to change an input.

## 8.5 Undo, reset, and delete behavior

### Undo

- Maintain a session-only undo history of up to 20 meaningful state snapshots.
- Group rapid typing into one history entry after the input debounce.
- Do not add calculation output changes to undo history; only user-input state.
- Disable Undo when no prior state exists.

### Reset estimate

- Ask for confirmation.
- Return fields to recommended defaults and clear calculated results.
- Preserve the current browser session only after confirmation.

### Delete all entered data

Button label:

> Delete all entered data

Confirmation copy:

> This clears the information currently entered in this browser session. It does not delete reports you previously printed or saved.

Behavior:

- clear in-memory state;
- clear session recovery data;
- clear undo history;
- clear application UI preferences stored in session storage;
- return to the landing state;
- do not claim to delete browser downloads or arbitrary files.

# 9. Input requirements

## 9.1 Quick-estimate inputs

### Essential inputs

- total federal student loan balance;
- average interest rate;
- current or expected adjusted gross income;
- family size;
- broad loan program/type selection;
- whether the borrower expects public-service employment.

### Optional quick inputs

- current repayment plan;
- whether any Direct Loan was first disbursed on or after July 1, 2026;
- Parent PLUS involvement;
- tax filing status;
- spouse AGI;
- spouse eligible federal student loan debt;
- RAP dependents;
- existing IDR count;
- existing PSLF count;
- federal forgiveness tax rate;
- state forgiveness tax rate.

## 9.2 Detailed-estimate inputs

The detailed mode must support multiple loans with these fields:

- stable local loan ID;
- program: Direct, FFEL, or Perkins;
- subtype;
- current principal;
- accrued interest, optional;
- interest rate;
- first disbursement date, optional;
- repayment-entry date, optional;
- consolidation date, optional;
- whether the consolidation includes Parent PLUS debt;
- current plan, optional;
- current status: repayment, grace, deferment, forbearance, default, unknown;
- official IDR qualifying count, optional;
- official PSLF qualifying count, optional.

Repayment-history inputs are manual and optional:

- months under prior plans;
- consolidation events;
- SAVE/REPAYE history;
- administrative forbearance periods;
- deferment periods;
- default periods;
- dates where known.

Unknown history must reduce certainty and must not silently be interpreted as zero.

## 9.3 Household and tax inputs

- current AGI;
- spouse AGI;
- tax filing status: single, head of household, married filing jointly, married filing separately, unknown;
- family size;
- RAP tax dependents;
- spouse eligible federal debt;
- poverty-guideline region: contiguous states/DC, Alaska, Hawaii;
- optional federal forgiveness tax rate;
- optional state forgiveness tax rate.

State tax handling is an estimate only. The application must not maintain a state-by-state tax-law database.

## 9.4 Projection assumptions

Default assumptions:

| Assumption | Default | Editable |
|---|---:|---|
| Annual income growth | 3.0% | Yes |
| General inflation | 2.5% | Yes |
| Future poverty-guideline growth | 2.5% | Yes |
| Family size | Constant | Yes, detailed schedule optional |
| Federal forgiveness tax rate | 25% | Yes |
| State forgiveness tax rate | 0% | Yes |
| Interest rate | Fixed per loan | No future rate change unless source loan is variable |
| Retirement or income decline | None | Optional detailed event |

The app must show all defaults in the assumptions summary.

# 10. Unknown, skipped, and assumed information

Unknown is a first-class value. It must never be automatically converted to “No,” zero, or false when the distinction affects eligibility.

## 10.1 Eligibility behavior

Plans must use one of four user-facing statuses:

1. **Appears eligible**
2. **Potentially eligible**
3. **Not eligible based on entries**
4. **Unavailable or informational**

A potentially eligible plan must not occupy a default top-three eligible position.

For every potentially eligible or ineligible plan, provide:

- a one-sentence reason;
- a short list of missing or disqualifying facts;
- a direct control to edit the relevant inputs.

## 10.2 Mathematical defaults

When a calculation can proceed using a reasonable default, the engine may calculate an estimate, but it must attach an assumption record containing:

- field name;
- assumed value;
- reason;
- effect category: payment, eligibility, timeline, tax, or confidence;
- user-facing explanation.

## 10.3 Estimate-quality indicator

The results must display one of three levels:

### Basic estimate

Only essential or aggregated inputs are available. Some plan eligibility is uncertain.

### Improved estimate

Loan program, loan type, rate, key cohort dates, and major household fields are supplied.

### Detailed estimate

Most loan-level, consolidation, household, and repayment-history fields are supplied.

The quality label is not an accuracy guarantee. It represents input completeness. Display the missing information that would most improve the estimate.

# 11. Eligibility and plan-display rules

## 11.1 Eligibility engine output

Eligibility must be computed separately from payment simulation. Each plan returns:

```ts
export type EligibilityStatus =
  | 'eligible'
  | 'potentially_eligible'
  | 'ineligible'
  | 'unavailable';

export interface EligibilityResult {
  planId: PlanId;
  status: EligibilityStatus;
  reasonCodes: EligibilityReasonCode[];
  userMessage: string;
  missingFields: ScenarioFieldPath[];
  effectiveRuleVersion: string;
  sourceIds: SourceId[];
}
```

The calculation engine must not infer eligibility from payment affordability.

## 11.2 Default top-three comparison

The comparison card must initially show no more than three plans meeting all of these conditions:

- `eligibility.status === 'eligible'`;
- simulation completes without a blocking error;
- plan is not informational-only or unavailable.

Sort order:

1. `monthlyPaymentNow` ascending;
2. `totalBorrowerPayments` ascending;
3. stable plan display order as the final deterministic tie-breaker.

This sorting must rerun after every input change.

If fewer than three plans are clearly eligible, show only the available eligible plans and a message explaining that additional plans may require more information.

## 11.3 Expanded comparison

The comparison card must include a button:

- collapsed: **Show all plans**;
- expanded: **Show top 3**.

The expanded state groups plans in this order:

1. other eligible plans;
2. potentially eligible plans;
3. unavailable or informational plans;
4. ineligible plans.

The detailed plan-card section must use the same ordering logic to avoid contradictory presentation.

## 11.4 Column help

Every comparison-table header must include an accessible information control that works with hover, focus, click, and touch.

Required short descriptions:

| Column | Help text |
|---|---|
| Plan | The federal repayment option being estimated. |
| Eligibility | Whether the plan appears available based on the information entered. |
| Monthly now | Your estimated required payment each month using today’s inputs. |
| Annual now | Your estimated required payments during the first 12 months. |
| Year 5 monthly | Your projected monthly payment in the fifth year under the assumptions entered. |
| Total paid | All projected borrower payments through payoff or forgiveness, excluding estimated forgiveness tax unless stated. |
| Forgiven | The projected balance that may remain when forgiveness occurs. |
| Forgiveness tax | A simplified estimate of federal and optional state tax associated with projected forgiveness. |
| Timeline | The projected time until payoff or forgiveness. |
| Key notes | Important plan benefits, limitations, or assumptions. |

Tooltips must use semantic popover behavior or an accessible custom tooltip pattern. Do not rely only on the HTML `title` attribute.

# 12. Calculation-engine requirements

## 12.1 General approach

The production engine must be a framework-independent TypeScript package inside the repository. Svelte components may call it, but the engine must not import Svelte, browser DOM APIs, or UI components.

The simulation must operate month by month because interest, principal allocation, plan benefits, qualifying-payment counts, annual recertification, and forgiveness events can occur monthly.

Each plan simulation must operate on an immutable clone of the scenario. Comparing plans must never mutate the borrower’s source inputs or another plan’s state.

## 12.2 Monetary precision

- Use decimal arithmetic for intermediate calculations, preferably `decimal.js-light` or a comparably small, maintained decimal library.
- Represent displayed money in integer cents.
- Centralize rounding in a tested money module.
- Store rates as decimal strings or basis-point-safe values rather than unvalidated floating-point percentages.
- Apply rule-specific rounding where official guidance specifies it.
- Never format currency inside the domain engine.

## 12.3 Monthly simulation order

Each simulation month should follow a documented order similar to:

1. Determine active rule version and plan state.
2. Apply scheduled income, family, filing-status, and employment changes.
3. Recalculate payment when recertification is due.
4. Determine required payment and minimum/maximum caps.
5. Accrue interest by loan.
6. Apply borrower payment according to allocation rules.
7. Apply plan-specific interest subsidy or waiver.
8. Apply RAP principal matching/support, when eligible.
9. Apply capitalization only when a modeled rule requires it.
10. Update principal, accrued interest, and total borrower payments.
11. Update IDR and PSLF count estimates.
12. Check payoff, PSLF discharge, IDR forgiveness, or term completion.
13. Record monthly audit output.

## 12.4 Simulation output

```ts
export interface PlanProjection {
  planId: PlanId;
  eligibility: EligibilityResult;
  estimateQuality: EstimateQuality;
  monthlyPaymentNowCents: number;
  annualPaymentNowCents: number;
  year5MonthlyPaymentCents: number | null;
  highestMonthlyPaymentCents: number;
  totalBorrowerPaymentsCents: number;
  totalInterestPaidCents: number;
  endingBalanceCents: number;
  estimatedForgivenessCents: number;
  estimatedFederalForgivenessTaxCents: number;
  estimatedStateForgivenessTaxCents: number;
  projectedResolutionMonth: number;
  projectedResolutionType: 'paid_off' | 'idr_forgiveness' | 'pslf' | 'term_end';
  waivedInterestCents: number;
  planCreditsCents: number;
  yearly: YearProjection[];
  warnings: ProjectionWarning[];
  assumptions: AppliedAssumption[];
  audit: ProjectionAuditSummary;
  sourceIds: SourceId[];
}
```

## 12.5 Income and poverty projection

- Begin with user-entered AGI.
- Apply the user’s annual income-growth assumption at the annual recertification boundary.
- Use official current-year HHS poverty guidelines from versioned data.
- For future years without published values, grow poverty guidelines by the user’s future-guideline assumption, default 2.5%.
- Mark projected future poverty values as assumptions.
- Keep separate values for contiguous states/DC, Alaska, and Hawaii.

## 12.6 Married borrowers

- Use the applicable rule for joint versus separate income.
- When combined income and eligible spousal debt are used, implement the applicable debt-proration method.
- Do not model broader tax liability.
- Allow the borrower to compare filing statuses as two temporary calculation variants without replacing the main scenario until selected.
- Display the filing-status tax disclaimer.

## 12.7 Forgiveness tax estimate

Calculate:

```text
estimated federal tax = projected taxable forgiveness × federal rate
estimated state tax = projected taxable forgiveness × state rate
combined estimate = federal estimate + state estimate
```

Do not determine taxability by state. Present the state value only as a user-selected planning assumption.

PSLF forgiveness should default to zero estimated federal forgiveness tax unless the active official rules say otherwise. All tax behavior must be rules-versioned and source-backed.

## 12.8 Plan-specific requirements

### RAP

The engine must support:

- whole-AGI bracket calculation rather than a marginal bracket calculation;
- minimum monthly payment;
- monthly dependent adjustment;
- marital income and debt-proration rules;
- on-time-payment unpaid-interest protection;
- principal matching/support calculation;
- forgiveness term and qualifying-count rules;
- transition and loan-type restrictions;
- explicit visualization of estimated interest waived and principal support.

Boundary tests are mandatory at every RAP AGI threshold, including one cent or one dollar below, exactly at, and above each threshold according to the rule’s unit of calculation.

### Tiered Standard

The engine must support fixed amortized payments and balance-based terms, including the correct threshold behavior.

### Standard

Support ordinary Direct/FFEL fixed schedules and consolidation-specific term rules where applicable.

### Graduated

Support scheduled payment increases and applicable term and payment-ratio constraints. Clearly label that exact servicer schedules may vary within legal limits when applicable.

### Extended

Support eligibility thresholds, program-specific debt tests, fixed and graduated variants, and term length.

### IBR

Support the 10%/20-year and 15%/25-year variants, historical “new borrower” tests, discretionary-income calculation, payment cap, loan-program rules, interest behavior modeled to documented estimator fidelity, and transition rules.

### PAYE

Support the formula and forgiveness term, but apply strict grandfathering and transition checks. Unknown historical facts should normally yield potentially eligible, not eligible.

### ICR

Support the lesser-of calculation, current annual income-percentage factor table, interpolation method, 12-year comparison, forgiveness term, and Parent PLUS consolidation pathways.

### FFEL Income-Sensitive

Because lender formulas may vary within permitted rules, present an estimate range or an explicit limitation. Do not imply a single Department-wide exact payment if the governing rule allows lender-specific methods.

### Perkins

Model ordinary repayment at an estimator level and prominently warn that school-specific servicing and occupation/service cancellation benefits may be more important than consolidation.

### Alternative Repayment

Informational only. Explain that it is an exceptional, individually determined schedule. Do not generate an invented payment.

### SAVE/REPAYE

Display as unavailable/historical according to the active rules version. Include relevant history only where needed for transition or count estimates.

## 12.9 Payment-history portability

Do not use a universal “you lose prior credit” warning. The engine must return a specific history-impact result:

```ts
export interface HistoryImpact {
  outcome: 'preserved' | 'weighted' | 'partially_preserved' | 'uncertain' | 'not_applicable';
  estimatedCreditedMonths: number | null;
  explanation: string;
  missingFields: ScenarioFieldPath[];
  sourceIds: SourceId[];
}
```

Where rules are too fact-specific for a reliable estimate, state that official payment counts must be obtained from Federal Student Aid.

# 13. PSLF requirements

PSLF is a major workflow layer.

Inputs:

- current qualifying-payment count;
- expected qualifying full-time public-service employment;
- optional year the borrower expects to leave public service;
- current Direct Loan status;
- optional historical employment/count details.

Outputs:

- projected remaining months to 120;
- estimated PSLF resolution date;
- projected borrower payments until PSLF;
- projected amount forgiven;
- qualifying-plan warning;
- explanation of assumptions and missing information.

A plan projection must not be labeled PSLF-compatible solely because it is income-driven. Use the active plan-specific rules.

# 14. Recommendations and plain-language results

The application must not present one universal “best plan.” It must show outcome-specific labels such as:

- Lowest estimated payment now
- Lowest projected borrower payments
- Fastest projected payoff
- Best PSLF-compatible estimate
- Most predictable payment
- Strongest balance-growth protection

The recommendation summary must compare at least the top two eligible results, for example:

> RAP has the lowest estimated payment now. Tiered Standard is projected to cost less overall and resolve the debt sooner under your current income-growth assumptions.

Every recommendation must cite the assumptions that drive it and include a “What could change this result?” disclosure.

# 15. Charts and data visualization

## 15.1 Chart scope

The results page must include:

1. Annual payment path
2. Remaining balance path

The charts should default to the top three eligible plans. Users may choose which eligible plans to show, but the chart should cap simultaneous series at four to preserve clarity.

## 15.2 Implementation

Use responsive SVG Svelte components rather than a heavy charting library unless Codex demonstrates a clear accessibility and bundle-size advantage. SVG is preferred because it prints cleanly and supports focusable points.

## 15.3 Interaction

Every yearly point must support:

- mouse hover;
- keyboard focus;
- tap/click;
- a visible callout showing plan name, year, metric, and exact dollar amount;
- highlighting of the active plan line and point;
- temporary de-emphasis of other lines;
- Escape to dismiss a pinned callout.

## 15.4 Detail density

- Plot annual points, not monthly points.
- Label the x-axis at sensible intervals, generally every five years for long timelines.
- Use exact values in tooltips and data tables.
- Do not render every year label when it causes overlap.
- Maintain sufficient chart height on desktop and mobile.

## 15.5 Accessible alternatives

Each chart must include:

- an accessible heading and description;
- a concise text summary;
- a visually accessible “View data table” control;
- a semantic table containing the same annual values;
- no information conveyed through color alone;
- line styles, labels, or point shapes that distinguish plans.

# 16. Print and browser-PDF report

Version 1 uses browser printing rather than a PDF-generation library.

Button label:

> Print or save as PDF

The print stylesheet must produce a clean report containing:

1. Product name, logo, and scenario title
2. Date generated
3. Rules version and last-reviewed date
4. Estimate-quality indicator
5. Plain-language recommendation summary
6. Top-three eligible plan comparison
7. Entered inputs and assumptions
8. Annual payment table
9. Remaining-balance table
10. Estimated forgiveness and tax assumptions
11. PSLF summary, when relevant
12. Benefits and tradeoffs
13. Missing-information warnings
14. Full disclaimer
15. Official source list
16. Copyright

Print behavior:

- hide form controls, navigation, tooltips, and buttons;
- expand collapsed result details needed for the report;
- avoid splitting a small plan card across pages when practical;
- repeat table headers;
- render charts as SVG where supported, but always include tables;
- use black or near-black text on white;
- do not print decorative backgrounds that reduce readability;
- support browser “Save as PDF.”

# 17. Visual design system

## 17.1 Direction

Use the current prototype as the visual reference:

- light background;
- near-black body copy;
- pastel blue, pink, yellow, orange, mint, and purple accents;
- rounded cards;
- subtle gradients;
- soft depth and restrained glass-like surfaces;
- clear hierarchy;
- generous spacing;
- minimal decorative clutter.

The aesthetic must never reduce legibility or imply that the product is entertainment rather than a financial-planning estimator.

## 17.2 Contrast

- Regular-weight body text should generally use near-black.
- Muted text must still meet WCAG contrast requirements.
- Pastel colors are for surfaces, borders, highlights, and charts, not essential low-contrast copy.
- Focus indicators must be highly visible.
- Eligibility must use text and icons in addition to color.

## 17.3 Suggested tokens

```css
:root {
  --color-text: #111827;
  --color-text-secondary: #29334a;
  --color-bg: #f8fbff;
  --color-surface: #ffffff;
  --color-border: #cfd6e4;
  --color-blue: #59c7ff;
  --color-blue-strong: #1769e0;
  --color-pink: #ff78c8;
  --color-pink-strong: #b91c75;
  --color-yellow: #ffe37a;
  --color-orange: #ffad5c;
  --color-mint: #8ce7cf;
  --color-purple: #8d73f8;
  --color-success: #0f7657;
  --color-warning: #805500;
  --color-danger: #a32954;
  --radius-card: 1.25rem;
  --shadow-card: 0 1.25rem 3rem rgba(37, 52, 94, 0.12);
}
```

Codex must verify final contrast values and may adjust these tokens.

## 17.4 Typography

Use a system font stack. Do not load web fonts from third parties.

Recommended:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Inter may be used only when installed locally on the user’s system; do not fetch it.

# 18. Accessibility requirements

The release target is WCAG 2.2 Level AA.

Required behavior includes:

- semantic landmarks and heading order;
- skip link;
- complete keyboard operation;
- visible focus indicators;
- no keyboard traps;
- minimum touch-target sizing;
- labels and descriptions for all inputs;
- field-level validation associated with inputs;
- focus management when onboarding steps or mobile drawers change;
- tooltips available through focus and click, not hover alone;
- reduced-motion support;
- no auto-playing animation;
- status announcements for recalculation;
- error summary for form submissions;
- accessible chart alternatives;
- color-independent eligibility/status cues;
- print output that remains readable in grayscale;
- automated axe tests plus manual keyboard and screen-reader checks.

The accessibility route must describe:

- the conformance target;
- keyboard support;
- chart data-table alternatives;
- known beta limitations;
- the absence of a feedback email, without inventing one.

# 19. Privacy and security

## 19.1 Privacy principles

- No backend.
- No accounts.
- No analytics.
- No tracking.
- No advertisements.
- No telemetry containing user inputs.
- No runtime requests for rules or calculations.
- No user inputs in URLs.
- No persistent scenario storage.

## 19.2 Session recovery

Use `sessionStorage` only to recover an accidental refresh during the same browser session.

Recommended storage key:

```text
student-loan-estimator:draft:v1
```

Store only:

- current scenario draft;
- current onboarding/result step;
- expanded/collapsed UI state;
- undo metadata if needed.

Do not store calculated audit trails if they can be regenerated.

Hydration requirements:

- read storage only in the browser after mount;
- validate the stored schema;
- migrate only when a safe migration exists;
- discard invalid or incompatible state;
- clear state on “Delete all entered data.”

## 19.3 Security controls

- Use strict TypeScript.
- Validate all user-entered numbers and dates.
- Never insert user text as raw HTML.
- Avoid third-party scripts.
- Use no CDN assets.
- Add a restrictive Content Security Policy through a static `<meta http-equiv>` where practical for GitHub Pages.
- Audit dependencies before release.
- Enable Dependabot for npm and GitHub Actions.
- Keep the dependency set small.
- Do not add a service worker in version 1, because stale cached rule data could outlive a deployment.

# 20. Technical architecture

## 20.1 Stack

- SvelteKit, current stable release at implementation time
- Svelte, current stable release
- TypeScript with strict mode
- `@sveltejs/adapter-static`
- Node.js 24 LTS
- npm with committed `package-lock.json`
- Vitest for unit and integration tests
- Playwright for end-to-end and visual tests
- `@testing-library/svelte` for component tests where useful
- axe-core integration for accessibility checks
- ESLint and Prettier
- decimal arithmetic library such as `decimal.js-light`

Codex must verify current compatible package versions, pin them in `package.json` and `package-lock.json`, and document the chosen versions.

## 20.2 Architectural layers

### Presentation layer

Svelte routes and components. Responsible only for input, rendering, focus, responsive behavior, tooltips, and chart interaction.

### Application-state layer

A central scenario store coordinates onboarding, live editing, undo, validation, and session recovery. It calls the domain engine and exposes immutable results.

### Domain layer

Framework-independent TypeScript modules for:

- eligibility;
- payment formulas;
- monthly simulation;
- forgiveness;
- PSLF;
- plan ranking;
- estimate quality;
- history impact;
- recommendation generation.

### Rules and annual-data layer

Versioned formulas, thresholds, factor tables, source references, and effective dates.

### Content layer

Plain-language plan descriptions, glossary, disclaimers, methodology, and source metadata. Content must not duplicate numeric rules in a way that can drift from the domain layer.

## 20.3 Data flow

```text
User input
  -> scenario validation
  -> normalized scenario
  -> eligibility evaluation per plan
  -> plan simulations
  -> projection comparison and ranking
  -> recommendation summaries
  -> Svelte view model
  -> UI, accessible tables, and print report
```

## 20.4 State model

```ts
export interface EstimatorState {
  schemaVersion: 1;
  mode: 'quick' | 'detailed';
  stage: 'landing' | 'onboarding' | 'results';
  scenario: BorrowerScenario;
  validation: ValidationState;
  results: ScenarioResults | null;
  calculationStatus: 'idle' | 'calculating' | 'ready' | 'error';
  expandedAllPlans: boolean;
  selectedChartPlanIds: PlanId[];
  estimateQuality: EstimateQuality;
  undoAvailable: boolean;
}
```

The state store must not embed DOM nodes, component instances, or nonserializable values in the session draft.

## 20.5 Calculation execution

Start with calculation on the main thread. The engine should be pure and optimized enough for ordinary scenarios. Add a Web Worker only if profiling shows calculations regularly block interaction beyond 100 ms on supported mobile hardware.

The architecture must keep the engine worker-compatible by avoiding DOM and browser globals.

# 21. Recommended repository structure

```text
student-loan-planner/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy-pages.yml
│   └── dependabot.yml
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── calculation-methodology.md
│   ├── rules-maintenance.md
│   ├── testing.md
│   ├── accessibility-checklist.md
│   ├── source-register.md
│   └── reference/
│       └── prototype-notes.md
├── src/
│   ├── app.html
│   ├── app.css
│   ├── lib/
│   │   ├── components/
│   │   │   ├── brand/
│   │   │   ├── charts/
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   ├── plans/
│   │   │   ├── print/
│   │   │   └── ui/
│   │   ├── content/
│   │   │   ├── disclaimers.ts
│   │   │   ├── glossary.ts
│   │   │   └── plan-copy.ts
│   │   ├── domain/
│   │   │   ├── eligibility/
│   │   │   ├── formulas/
│   │   │   ├── history/
│   │   │   ├── money/
│   │   │   ├── ranking/
│   │   │   ├── recommendations/
│   │   │   ├── simulation/
│   │   │   ├── tax/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── rules/
│   │   │   ├── annual/
│   │   │   │   └── 2026/
│   │   │   │       ├── icr-factors.ts
│   │   │   │       ├── poverty-guidelines.ts
│   │   │   │       └── tax-defaults.ts
│   │   │   ├── versions/
│   │   │   │   └── 2026-07-01/
│   │   │   │       ├── eligibility.ts
│   │   │   │       ├── plans.ts
│   │   │   │       ├── transitions.ts
│   │   │   │       └── tests/
│   │   │   ├── index.ts
│   │   │   ├── rule-version.ts
│   │   │   └── sources.ts
│   │   ├── state/
│   │   │   ├── estimator-store.ts
│   │   │   ├── session-storage.ts
│   │   │   ├── undo.ts
│   │   │   └── validation.ts
│   │   └── utils/
│   └── routes/
│       ├── +layout.ts
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── methodology/
│       │   └── +page.svelte
│       ├── sources/
│       │   └── +page.svelte
│       └── accessibility/
│           └── +page.svelte
├── static/
│   ├── brand/
│   ├── favicon.svg
│   ├── favicon-32.png
│   └── apple-touch-icon.png
├── tests/
│   ├── e2e/
│   ├── fixtures/
│   ├── official-examples/
│   └── visual/
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
├── playwright.config.ts
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

# 22. GitHub Pages configuration

## 22.1 SvelteKit configuration

Use `@sveltejs/adapter-static`. The base path must be configurable so local development uses `/` and GitHub Pages uses `/student-loan-planner`.

Recommended pattern:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    paths: {
      base
    },
    prerender: {
      handleHttpError: 'fail'
    }
  }
};

export default config;
```

All routes must opt into prerendering in the root layout:

```ts
// src/routes/+layout.ts
export const prerender = true;
export const trailingSlash = 'always';
```

Use SvelteKit path utilities for internal links and assets. Do not hardcode root-absolute paths that break under the repository subpath.

## 22.2 Package scripts

Required scripts:

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "eslint . && prettier --check .",
    "format": "prettier --write .",
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test --grep @a11y",
    "test:visual": "playwright test --grep @visual"
  }
}
```

## 22.3 Continuous integration workflow

Create `.github/workflows/ci.yml` for pull requests and pushes to `main`. CI is the authoritative quality gate and must run against the same lockfile and Pages base-path assumptions used for release.

Required behavior:

- check out the repository;
- install the Node version declared by the repository;
- run `npm ci` from the committed, registry-generated `package-lock.json`;
- run Svelte/TypeScript checks;
- lint actual `.ts` and `.svelte` application source with supported parsers; do not make CI green by ignoring those source types;
- run unit tests;
- build the static site with `BASE_PATH=/${{ github.event.repository.name }}`;
- install Playwright Chromium only in the browser-test job;
- serve the already-built Pages-mode output;
- run browser smoke, interaction, and accessibility tests against the repository subpath;
- upload Playwright traces, screenshots, and reports on failure.

Use separate jobs so a failure is easy to diagnose:

1. `quality`: install, check, lint, unit test;
2. `build`: Pages-mode static build and artifact upload for internal CI use;
3. `browser`: consume or recreate the Pages-mode build, install Chromium, and run Playwright;
4. `ci-success`: depend on all required jobs and provide one branch-protection check.

The workflow must not use `npm install` as the normal CI installer. `npm install` is allowed only during Task 1 to generate the initial real lockfile. After that lockfile is committed, CI and Codex setup use `npm ci`.

## 22.4 Automated deployment workflow

Create `.github/workflows/deploy-pages.yml`. Deployment must not independently repeat a weaker subset of checks and publish while CI is red. Use one of these approved patterns:

**Preferred pattern:** a single release workflow on pushes to `main` that runs the required quality, build, and browser jobs, then deploys only after all required jobs pass.

**Acceptable pattern:** CI runs first, and the Pages deployment workflow is triggered by `workflow_run` only when the completed CI workflow on `main` concludes successfully.

The preferred logical sequence is:

```text
push to main
  -> npm ci
  -> check + lint + unit tests
  -> Pages-mode static build
  -> Playwright smoke/accessibility tests against built output
  -> upload Pages artifact
  -> deploy
  -> post-deploy smoke test against the public Pages URL
```

Deployment requirements:

- set `BASE_PATH` from the actual repository name rather than a separately typed lowercase value;
- upload only the generated static output directory;
- use official GitHub Pages actions;
- declare `pages: write` and `id-token: write` only in the deployment workflow/job;
- use a GitHub Pages environment;
- stop before deployment if any required check fails;
- provide a manual `workflow_dispatch` path for controlled reruns;
- run a minimal post-deploy smoke test that confirms the page title, stylesheet, JavaScript, and logo load from the public project URL.

Codex must verify current stable official action major versions during implementation and document the selected versions. Do not use unverified third-party deployment actions.

## 22.5 One-time repository setting

The repository owner must select **Settings → Pages → Build and deployment → Source: GitHub Actions** once. After that, every successful push to `main` deploys automatically.

## 22.6 Deployment acceptance criteria

- A clean clone builds with documented commands.
- The site works at the repository subpath.
- Direct navigation to every static route works.
- CSS, scripts, icons, and logo assets load from the Pages URL.
- A failing test or build prevents deployment.
- A successful main-branch workflow updates the Pages environment.
- No secret is required.
- No backend is deployed.

# 23. Rules and annual-data architecture

## 23.1 Versioning model

Rules are manual, source-backed, and immutable after release except for correction commits documented in the changelog.

Recommended structure:

```text
src/lib/rules/versions/2026-07-01/
src/lib/rules/annual/2026/
```

Each version exports:

```ts
export interface RuleSetMetadata {
  id: string;
  effectiveFrom: string;
  effectiveThrough: string | null;
  reviewedOn: string;
  status: 'active' | 'historical' | 'future';
  sourceIds: SourceId[];
  notes: string[];
}
```

## 23.2 Manual maintenance process

Neon Dreams Engineering Division owns maintenance.

Review rules:

- at least once each January;
- whenever major student-loan legislation is enacted;
- whenever the Department of Education publishes new final rules or operational guidance;
- when HHS publishes annual poverty guidelines;
- when annual ICR factors are published;
- when IRS treatment relevant to forgiveness changes;
- before a new public-beta release.

Update workflow:

1. Review primary official sources.
2. Add a new dated rules or annual-data module.
3. Preserve the old version.
4. Update source metadata and retrieval dates.
5. Add or update official-example and boundary tests.
6. Run the entire test suite.
7. Update rules-review date and changelog.
8. Manually test representative borrower scenarios.
9. Merge to `main`; automated deployment handles publication.

Do not scrape rules automatically.

## 23.3 Staleness warning

The app must display:

> Rules reviewed through June 18, 2026

If the current browser date is more than 12 months after `reviewedOn`, display a prominent warning:

> These repayment rules have not been reviewed in more than 12 months. Confirm current options through Federal Student Aid before relying on this estimate.

Do not hide the estimator solely because the rules are stale.

## 23.4 Source metadata

```ts
export interface SourceRecord {
  id: SourceId;
  title: string;
  publisher: string;
  url: string;
  retrievedOn: string;
  publishedOn?: string;
  effectiveFrom?: string;
  sourceType: 'statute' | 'regulation' | 'federal-register' | 'agency-guidance' | 'annual-data' | 'technical-doc';
  notes?: string;
}
```

# 24. Content and source requirements

The Sources page must prioritize primary sources:

- Federal Register final rules;
- current eCFR regulations;
- Federal Student Aid and Department of Education guidance;
- HHS poverty guidelines;
- IRS tax guidance;
- official GitHub Pages documentation;
- official SvelteKit documentation;
- W3C WCAG 2.2.

Do not rely on news articles as the rule source when an official source is available.

The page must show:

- rules version;
- last-reviewed date;
- effective dates;
- source title and publisher;
- external-link warning;
- short note that external content can change after review.

# 25. Testing strategy

Testing is a release requirement, not a later enhancement.

## 25.1 Unit tests

Test:

- money and rounding utilities;
- amortization;
- poverty calculations;
- RAP bracket thresholds and dependent adjustments;
- IBR 10% and 15% formulas and caps;
- PAYE formula and cap;
- ICR factor interpolation;
- Tiered Standard term thresholds;
- Standard consolidation terms;
- Extended eligibility thresholds;
- forgiveness-tax estimate;
- spousal debt proration;
- ranking and tie-breaking;
- estimate-quality scoring;
- history-impact results;
- rule-version selection.

## 25.2 Eligibility matrix tests

At minimum:

- pre-July-2026 Direct borrower;
- post-July-2026 Direct borrower;
- mixed cohort;
- Direct Parent PLUS;
- Parent PLUS consolidation;
- graduate PLUS;
- FFEL-only;
- Perkins-only;
- consolidation after July 1, 2026;
- grandfathered PAYE facts complete;
- PAYE history unknown;
- ICR Parent PLUS transition;
- default status;
- missing disbursement date;
- SAVE historical borrower.

## 25.3 Simulation tests

- payment less than monthly interest;
- RAP unpaid-interest protection;
- RAP principal support;
- fixed-plan payoff;
- early payoff;
- income increase and decrease;
- family-size change;
- filing-status change;
- PSLF at 120 total qualifying months;
- IDR forgiveness at applicable term;
- consolidation/history weighting;
- zero and very low income;
- very high income;
- zero-interest loan;
- final payment smaller than scheduled payment.

## 25.4 Official-example regression tests

Where official rules or notices provide examples, encode them as fixtures with:

- source ID;
- input data;
- expected result;
- accepted rounding tolerance;
- rule version.

## 25.5 Component tests

Test:

- onboarding skip behavior;
- “I don’t know” values;
- validation;
- live recalculation;
- top-three sorting;
- show-all expansion;
- accessible tooltips;
- session recovery;
- undo;
- delete-all behavior;
- mobile drawer focus management;
- print-mode content.

## 25.6 End-to-end tests

Critical flows:

1. Quick estimate from landing to results.
2. Detailed estimate with multiple loans.
3. Skip unknown eligibility facts and receive potentially eligible status.
4. Change income in results and observe live re-sort.
5. Expand all plans and collapse again.
6. Use chart tooltip with mouse and keyboard.
7. Refresh and restore session draft.
8. Delete all entered data and verify storage cleared.
9. Print view contains required sections.
10. Navigate all routes under the GitHub Pages base path.

## 25.7 Accessibility testing

- axe checks on every route and major estimator state;
- keyboard-only test;
- focus order and focus visibility;
- 200% zoom and reflow;
- reduced motion;
- mobile target size;
- chart table alternative;
- screen-reader announcements;
- grayscale print review.

## 25.8 Visual regression

Capture at minimum:

- desktop landing;
- desktop results;
- mobile onboarding;
- mobile results drawer;
- expanded all-plans state;
- tooltips open;
- print layout.

Use stable fixtures and mask dates where necessary.

# 26. Performance and compatibility

## 26.1 Browser support

Support current stable versions of:

- Chrome;
- Edge;
- Firefox;
- Safari;
- iOS Safari;
- Android Chrome.

Older browsers are out of scope.

## 26.2 Responsive support

- Minimum design width: 320 CSS pixels.
- No horizontal page scrolling at supported widths.
- Comparison tables may use contained horizontal scrolling with sticky first column and accessible context.
- Mobile controls must be touch friendly.

## 26.3 Performance budgets

Targets for the public beta:

- no runtime API dependency;
- initial JavaScript target below 300 KB gzipped;
- no heavy charting library unless justified;
- main-thread calculation under 100 ms for typical quick scenarios;
- live update perceived within 500 ms after input settles;
- Lighthouse accessibility score at least 95 in release checks;
- no production console errors.

# 27. Error handling

## 27.1 Validation errors

- Validate at field level and on step progression.
- Do not erase user entries.
- Move focus to an error summary when a step cannot proceed.
- Allow skipping nonessential fields.

## 27.2 Calculation errors

A failure in one plan must not prevent other plan results.

Return a plan-level error state:

```ts
export interface ProjectionFailure {
  planId: PlanId;
  code: ProjectionErrorCode;
  message: string;
  recoverable: boolean;
  relatedFields: ScenarioFieldPath[];
}
```

Show a concise user message and preserve diagnostic details for tests/development only.

## 27.3 Session recovery errors

If stored session data is invalid or incompatible:

- discard it safely;
- begin with a clean state;
- show a brief nontechnical message;
- never crash hydration.

# 28. Documentation requirements

Codex must create:

- `README.md`: overview, commands, deployment, privacy, beta disclaimer;
- `AGENTS.md`: implementation guardrails and commands for future coding agents;
- `docs/PRD.md`: repository copy of this specification;
- `docs/architecture.md`: layers, data flow, state, deployment;
- `docs/calculation-methodology.md`: formulas, rounding, assumptions, limitations;
- `docs/rules-maintenance.md`: versioning and update checklist;
- `docs/testing.md`: test matrix and commands;
- `docs/accessibility-checklist.md`;
- `docs/source-register.md`;
- `CONTRIBUTING.md`, even though no additional contributor is planned;
- `CHANGELOG.md`;
- an open-source license selected by the repository owner or a clearly marked placeholder requiring owner confirmation before public release.

Do not invent a legal license decision. If none is supplied, Codex must flag it in the README as a pre-release owner action.

# 29. Two-stage Codex build and implementation plan

The project must be built in two separate Codex tasks. Task 2 must not begin until Task 1 has produced a committed, reproducible, green foundation and the Codex Cloud environment has been reset against it.

## 29.1 Why two stages are mandatory

Codex Cloud prepares its container and runs the environment setup before the agent creates new project files. An empty repository therefore cannot provide a package manifest, lockfile, framework-generated files, or browser-test configuration during initial setup. Asking one task to invent all of those and then fully validate a production application creates a bootstrap gap: the most reliable dependency-installation phase occurs before the dependencies exist.

V2 eliminates that gap by making the framework and dependency graph exist before the full implementation task starts.

## 29.2 Stage 0: Owner preparation

Before Task 1:

1. Create or clean the public repository `focus-on-the-code/student-loan-planner`.
2. Commit this PRD, `AGENTS.md`, and the existing HTML prototype as a non-production visual reference.
3. Ensure the default branch is `main`.
4. Do not enable automatic merge.
5. Configure the first Codex task with npm package access.
6. Do not require Playwright browser installation during the first environment setup unless browser-download endpoints have already been verified.

Exit evidence:

- repository can be checked out by Codex;
- PRD and guardrails are visible;
- no stale generated framework or hand-written lockfile is present.

## 29.3 Codex Task 1: Bootstrap and prove the toolchain

Task 1 must create only the minimum runnable foundation:

- SvelteKit + Svelte + TypeScript static project;
- `package.json` with pinned compatible ranges;
- a genuine npm-generated `package-lock.json`;
- `svelte.config.js` using `@sveltejs/adapter-static`;
- root prerender configuration suitable for GitHub Pages;
- base-path-safe asset and internal-link pattern;
- strict TypeScript and Svelte checks;
- ESLint configured to lint `.ts` and `.svelte` source rather than ignore it;
- Prettier configuration;
- Vitest with one meaningful unit smoke test;
- one accessible page showing the product title and a temporary “bootstrap verified” message;
- a minimal CI workflow that runs `npm ci`, check, lint, unit test, and Pages-mode build;
- repository setup documentation and a Codex setup script;
- no calculator formulas, no full UI, no Playwright dependency, and no deployment yet unless all bootstrap checks are green.

Task 1 commands that must succeed in Codex or GitHub CI:

```bash
npm ci
npm run check
npm run lint
npm run test:unit
BASE_PATH=/Student-Loan-Planner npm run build
```

Task 1 must inspect the generated `build/` directory and verify that:

- `index.html` exists;
- JS and CSS assets exist;
- logo or test asset URLs include or correctly resolve under the repository base path;
- there are no unresolved root-absolute application asset paths;
- the static adapter reports no dynamic-route error.

### Task 1 merge gate

Task 1 may be merged only when:

- a real `package-lock.json` is committed;
- all bootstrap CI jobs are green;
- a clean GitHub Actions runner uses `npm ci` successfully;
- the Pages-mode build succeeds;
- review confirms the linter did not evade source validation by ignoring all TypeScript or Svelte files;
- the PR description includes exact command results rather than unsupported claims.

After merging Task 1, stop. Do not continue the full application in the same Codex task.

## 29.4 Between tasks: Configure and reset Codex Cloud

After Task 1 is on the branch Task 2 will start from:

1. Select the repository and branch containing the committed package manifest and lockfile.
2. Set the Node version to match the repository.
3. Enable agent internet access before starting the task.
4. Enable the common package-management dependencies required for npm.
5. Add the required Playwright browser-download endpoints or allow the necessary network access for browser installation.
6. Configure the setup script in Appendix E.
7. Save the environment.
8. Reset the Codex environment cache.
9. Start a new task; do not resume the old container.
10. Confirm setup output shows successful `npm ci` and repository verification before implementation begins.

This step is mandatory because changing internet settings or setup scripts during an already-running task is not treated as proof that the existing task container was recreated correctly.

## 29.5 Codex Task 2: Full implementation

Task 2 begins from the proven Task 1 repository. Its setup phase must install the already-declared dependency graph before the agent edits files.

Implement the application in the following internal phases, committing coherent changes and validating after each phase.

### Phase 1: Domain foundations

Tasks:

- create domain types and validation schemas;
- create rules-version metadata and source registry;
- create money, date, poverty-guideline, and amortization utilities;
- define eligibility result states;
- add deterministic fixtures.

Exit criteria:

- strict TypeScript passes;
- domain package has no Svelte or DOM imports;
- source-backed rule metadata exists;
- foundational unit tests pass.

### Phase 2: Plan formulas and simulation

Tasks:

- implement fixed-plan amortization;
- implement Standard, Graduated, Extended, and Tiered Standard;
- implement IBR, PAYE, ICR, and RAP;
- implement FFEL and Perkins estimator behavior;
- implement Parent PLUS transitions;
- implement PSLF layer;
- implement history-impact estimation;
- implement forgiveness tax assumptions;
- implement plan ranking and recommendation summaries.

Exit criteria:

- official-example and boundary tests pass;
- plan-level failures are isolated;
- top-three ranking is deterministic;
- monthly audit output reconciles with totals.

### Phase 3: Guided inputs and state

Tasks:

- build quick and detailed flows;
- support unknown/skip values;
- implement estimate-quality indicator;
- implement validation;
- implement central state store;
- implement session recovery;
- implement 20-step undo;
- implement reset and delete-all behavior.

Exit criteria:

- quick flow completes with minimal inputs;
- detailed flow supports multiple loans;
- refresh restores session state;
- delete-all clears session state;
- component accessibility checks pass for onboarding.

### Phase 4: Results workspace

Tasks:

- build persistent live editor;
- build top-three comparison and show-all expansion;
- build header tooltips;
- build plan cards and recommendations;
- build assumptions and missing-information panels;
- build interactive SVG charts and accessible data tables;
- implement responsive mobile drawer.

Exit criteria:

- input changes update and re-sort results live;
- only clearly eligible plans appear in top three;
- chart points are interactive by mouse, keyboard, and touch;
- all results remain readable at mobile widths.

### Phase 5: Print, content, and support routes

Tasks:

- create print stylesheet and report layout;
- add methodology, sources, and accessibility routes;
- add disclaimers and glossary;
- add staleness warning;
- remove prototype-only design-aesthetic copy;
- complete brand and footer.

Exit criteria:

- browser print contains all required report sections;
- support routes are prerendered;
- source links and rules dates are correct;
- print is readable in grayscale.

### Phase 6: Browser testing and public-beta hardening

Only after the application can build reliably:

- add Playwright and Axe dependencies;
- install Chromium in the configured Codex environment;
- create smoke, interaction, accessibility, and base-path tests;
- serve the Pages-mode static build rather than an unrelated root-path development server;
- run dependency audit;
- review privacy behavior;
- test current browsers and mobile layouts;
- perform manual calculation spot checks;
- finalize documentation and changelog.

Exit criteria:

- complete required command sequence is green;
- browser tests pass under `/Student-Loan-Planner/`;
- no blocker or critical accessibility defect remains;
- known beta limitations are documented.

## 29.6 Task 2 completion and merge gate

Before Task 2 opens or updates its final PR, Codex must run and report:

```bash
npm ci
npm run check
npm run lint
npm run test:unit
BASE_PATH=/Student-Loan-Planner npm run build
npx playwright install --with-deps chromium
BASE_PATH=/Student-Loan-Planner npm run test:e2e
```

If any command cannot run, Codex must state that the task is incomplete. It must not substitute file inspection for successful execution and must not write “passed” in the PR description without corresponding logs.

Merge only when:

- GitHub CI is green on the PR head or merge commit;
- the built artifact has been inspected;
- a preview or temporary Pages deployment loads correctly;
- logo, CSS, JavaScript, internal links, and static routes work at the repository subpath;
- Playwright smoke and accessibility tests pass;
- no required check is skipped;
- the PR’s claims match the actual workflow results.

## 29.7 Release after merge

A push to `main` must run the complete release pipeline. Deployment occurs only after required checks pass. After deployment, verify the public Pages URL manually and through the post-deploy smoke test. A successful artifact upload alone is not sufficient proof that the public site works.

# 30. Codex execution contract

Codex must treat this document as the authoritative implementation brief.

## 30.1 Required behavior

1. Build the complete repository, not a mockup.
2. Use SvelteKit, Svelte, TypeScript, and static deployment.
3. Keep the domain engine independent from Svelte.
4. Use primary official sources for legal and annual rule data.
5. Add a source ID to every rule module.
6. Add tests before considering a formula complete.
7. Keep all calculations and borrower data in the browser.
8. Do not add analytics, telemetry, accounts, APIs, or a backend.
9. Do not use localStorage for borrower scenarios.
10. Do not put borrower information in URLs.
11. Do not add a service worker.
12. Do not treat the prototype’s formulas as authoritative.
13. Preserve the prototype’s visual direction while increasing accessibility and production quality.
14. Remove the user-facing design-tone bubble.
15. Run format, lint, type-check, unit, E2E, and build commands before completion.
16. Leave the repository in a state that deploys automatically after Pages is enabled for GitHub Actions.
17. Execute the work as two separate Codex tasks; do not collapse bootstrap and full implementation into one empty-repository task.
18. Never hand-write or approximate `package-lock.json`; generate it through npm and commit it.
19. Never claim a command passed when it was not executed successfully in the current repository state.
20. Do not make lint or formatting green by excluding all `.ts` or `.svelte` application source.
21. Do not merge or recommend merge while required GitHub checks are red, skipped, or absent.
22. Treat GitHub Actions logs and the deployed smoke test as authoritative evidence.

## 30.2 Implementation sequence

Codex Task 1 must complete and be merged or otherwise preserved as a verified base before Codex Task 2 begins. Task 2 should implement in the internal phase order above. After each phase:

- run relevant tests;
- update the changelog;
- update documentation if architecture changes;
- resolve errors before beginning the next phase.

## 30.3 No-placeholder rule

The final repository must not contain:

- fake calculations;
- “TODO” formulas for launch plans;
- dummy source citations;
- inaccessible placeholder charts;
- buttons that do nothing;
- fabricated legal statements;
- hidden data transmission.

Informational-only features must be explicitly labeled informational rather than simulated.

## 30.4 Agent verification checklist

Before declaring completion, Codex must report:

- files created and major architecture decisions;
- package versions;
- test commands and results;
- build output path;
- GitHub Pages base-path verification;
- known limitations;
- any owner action still required, including enabling Pages and choosing a license;
- whether execution occurred in Task 1 or Task 2;
- exact setup-script output relevant to dependency installation;
- GitHub Actions run status and failed-step details, if any;
- explicit statement that no unexecuted test is being represented as passed.

# 31. Acceptance criteria

## 31.1 Product acceptance

- A new user can reach a quick estimate without entering unknown optional details.
- A detailed user can enter multiple federal loans.
- Results show estimate quality and assumptions.
- Top three contains only clearly eligible plans.
- Top three re-sorts live by current monthly payment, then total borrower payments.
- “Show all plans” reveals remaining statuses with reasons.
- Users can edit inputs without returning through onboarding.
- Monthly, annual, year-five, total, forgiveness, tax, and timeline estimates are shown where calculable.
- RAP interest protection and principal support are displayed separately.
- History impacts are specific or explicitly uncertain, not generalized.
- PSLF results show remaining months and assumptions.
- Charts are interactive and accessible.
- Print or save as PDF produces a complete plain-language report.

## 31.2 Technical acceptance

- `npm ci`, `npm run check`, `npm run lint`, `npm run test`, and `npm run build` succeed.
- The app is fully static.
- No runtime network request is needed for core operation.
- No user data is persisted beyond session storage.
- Delete-all clears the session draft.
- All routes work at `/student-loan-planner/`.
- GitHub Actions deploys only after successful checks.
- Task 1 bootstrap has a genuine lockfile and green Pages-mode build before Task 2 begins.
- Browser tests run against the repository base path and built static output.
- CI validates Svelte and TypeScript source rather than excluding it.
- Production has no console errors.

## 31.3 Accessibility acceptance

- No critical or serious automated axe violations.
- Complete keyboard operation.
- Visible focus throughout.
- Chart data available in semantic tables.
- Tooltips work by focus and click.
- No essential information depends only on color.
- Layout works at 320 px and 200% zoom.
- Print output is legible in grayscale.

## 31.4 Privacy acceptance

- No analytics or tracking scripts.
- No third-party runtime scripts.
- No borrower data in URLs.
- No borrower data in localStorage.
- No network submission of borrower inputs.
- Session data clears through the delete control.

# 32. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Federal rules change | Estimates become stale | Versioned rules, visible review date, 12-month warning, manual maintenance workflow |
| Empty-repository Codex bootstrap gap | Dependencies and tools do not exist during setup | Mandatory Task 1 bootstrap, committed lockfile, cache reset, new Task 2 |
| Mid-task environment change | Existing container may not receive reliable new setup/network state | Configure before task, save, reset cache, start a new task |
| Browser binary downloads blocked | Playwright package installs but Chromium does not | Verify Microsoft browser-download access before Task 2; isolate browser install |
| False green by skipped validation | Broken app reaches PR or main | Exact command evidence, no skipped required checks, merge gate tied to GitHub CI |
| Deploy workflow weaker than CI | Site publishes while E2E is red | Deployment depends on complete green CI or uses a single gated release workflow |
| Eligibility is fact-specific | False confidence | Four-state eligibility model, unknown values, missing-field explanations, disclaimer |
| Calculation drift | Incorrect totals | Pure domain engine, official examples, boundary tests, monthly audit records |
| Parent PLUS complexity | Misleading results | Dedicated lineage fields, potentially eligible status, transition-specific tests |
| Tax uncertainty | Misstated total cost | User-entered rates, no state-law database, clear tax disclaimer |
| GitHub Pages base path | Broken assets/routes | Configurable base path, route tests, deploy workflow build environment |
| Accessibility regression | Excludes users | WCAG acceptance criteria, axe, keyboard, visual and manual checks |
| Stale service-worker cache | Old rules remain active | No service worker in v1 |
| Sensitive data persistence | Privacy harm | Session-only recovery, delete-all control, no analytics/backend/localStorage |
| Long calculation blocks UI | Poor mobile experience | Pure optimized engine, profiling, Web Worker-ready architecture |

# 33. Definition of done

The public beta is done when:

- the repository structure and documentation are complete;
- all launch-scope plans have tested estimator behavior or explicit informational treatment;
- official source registry and rules dates are populated;
- quick and detailed input modes work;
- skipped information is handled without false certainty;
- the live results editor works on desktop and mobile;
- top-three sorting and show-all behavior match the specification;
- chart interactions and data tables are accessible;
- print reporting works;
- session recovery, undo, reset, and delete-all work;
- WCAG 2.2 AA checks and manual review have no release-blocking issue;
- Task 1 and Task 2 merge gates were satisfied with recorded evidence;
- CI and deployment workflows pass;
- the site runs correctly at the GitHub Pages URL;
- the README documents the one-time Pages setting;
- known public-beta limitations are visible;
- the repository owner has selected a license or the release is withheld until one is chosen.

# 34. Initial official source register

Codex must verify these sources during implementation and record retrieval dates in `src/lib/rules/sources.ts` and `docs/source-register.md`.

## Federal student-loan rules and guidance

1. U.S. Department of Education, Federal Register, “Reimagining and Improving Student Education—Federal Student Loan Program Final Regulations,” May 1, 2026.  
   `https://www.federalregister.gov/documents/2026/05/01/2026-08556/reimagining-and-improving-student-education-federal-student-loan-program-final-regulations`

2. Federal Student Aid, “One Big Beautiful Bill Act Updates.”  
   `https://studentaid.gov/announcements-events/big-updates/`

3. Electronic Code of Federal Regulations, 34 CFR Part 685, Direct Loan repayment provisions.  
   `https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-685`

4. Electronic Code of Federal Regulations, 34 CFR Part 682, FFEL repayment provisions.  
   `https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-682`

5. Electronic Code of Federal Regulations, 34 CFR Part 674, Perkins Loan provisions.  
   `https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-674`

6. Federal Register, annual ICR formula update for 2026.  
   `https://www.federalregister.gov/documents/2026/06/09/2026-11540/annual-updates-to-the-income-contingent-repayment-icr-plan-formula-for-2026-william-d-ford-federal`

7. Federal Student Aid PSLF guidance and official payment-count resources.  
   `https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service`

## Annual financial and tax data

8. HHS ASPE, 2026 Poverty Guidelines.  
   `https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines`

9. Internal Revenue Service, Topic No. 431, Canceled Debt—Is It Taxable or Not?  
   `https://www.irs.gov/taxtopics/tc431`

10. Taxpayer Advocate Service, “What to Know about Student Loan Forgiveness and Your Taxes,” March 23, 2026.  
    `https://www.taxpayeradvocate.irs.gov/news/tax-tips/what-to-know-about-student-loan-forgiveness-and-your-taxes/2026/03/`

## Technical platform and accessibility

11. SvelteKit documentation, Static site generation / adapter-static.  
    `https://svelte.dev/docs/kit/adapter-static`

12. SvelteKit documentation, Project structure and page options.  
    `https://svelte.dev/docs/kit/project-structure`  
    `https://svelte.dev/docs/kit/page-options`

13. GitHub Docs, GitHub Pages and custom GitHub Actions workflows.  
    `https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages`  
    `https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site`

14. W3C, Web Content Accessibility Guidelines 2.2.  
    `https://www.w3.org/TR/WCAG22/`

# Appendix A. Required plan IDs

```ts
export type PlanId =
  | 'rap'
  | 'tiered_standard'
  | 'standard'
  | 'graduated'
  | 'extended_fixed'
  | 'extended_graduated'
  | 'ibr_10'
  | 'ibr_15'
  | 'paye'
  | 'icr'
  | 'ffel_income_sensitive'
  | 'perkins_standard'
  | 'alternative_informational'
  | 'save_unavailable';
```

# Appendix B. Minimum scenario schema

```ts
export interface BorrowerScenario {
  schemaVersion: 1;
  mode: 'quick' | 'detailed';
  asOfDate: string;
  loans: LoanInput[];
  aggregate?: AggregateLoanInput;
  household: HouseholdInput;
  income: IncomeProjectionInput;
  repaymentHistory: RepaymentHistoryInput;
  pslf: PslfInput;
  tax: ForgivenessTaxInput;
  assumptions: ProjectionAssumptions;
  unknownFields: ScenarioFieldPath[];
}
```

# Appendix C. AGENTS.md minimum content

Codex must create a concise `AGENTS.md` containing at least:

```md
# Project guardrails

- Static SvelteKit + TypeScript only; no backend.
- Do not add analytics, tracking, accounts, runtime APIs, or localStorage borrower data.
- Domain logic must not import Svelte or DOM APIs.
- Every rule must cite a source ID and have tests.
- Unknown is not false and not zero.
- Top-three results include only clearly eligible plans.
- Run: npm run check && npm run lint && npm run test && npm run build.
- Verify BASE_PATH=/student-loan-planner before completion.
- Preserve WCAG 2.2 AA behavior and print output.
```

# Appendix D. Owner actions before launch

1. Create or confirm the public repository `focus-on-the-code/student-loan-planner`.
2. Push the completed code to `main`.
3. In GitHub, select **Settings → Pages → Source: GitHub Actions**.
4. Confirm the deployment workflow succeeds.
5. Select and approve the repository’s open-source license.
6. Review the public-beta disclaimer and official source register.
7. Confirm the Pages URL works on desktop and mobile.

# Appendix E. Codex Cloud environment setup

## E.1 Task 1 environment

Task 1 requires Node and npm package access. The setup may be minimal because the repository may not yet contain a package manifest when the first task starts. Codex must explicitly run the package installation needed to generate the genuine lockfile during the agent phase.

Do not install Playwright browsers in Task 1.

## E.2 Task 2 setup script

Configure this script only after Task 1 has committed `package.json` and `package-lock.json`:

```bash
set -euo pipefail

node --version
npm --version

test -f package.json
test -f package-lock.json

npm ci
npm run check --if-present
npm run test:unit --if-present
```

After confirming browser-download network access, the environment may add:

```bash
npx playwright install --with-deps chromium
```

Browser installation may instead remain an explicit Task 2 command if putting it in setup makes caching or diagnosis less clear.

## E.3 Internet and allowlist requirements

Before starting Task 2:

- enable agent internet access;
- allow npm registry and package-manager hosts through the common-dependencies preset;
- allow the endpoints required by Playwright to download Chromium and operating-system dependencies, or provide unrestricted installation access for this step;
- do not assume npm access proves browser-binary access;
- save the environment and reset its cache.

## E.4 Cache and task lifecycle

Reset the environment cache whenever:

- the setup script changes;
- the Node version changes;
- the lockfile materially changes and the cached environment becomes incompatible;
- internet/allowlist settings change;
- the repository changes from empty/bootstrap state to the real framework state.

After reset, start a new task. Do not rely on a setting changed halfway through an existing task as validation of that task’s environment.

## E.5 Setup success criteria

The Task 2 setup log must show:

- expected Node and npm versions;
- presence of both package files;
- successful `npm ci`;
- successful baseline check;
- successful baseline unit tests, when present.

A failed setup is a stop condition. Codex must diagnose setup before implementing features.

# Appendix F. Task prompts and merge gates

## F.1 Task 1 prompt outline

> Bootstrap this repository only. Create a minimal static SvelteKit + TypeScript project for GitHub Pages, a real npm lockfile, strict checks, proper Svelte/TypeScript linting, one unit smoke test, one accessible page, and a CI workflow that proves `npm ci`, checks, tests, and a Pages-base-path production build. Do not implement the estimator, Playwright, full branding, or deployment yet. Run every required command and include exact results. Do not claim completion unless the bootstrap CI is green.

## F.2 Task 2 prompt outline

> Starting from the verified bootstrap repository and this V2 PRD, implement the full Student Loan Repayment Plan Estimator. Preserve the proven toolchain and lockfile. Work phase by phase, adding tested domain logic before UI. Add Playwright only after the static application builds. Test the built app at the GitHub Pages repository base path. Configure deployment so it can occur only after all required CI checks pass. Include exact command and workflow evidence; never describe an unexecuted check as passed.

## F.3 Owner merge checklist

Before merging either task’s PR, the owner must confirm:

- the PR targets the intended branch;
- the newest commit has completed CI;
- every required job is green rather than skipped;
- the PR summary matches the logs;
- `package-lock.json` was generated by npm and is committed;
- source linting is genuine;
- Task 2 has a working preview or inspected static artifact;
- the Pages-mode base path was tested;
- no merge occurs merely because Copilot or Codex proposed a fix.

## F.4 Stop conditions

Stop and do not merge when:

- Codex cannot install dependencies;
- Playwright cannot download its browser;
- required commands were replaced with visual inspection only;
- CI and deployment disagree because deployment omits failing tests;
- the production build is skipped;
- the generated site has not been opened under its final base path;
- the report says “should pass” rather than showing a passing run.

