import { describe, it, expect } from 'vitest';
import { analyzeBudgetHealth } from './budgetInsights';
import { Category, Expense } from '../types';

describe('budgetInsights (Deterministic Zero-AI)', () => {
  const categories: Category[] = [
    {
      id: 'cat_fijos',
      name: 'Fijos',
      color: '#000',
      budgetLimit: 1000000,
      subcategories: []
    }
  ];

  it('should calculate budget correctly when under limit', () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        title: 'Arriendo',
        amount: 800000,
        categoryId: 'cat_fijos',
        date: '2026-08-30',
        paidById: 'user1',
        status: 'PAGADO',
        splits: [],
        createdAt: '2026-08-30'
      }
    ];

    const result = analyzeBudgetHealth(categories, expenses, '$');
    expect(result.totalBudget).toBe(1000000);
    expect(result.totalSpent).toBe(800000);
    expect(result.overallExecutionPct).toBe(80);
    // Should have a warning insight if >= 80% (assuming the logic returns warnings at 80%)
    const hasWarning = result.insights.some(i => i.type === 'warning');
    expect(hasWarning).toBe(true);
  });

  it('should flag danger when over limit', () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        title: 'Arriendo',
        amount: 1200000,
        categoryId: 'cat_fijos',
        date: '2026-08-30',
        paidById: 'user1',
        status: 'PAGADO',
        splits: [],
        createdAt: '2026-08-30'
      }
    ];

    const result = analyzeBudgetHealth(categories, expenses, '$');
    expect(result.totalSpent).toBe(1200000);
    expect(result.overallExecutionPct).toBe(120);
    const hasDanger = result.insights.some(i => i.type === 'danger');
    expect(hasDanger).toBe(true);
  });
});
