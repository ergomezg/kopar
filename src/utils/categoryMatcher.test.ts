import { describe, it, expect } from 'vitest';
import { matchCategoryFromTitle, normalizeText } from './categoryMatcher';

describe('categoryMatcher (Deterministic Zero-AI)', () => {
  describe('normalizeText', () => {
    it('should lowercase and remove accents', () => {
      expect(normalizeText('Ráppí hamburguesas!')).toBe('rappi hamburguesas');
    });
    it('should remove special characters', () => {
      expect(normalizeText('Mercado @ Éxito #123')).toBe('mercado exito 123');
    });
  });

  describe('matchCategoryFromTitle', () => {
    it('should match exact keywords with high confidence', () => {
      const match = matchCategoryFromTitle('Rappi');
      expect(match).not.toBeNull();
      expect(match?.categoryId).toBe('cat_ocasionales');
      expect(match?.subcategory).toBe('Domicilios comida');
      expect(match?.confidence).toBeGreaterThan(0.9);
    });

    it('should match partial phrases', () => {
      const match = matchCategoryFromTitle('Mercado mensual en el Exito');
      expect(match).not.toBeNull();
      expect(match?.categoryId).toBe('cat_fijos');
      expect(match?.subcategory).toBe('Mercado principal');
    });

    it('should return null for unmatched or very short titles', () => {
      expect(matchCategoryFromTitle('')).toBeNull();
      expect(matchCategoryFromTitle('a')).toBeNull();
      expect(matchCategoryFromTitle('unknown string that does not match anything')).toBeNull();
    });
  });
});
