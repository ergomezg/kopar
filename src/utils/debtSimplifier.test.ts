import { describe, it, expect } from 'vitest';
import { calculateDebtSimplification } from './debtSimplifier';
import { Expense, Member } from '../types';

describe('debtSimplifier (Min-Cash-Flow)', () => {
  const members: Member[] = [
    { id: 'm1', name: 'Alice', email: 'alice@test.com', avatar: '', role: 'admin', status: 'active' },
    { id: 'm2', name: 'Bob', email: 'bob@test.com', avatar: '', role: 'member', status: 'active' },
    { id: 'm3', name: 'Charlie', email: 'charlie@test.com', avatar: '', role: 'member', status: 'active' },
  ];

  it('should calculate zero transactions when everyone paid their exact share', () => {
    const expenses: Expense[] = [
      {
        id: 'e1', title: 'Test', amount: 300, categoryId: 'cat', date: '2026-09-01', paidById: 'm1', status: 'PAGADO', createdAt: '2026-09-01',
        splits: [
          { memberId: 'm1', amount: 100, percentage: 33.3 },
          { memberId: 'm2', amount: 100, percentage: 33.3 },
          { memberId: 'm3', amount: 100, percentage: 33.3 },
        ]
      },
      {
        id: 'e2', title: 'Test 2', amount: 300, categoryId: 'cat', date: '2026-09-01', paidById: 'm2', status: 'PAGADO', createdAt: '2026-09-01',
        splits: [
          { memberId: 'm1', amount: 100, percentage: 33.3 },
          { memberId: 'm2', amount: 100, percentage: 33.3 },
          { memberId: 'm3', amount: 100, percentage: 33.3 },
        ]
      },
      {
        id: 'e3', title: 'Test 3', amount: 300, categoryId: 'cat', date: '2026-09-01', paidById: 'm3', status: 'PAGADO', createdAt: '2026-09-01',
        splits: [
          { memberId: 'm1', amount: 100, percentage: 33.3 },
          { memberId: 'm2', amount: 100, percentage: 33.3 },
          { memberId: 'm3', amount: 100, percentage: 33.3 },
        ]
      }
    ];

    const result = calculateDebtSimplification(members, expenses);
    expect(result.transactions.length).toBe(0);
    expect(result.isBalanced).toBe(true);
  });

  it('should simplify complex debts', () => {
    // Alice pays 300 (100 each)
    // Bob pays 150 (50 each)
    // Charlie pays 0
    // Net: 
    // Alice paid 300, share 150 -> Net +150 (Owed 150)
    // Bob paid 150, share 150 -> Net 0
    // Charlie paid 0, share 150 -> Net -150 (Owes 150)
    
    // Expected: 1 transaction (Charlie -> Alice 150)
    const expenses: Expense[] = [
      {
        id: 'e1', title: 'Test', amount: 300, categoryId: 'cat', date: '2026-09-01', paidById: 'm1', status: 'PAGADO', createdAt: '2026-09-01',
        splits: [
          { memberId: 'm1', amount: 100, percentage: 33.3 },
          { memberId: 'm2', amount: 100, percentage: 33.3 },
          { memberId: 'm3', amount: 100, percentage: 33.3 },
        ]
      },
      {
        id: 'e2', title: 'Test 2', amount: 150, categoryId: 'cat', date: '2026-09-01', paidById: 'm2', status: 'PAGADO', createdAt: '2026-09-01',
        splits: [
          { memberId: 'm1', amount: 50, percentage: 33.3 },
          { memberId: 'm2', amount: 50, percentage: 33.3 },
          { memberId: 'm3', amount: 50, percentage: 33.3 },
        ]
      }
    ];

    const result = calculateDebtSimplification(members, expenses);
    expect(result.isBalanced).toBe(false);
    expect(result.transactions.length).toBe(1);
    
    const tx = result.transactions[0];
    expect(tx.from.id).toBe('m3'); // Charlie
    expect(tx.to.id).toBe('m1');   // Alice
    expect(tx.amount).toBe(150);
  });
});
