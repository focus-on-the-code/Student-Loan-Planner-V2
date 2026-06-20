import { describe, expect, it } from 'vitest';

const productName = 'Student Loan Repayment Plan Estimator';

describe('bootstrap foundation', () => {
  it('exposes the product name used by the initial page', () => {
    expect(productName).toBe('Student Loan Repayment Plan Estimator');
  });
});
