import { describe, it, expect } from 'vitest';
import { detectPotentialDuplicates } from './duplicateDetector';
import { Expense } from '../types';

describe('duplicateDetector (Deterministic Zero-AI)', () => {
  const existingExpenses: Expense[] = [
    {
      id: 'exp1',
      title: 'Mercado Carulla',
      amount: 150000,
      categoryId: 'cat_fijos',
      date: '2026-08-30T10:00:00.000Z',
      paidById: 'user1',
      status: 'PAGADO',
      splits: [],
      createdAt: '2026-08-30'
    }
  ];

  it('should detect exact duplicates within the 2-day window', () => {
    const candidate = {
      title: 'Mercado carulla',
      amount: 150000,
      categoryId: 'cat_fijos',
      date: '2026-08-31T15:00:00.000Z',
      paidById: 'user1'
    };

    const matches = detectPotentialDuplicates(candidate, existingExpenses);
    expect(matches.length).toBe(1);
    expect(matches[0].confidence).toBe('alta');
  });

  it('should ignore similar expenses if amount is different', () => {
    const candidate = {
      title: 'Mercado Carulla',
      amount: 200000, // Different amount
      categoryId: 'cat_fijos',
      date: '2026-08-31T15:00:00.000Z',
      paidById: 'user1'
    };

    const matches = detectPotentialDuplicates(candidate, existingExpenses);
    expect(matches.length).toBe(0);
  });

  it('should ignore exact amounts if date is more than 2 days apart', () => {
    const candidate = {
      title: 'Mercado Carulla',
      amount: 150000,
      categoryId: 'cat_fijos',
      date: '2026-09-05T15:00:00.000Z', // > 2 days
      paidById: 'user1'
    };

    const matches = detectPotentialDuplicates(candidate, existingExpenses);
    expect(matches.length).toBe(0);
  });
});
