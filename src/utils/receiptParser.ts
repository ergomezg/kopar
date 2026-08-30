/**
 * Deterministic Receipt & Banking Notification Parser — KOPAR (Zero-AI)
 * Parses SMS, push notifications and clipboard text from Bancolombia, Nequi, Daviplata, PSE, etc.
 * Operates 100% locally with zero latency, zero cloud calls and strict data privacy.
 */

import { matchCategoryFromTitle, MatchResult } from './categoryMatcher';

export interface ParsedReceipt {
  amount?: number;
  title?: string;
  date?: string; // YYYY-MM-DD
  categoryId?: string;
  subcategory?: string;
  sourceType?: 'Bancolombia' | 'Nequi' | 'Daviplata' | 'PSE' | 'Transfiya' | 'Genérico';
  rawText: string;
}

/**
 * Cleans monetary string into an integer number.
 * e.g. "$ 120.000,00" -> 120000
 * e.g. "45000.50" -> 45001
 */
export function cleanMonetaryAmount(raw: string): number | undefined {
  if (!raw) return undefined;
  let clean = raw.replace(/[^\d.,]/g, '').trim();

  // If format is like 120.000,00 (Colombian/European)
  if (clean.includes('.') && clean.includes(',')) {
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else if (clean.includes('.')) {
    const parts = clean.split('.');
    // If dot represents thousands (e.g. 120.000)
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      clean = clean.replace(/\./g, '');
    }
  } else if (clean.includes(',')) {
    const parts = clean.split(',');
    // If comma represents thousands (e.g. 120,000)
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      clean = clean.replace(/,/g, '');
    } else {
      clean = clean.replace(',', '.');
    }
  }

  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed <= 0 ? undefined : Math.round(parsed);
}

/**
 * Normalizes date string into YYYY-MM-DD.
 */
function normalizeDate(rawDate: string): string | undefined {
  if (!rawDate) return undefined;

  // DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = rawDate.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, '0');
    const month = ddmmyyyy[2].padStart(2, '0');
    let year = ddmmyyyy[3];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }

  // YYYY-MM-DD
  const yyyymmdd = rawDate.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (yyyymmdd) {
    const year = yyyymmdd[1];
    const month = yyyymmdd[2].padStart(2, '0');
    const day = yyyymmdd[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return undefined;
}

/**
 * Parses raw text from banking notification or text clipboard receipt.
 */
export function parseReceiptText(text: string): ParsedReceipt | null {
  if (!text || text.trim().length < 5) return null;

  const raw = text.trim();
  let amount: number | undefined;
  let title: string | undefined;
  let date: string | undefined;
  let sourceType: ParsedReceipt['sourceType'] = 'Genérico';

  // 1. Identify Bank Notification Type
  if (/bancolombia/i.test(raw)) {
    sourceType = 'Bancolombia';
  } else if (/nequi/i.test(raw)) {
    sourceType = 'Nequi';
  } else if (/daviplata/i.test(raw)) {
    sourceType = 'Daviplata';
  } else if (/pse/i.test(raw)) {
    sourceType = 'PSE';
  } else if (/transfiya/i.test(raw)) {
    sourceType = 'Transfiya';
  }

  // 2. Extract Amount
  // Matches: "por $120.000", "valor $ 50.000", "$45.000", "COP 80,000", "total: $90.000"
  const amountRegexes = [
    /(?:por|valor|total|monto|monto de|pago de)\s*[:\$]?\s*(?:COP)?\s*([\d\.\,]{3,12})/i,
    /\$\s*([\d\.\,]{3,12})/i,
    /(?:COP)\s*([\d\.\,]{3,12})/i,
  ];

  for (const regex of amountRegexes) {
    const match = raw.match(regex);
    if (match && match[1]) {
      const cleaned = cleanMonetaryAmount(match[1]);
      if (cleaned && cleaned > 100) {
        amount = cleaned;
        break;
      }
    }
  }

  // 3. Extract Date
  const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/;
  const dateMatch = raw.match(dateRegex);
  if (dateMatch && dateMatch[1]) {
    date = normalizeDate(dateMatch[1]);
  } else {
    date = new Date().toISOString().split('T')[0];
  }

  // 4. Extract Merchant / Concept Description
  const merchantPatterns = [
    /(?:en|hacia|para|a el comercio|a)\s+([A-Za-z0-9\s&ÁÉÍÓÚáéíóúÑñ\.\-]{3,35})(?:\s+el|\s+por|\s+fecha|\s+tarjeta|\s+hora|\s+cta|\s+\$|\.|$)/i,
    /(?:compra en|pago en)\s+([A-Za-z0-9\s&ÁÉÍÓÚáéíóúÑñ\.\-]{3,35})/i,
  ];

  for (const pattern of merchantPatterns) {
    const match = raw.match(pattern);
    if (match && match[1]) {
      const candidateTitle = match[1].trim();
      // Avoid capturing auxiliary words like "tu cuenta", "la tarjeta", etc.
      if (!/^(tu|su|cuenta|tarjeta|banco|ahorros|corriente)$/i.test(candidateTitle)) {
        title = candidateTitle;
        break;
      }
    }
  }

  // Fallback title from first line if not matched
  if (!title) {
    const firstLine = raw.split('\n')[0].replace(/[\$\d\.,]/g, '').trim();
    if (firstLine.length >= 3) {
      title = firstLine.slice(0, 40);
    } else {
      title = 'Gasto registrado';
    }
  }

  // 5. Match Category Deterministically
  const matchCat = matchCategoryFromTitle(title || raw);

  return {
    amount,
    title: title ? title.charAt(0).toUpperCase() + title.slice(1) : undefined,
    date: date || new Date().toISOString().split('T')[0],
    categoryId: matchCat?.categoryId,
    subcategory: matchCat?.subcategory,
    sourceType,
    rawText: raw,
  };
}
