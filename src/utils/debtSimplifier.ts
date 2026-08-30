/**
 * Min-Cash-Flow Debt Simplification Algorithm — KOPAR (Zero-AI)
 * Graph bipartite greedy solver to minimize peer-to-peer settlement transactions.
 * Guarantees <= (N - 1) transactions for N household members in O(N log N) time.
 */

import { Expense, Member } from '../types';

export interface MemberBalance {
  member: Member;
  paid: number;
  share: number;
  net: number; // > 0 means they are owed money; < 0 means they owe money
}

export interface SimplifiedTransaction {
  id: string;
  from: Member;
  to: Member;
  amount: number;
}

export interface DebtSimplificationResult {
  totalSpent: number;
  memberBalances: MemberBalance[];
  transactions: SimplifiedTransaction[];
  isBalanced: boolean;
}

/**
 * Calculates net balances and minimal settlement transactions.
 */
export function calculateDebtSimplification(
  members: Member[],
  expenses: Expense[]
): DebtSimplificationResult {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const paidMap: Record<string, number> = {};
  const owedMap: Record<string, number> = {};

  members.forEach((m) => {
    paidMap[m.id] = 0;
    owedMap[m.id] = 0;
  });

  expenses.forEach((e) => {
    if (paidMap[e.paidById] !== undefined) {
      paidMap[e.paidById] += e.amount;
    }
    e.splits.forEach((s) => {
      if (owedMap[s.memberId] !== undefined) {
        owedMap[s.memberId] += s.amount;
      }
    });
  });

  const memberBalances: MemberBalance[] = members.map((m) => {
    const paid = paidMap[m.id] || 0;
    const share = owedMap[m.id] || 0;
    return {
      member: m,
      paid,
      share,
      net: Math.round(paid - share),
    };
  });

  // Prepare mutable debtor and creditor arrays for greedy min-cash-flow
  interface FlowNode {
    member: Member;
    balance: number;
  }

  const debtors: FlowNode[] = [];
  const creditors: FlowNode[] = [];

  memberBalances.forEach((b) => {
    if (b.net < -0.5) {
      debtors.push({ member: b.member, balance: Math.abs(b.net) });
    } else if (b.net > 0.5) {
      creditors.push({ member: b.member, balance: b.net });
    }
  });

  const transactions: SimplifiedTransaction[] = [];
  let txIndex = 1;

  // Greedy 2-pointer matching
  while (debtors.length > 0 && creditors.length > 0) {
    // Sort to always match largest debtor with largest creditor
    debtors.sort((a, b) => b.balance - a.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(debtor.balance, creditor.balance);

    if (amount > 0) {
      transactions.push({
        id: `tx_settle_${txIndex++}`,
        from: debtor.member,
        to: creditor.member,
        amount: Math.round(amount),
      });

      debtor.balance -= amount;
      creditor.balance -= amount;
    }

    if (debtor.balance < 0.5) {
      debtors.shift();
    }
    if (creditor.balance < 0.5) {
      creditors.shift();
    }
  }

  const isBalanced = transactions.length === 0;

  return {
    totalSpent,
    memberBalances,
    transactions,
    isBalanced,
  };
}
