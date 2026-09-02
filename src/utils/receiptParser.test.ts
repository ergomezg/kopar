import { describe, it, expect } from 'vitest';
import { extractAmount, extractDate, parseReceipt } from './receiptParser';

describe('receiptParser (Deterministic Zero-AI)', () => {
  describe('extractAmount', () => {
    it('should parse Colombian standard format with periods', () => {
      expect(extractAmount('Total a pagar: $ 15.000')).toBe(15000);
      expect(extractAmount('Subtotal 1.500.000 COP')).toBe(1500000);
    });

    it('should parse formats with decimals', () => {
      expect(extractAmount('Total: 15.000,50')).toBe(15000.5);
      expect(extractAmount('Total: 15,000.50')).toBe(15000.5);
    });

    it('should parse unformatted numbers', () => {
      expect(extractAmount('Valor: 15000')).toBe(15000);
      expect(extractAmount('1500000')).toBe(1500000);
    });

    it('should return the maximum amount found in the text', () => {
      const text = 'Subtotal: 10.000. Propina: 1.000. Total: 11.000';
      expect(extractAmount(text)).toBe(11000);
    });

    it('should return null if no valid amount found', () => {
      expect(extractAmount('No hay montos aqui solo texto')).toBeNull();
    });
  });

  describe('extractDate', () => {
    it('should parse DD/MM/YYYY format', () => {
      expect(extractDate('Fecha: 25/12/2026')).toBe('2026-12-25');
    });

    it('should parse DD-MM-YYYY format', () => {
      expect(extractDate('Fecha: 01-09-2026')).toBe('2026-09-01');
    });

    it('should parse YYYY-MM-DD format', () => {
      expect(extractDate('2026-09-01')).toBe('2026-09-01');
    });

    it('should return null for invalid dates', () => {
      expect(extractDate('Fecha: 35/15/2026')).toBeNull();
      expect(extractDate('Sin fecha')).toBeNull();
    });
  });

  describe('parseReceipt', () => {
    it('should return high confidence if both amount and date are found', () => {
      const result = parseReceipt('Exito. Fecha: 01/09/2026. Total $ 15.000');
      expect(result.amount).toBe(15000);
      expect(result.date).toBe('2026-09-01');
      expect(result.confidence).toBe('alta');
    });

    it('should return media confidence if only one is found', () => {
      const result = parseReceipt('Solo dice Total $ 15.000');
      expect(result.amount).toBe(15000);
      expect(result.date).toBeNull();
      expect(result.confidence).toBe('media');
    });
  });
});
