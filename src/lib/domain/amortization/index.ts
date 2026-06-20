import { cents, type Cents, type Percentage } from '$lib/domain/types';
import { monthlyRateFromAnnualPercentage } from '$lib/domain/money';

export interface AmortizationMonth {
  readonly month: number;
  readonly startingBalanceCents: Cents;
  readonly scheduledPaymentCents: Cents;
  readonly interestCents: Cents;
  readonly principalCents: Cents;
  readonly endingBalanceCents: Cents;
}

export interface AmortizationSchedule {
  readonly monthlyPaymentCents: Cents;
  readonly months: readonly AmortizationMonth[];
  readonly totalPaidCents: Cents;
  readonly totalInterestCents: Cents;
  readonly paidOff: boolean;
}

export const calculateFixedMonthlyPaymentCents = (
  principalCents: Cents,
  annualInterestRate: Percentage,
  termMonths: number
): Cents => {
  if (principalCents <= 0) {
    return cents(0);
  }

  if (!Number.isInteger(termMonths) || termMonths <= 0) {
    throw new Error('Term months must be a positive integer.');
  }

  const monthlyRate = monthlyRateFromAnnualPercentage(annualInterestRate);

  if (monthlyRate === 0) {
    return cents(Math.ceil(principalCents / termMonths));
  }

  const payment =
    (principalCents * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -termMonths));
  return cents(Math.ceil(payment));
};

export const buildFixedAmortizationSchedule = (
  principalCents: Cents,
  annualInterestRate: Percentage,
  termMonths: number,
  monthlyPaymentCents = calculateFixedMonthlyPaymentCents(
    principalCents,
    annualInterestRate,
    termMonths
  )
): AmortizationSchedule => {
  let balance = principalCents;
  let totalPaid = 0;
  let totalInterest = 0;
  const monthlyRate = monthlyRateFromAnnualPercentage(annualInterestRate);
  const months: AmortizationMonth[] = [];

  for (let month = 1; month <= termMonths && balance > 0; month += 1) {
    const startingBalance = balance;
    const interest = cents(Math.round(startingBalance * monthlyRate));
    const amountDue = cents(startingBalance + interest);
    const scheduledPayment = cents(Math.min(monthlyPaymentCents, amountDue));
    const principal = cents(Math.max(0, scheduledPayment - interest));
    balance = cents(Math.max(0, amountDue - scheduledPayment));
    totalPaid += scheduledPayment;
    totalInterest += interest;

    months.push({
      month,
      startingBalanceCents: cents(startingBalance),
      scheduledPaymentCents: scheduledPayment,
      interestCents: interest,
      principalCents: principal,
      endingBalanceCents: balance
    });
  }

  return {
    monthlyPaymentCents,
    months,
    totalPaidCents: cents(totalPaid),
    totalInterestCents: cents(totalInterest),
    paidOff: balance === 0
  };
};
