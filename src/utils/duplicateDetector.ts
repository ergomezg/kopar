/**
 * Deterministic Duplicate Detector — KOPAR (Zero-AI)
 * Heuristic identification of duplicate financial transactions based on amount, date window and text similarity.
 */

import { Expense } from '../types';
import { normalizeText } from './categoryMatcher';

export interface DuplicateMatch {
  expense: Expense;
  reason: string;
  confidence: 'alta' | 'media';
}

/**
 * Calculates Jaccard token similarity between two strings.
 */
function tokenSimilarity(strA: string, strB: string): number {
  const normA = normalizeText(strA).split(' ').filter(Boolean);
  const normB = normalizeText(strB).split(' ').filter(Boolean);

  if (normA.length === 0 || normB.length === 0) return 0;

  const setA = new Set(normA);
  const setB = new Set(normB);

  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection++;
  });

  const union = new Set([...normA, ...normB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Calculates day difference between two YYYY-MM-DD or ISO dates.
 */
function getDaysDifference(dateStrA: string, dateStrB: string): number {
  const dateA = new Date(dateStrA.split('T')[0]).getTime();
  const dateB = new Date(dateStrB.split('T')[0]).getTime();
  if (isNaN(dateA) || isNaN(dateB)) return 999;
  return Math.abs(dateA - dateB) / (1000 * 60 * 60 * 24);
}

/**
 * Checks for potential duplicate transactions in the household.
 * Runs in O(N) in < 1ms on the client.
 */
export function detectPotentialDuplicates(
  candidate: {
    title: string;
    amount: number;
    categoryId: string;
    date: string;
    paidById?: string;
    id?: string;
  },
  existingExpenses: Expense[]
): DuplicateMatch[] {
  if (!candidate.title || candidate.amount <= 0 || !candidate.date) return [];

  const matches: DuplicateMatch[] = [];

  for (const exp of existingExpenses) {
    // Skip if comparing against itself during edit
    if (candidate.id && exp.id === candidate.id) continue;

    const amountDiff = Math.abs(exp.amount - candidate.amount);
    const dayDiff = getDaysDifference(exp.date, candidate.date);
    const titleSim = tokenSimilarity(candidate.title, exp.title);

    // 1. High Confidence: Same amount + date within 2 days + similar title (>0.4) or same category
    if (amountDiff === 0 && dayDiff <= 2) {
      if (titleSim >= 0.5) {
        matches.push({
          expense: exp,
          reason: `Mismo valor exacto y descripción similar registrado hace ${Math.round(dayDiff)} día(s).`,
          confidence: 'alta',
        });
      } else if (exp.categoryId === candidate.categoryId && dayDiff <= 1) {
        matches.push({
          expense: exp,
          reason: `Mismo valor exacto en la misma categoría en fechas casi idénticas (${exp.date}).`,
          confidence: 'media',
        });
      }
    }
  }

  return matches;
}
