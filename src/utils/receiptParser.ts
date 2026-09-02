/**
 * Deterministic Receipt Parser — KOPAR (Zero-AI)
 * Uses strict Regex to extract amounts and dates from raw OCR text.
 * Optimized for Colombian formats (e.g., $ 15.000, DD/MM/YYYY).
 */

export interface ParsedReceipt {
  amount: number | null;
  date: string | null;
  confidence: 'alta' | 'media' | 'baja';
}

/**
 * Extracts the highest currency amount from a raw text.
 * Assumes Colombian format (periods for thousands, optional comma for decimals) 
 * e.g., $15.000, $ 150.000,00, 15000
 */
export function extractAmount(text: string): number | null {
  // Regex to find numbers that look like prices. 
  // Matches: $15.000, 15.000,00, 15000, $ 15,000.00
  const amountRegex = /(?:[\$]?\s*)(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/g;
  const matches = [...text.matchAll(amountRegex)];
  
  if (matches.length === 0) return null;

  let maxAmount = 0;

  matches.forEach(match => {
    let cleanStr = match[1];
    
    if (cleanStr.includes('.') && cleanStr.includes(',')) {
      const lastDot = cleanStr.lastIndexOf('.');
      const lastComma = cleanStr.lastIndexOf(',');
      if (lastComma > lastDot) {
        // comma is decimal: 15.000,50 -> 15000.50
        cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
      } else {
        // dot is decimal: 15,000.50 -> 15000.50
        cleanStr = cleanStr.replace(/,/g, '');
      }
    } else if (cleanStr.includes(',')) {
      if (/,(\d{3})(?:[^\d]|$)/.test(cleanStr)) {
        cleanStr = cleanStr.replace(/,/g, ''); // 15,000 -> 15000
      } else {
        cleanStr = cleanStr.replace(',', '.'); // 15,50 -> 15.50
      }
    } else if (cleanStr.includes('.')) {
       const parts = cleanStr.split('.');
       // If multiple dots (1.500.000) or exactly 3 digits after the single dot (15.000)
       if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
         cleanStr = cleanStr.replace(/\./g, '');
       }
    }

    const val = parseFloat(cleanStr);
    if (!isNaN(val) && val > maxAmount) {
      maxAmount = val;
    }
  });

  return maxAmount > 0 ? maxAmount : null;
}

/**
 * Extracts a date from raw text and formats it to YYYY-MM-DD
 */
export function extractDate(text: string): string | null {
  // Matches DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD, YYYY-MM-DD
  const dateRegex = /\b(\d{2})[\/\-](\d{2})[\/\-](\d{4})\b|\b(\d{4})[\/\-](\d{2})[\/\-](\d{2})\b/g;
  const matches = [...text.matchAll(dateRegex)];
  
  if (matches.length === 0) return null;
  
  // Take the first matching date
  const match = matches[0];
  
  let year, month, day;
  if (match[1]) {
    // DD/MM/YYYY format
    day = match[1];
    month = match[2];
    year = match[3];
  } else {
    // YYYY/MM/DD format
    year = match[4];
    month = match[5];
    day = match[6];
  }

  // Basic validation
  if (parseInt(month) > 12 || parseInt(day) > 31) return null;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Parses raw receipt text into structured data.
 */
export function parseReceipt(rawText: string): ParsedReceipt {
  if (!rawText) return { amount: null, date: null, confidence: 'baja' };

  const amount = extractAmount(rawText);
  const date = extractDate(rawText);

  let confidence: 'alta' | 'media' | 'baja' = 'baja';
  
  if (amount !== null && date !== null) {
    confidence = 'alta';
  } else if (amount !== null || date !== null) {
    confidence = 'media';
  }

  return {
    amount,
    date,
    confidence
  };
}
