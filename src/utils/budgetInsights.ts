/**
 * Deterministic Financial Insights Engine — KOPAR (Zero-AI)
 * Evaluates budget distribution, spending velocity, threshold alarms and 50/30/20 proportions.
 */

import { Category, Expense } from '../types';
import { formatAmount } from './format';

export interface BudgetInsight {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  categoryId?: string;
  metric?: string;
}

export interface BudgetHealthReport {
  totalBudget: number;
  totalSpent: number;
  overallExecutionPct: number;
  remainingAmount: number;
  isOverspent: boolean;
  overspentAmount: number;
  categorySpending: Record<string, { spent: number; limit: number; pct: number }>;
  insights: BudgetInsight[];
}

export function analyzeBudgetHealth(
  categories: Category[],
  expenses: Expense[],
  currency: string
): BudgetHealthReport {
  // 1. Calculate spending per category
  const categorySpending: Record<string, { spent: number; limit: number; pct: number }> = {};
  categories.forEach((cat) => {
    categorySpending[cat.id] = { spent: 0, limit: cat.budgetLimit, pct: 0 };
  });

  expenses.forEach((e) => {
    if (categorySpending[e.categoryId]) {
      categorySpending[e.categoryId].spent += e.amount;
    }
  });

  Object.keys(categorySpending).forEach((catId) => {
    const item = categorySpending[catId];
    item.pct = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
  });

  const totalBudget = categories.reduce((sum, c) => sum + c.budgetLimit, 0);
  const totalSpent = Object.values(categorySpending).reduce((sum, item) => sum + item.spent, 0);
  const overallExecutionPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const remainingAmount = Math.max(0, totalBudget - totalSpent);
  const isOverspent = totalSpent > totalBudget;
  const overspentAmount = Math.max(0, totalSpent - totalBudget);

  const insights: BudgetInsight[] = [];

  // Insight 1: Global Overspend or High Execution
  if (isOverspent) {
    insights.push({
      id: 'global-overspent',
      type: 'danger',
      title: 'Presupuesto total excedido',
      message: `El gasto acumulado supera el límite total del hogar por ${formatAmount(overspentAmount, currency)} (${overallExecutionPct.toFixed(0)}% ejecutado).`,
      metric: `+${formatAmount(overspentAmount, currency)}`,
    });
  } else if (overallExecutionPct >= 85) {
    insights.push({
      id: 'global-near-limit',
      type: 'warning',
      title: 'Consumo elevado del presupuesto',
      message: `Han ejecutado el ${overallExecutionPct.toFixed(0)}% del presupuesto mensual. Quedan ${formatAmount(remainingAmount, currency)} disponibles.`,
      metric: `${overallExecutionPct.toFixed(0)}%`,
    });
  } else if (overallExecutionPct > 0 && overallExecutionPct < 50) {
    insights.push({
      id: 'global-healthy',
      type: 'success',
      title: 'Presupuesto en equilibrio saludable',
      message: `Han consumido el ${overallExecutionPct.toFixed(0)}% del límite total. Cuentan con un margen holgado para el resto del periodo.`,
      metric: `${overallExecutionPct.toFixed(0)}%`,
    });
  }

  // Insight 2: Category specific alarms (>100% or >80%)
  categories.forEach((cat) => {
    const spendData = categorySpending[cat.id];
    if (!spendData || spendData.limit <= 0) return;

    if (spendData.spent > spendData.limit) {
      const diff = spendData.spent - spendData.limit;
      insights.push({
        id: `cat-exceeded-${cat.id}`,
        type: 'danger',
        title: `Límite superado en ${cat.name}`,
        message: `Excedido por ${formatAmount(diff, currency)} (${spendData.pct.toFixed(0)}% del tope asignado).`,
        categoryId: cat.id,
        metric: `${spendData.pct.toFixed(0)}%`,
      });
    } else if (spendData.pct >= 80) {
      const available = spendData.limit - spendData.spent;
      insights.push({
        id: `cat-warning-${cat.id}`,
        type: 'warning',
        title: `Atención en ${cat.name}`,
        message: `Quedan únicamente ${formatAmount(available, currency)} antes de alcanzar el tope asignado.`,
        categoryId: cat.id,
        metric: `${spendData.pct.toFixed(0)}%`,
      });
    }
  });

  // Insight 3: Proportional distribution check (Gastos fijos vs discrecionales)
  const fixedSpent = categorySpending['cat_fijos']?.spent || 0;
  if (totalSpent > 0) {
    const fixedRatio = (fixedSpent / totalSpent) * 100;
    if (fixedRatio > 75) {
      insights.push({
        id: 'high-fixed-ratio',
        type: 'info',
        title: 'Alta concentración en gastos esenciales',
        message: `El ${fixedRatio.toFixed(0)}% del gasto actual corresponde a Gastos Fijos (vivienda, servicios y mercado).`,
        metric: `${fixedRatio.toFixed(0)}%`,
      });
    }
  }

  return {
    totalBudget,
    totalSpent,
    overallExecutionPct,
    remainingAmount,
    isOverspent,
    overspentAmount,
    categorySpending,
    insights,
  };
}
