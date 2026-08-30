/**
 * Deterministic Category Matcher — KOPAR (Zero-AI)
 * Fast, offline-first keyword and merchant classification engine.
 */

interface MatchRule {
  keywords: string[];
  categoryId: string;
  subcategory?: string;
  weight?: number;
}

const CATEGORY_RULES: MatchRule[] = [
  // 1. GASTOS FIJOS (cat_fijos)
  {
    categoryId: 'cat_fijos',
    subcategory: 'Arriendo / Hipoteca',
    keywords: ['arriendo', 'alquiler', 'hipoteca', 'canon', 'renta apartamento', 'renta casa', 'administracion edificio', 'cuota administracion'],
    weight: 10,
  },
  {
    categoryId: 'cat_fijos',
    subcategory: 'Servicios públicos',
    keywords: ['epm', 'enel', 'codensa', 'acueducto', 'vanti', 'gas natural', 'recibo luz', 'recibo agua', 'recibo gas', 'servicios publicos', 'energia', 'alcantarillado', 'aseo'],
    weight: 9,
  },
  {
    categoryId: 'cat_fijos',
    subcategory: 'Mercado principal',
    keywords: ['exito', 'jumbo', 'carulla', 'd1', 'tiendas d1', 'tiendas ara', 'ara', 'olimpica', 'euro', 'superinter', 'mercado', 'supermercado', 'frutas y verduras', 'carniceria', 'plaza mercado', 'mercado quincenal', 'mercado mensual', 'mercado semanal', 'surtifruver'],
    weight: 8,
  },
  {
    categoryId: 'cat_fijos',
    subcategory: 'Internet hogar',
    keywords: ['claro', 'tigo', 'movistar', 'etb', 'fibra optica', 'internet hogar', 'wifi hogar', 'wom hogar'],
    weight: 8,
  },
  {
    categoryId: 'cat_fijos',
    subcategory: 'Transporte diario',
    keywords: ['gasolina', 'combustible', 'peaje', 'transmilenio', 'metro', 'sitp', 'recarga tarjeta', 'parqueadero mensual', 'tarifa transporte'],
    weight: 7,
  },
  {
    categoryId: 'cat_fijos',
    subcategory: 'Seguro hogar',
    keywords: ['seguro hogar', 'poliza hogar', 'seguro arrendamiento', 'seguro todo riesgo', 'sura hogar', 'bolivar seguro'],
    weight: 8,
  },

  // 2. GASTOS RECURRENTES (cat_recurrentes)
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Streaming video',
    keywords: ['netflix', 'hbo', 'max', 'disney', 'disney+', 'prime video', 'amazon prime', 'apple tv', 'youtube premium', 'crunchyroll', 'paramount+'],
    weight: 10,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Streaming música',
    keywords: ['spotify', 'apple music', 'deezer', 'tidal', 'amazon music', 'youtube music'],
    weight: 10,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Membresía gimnasio',
    keywords: ['smart fit', 'bodytech', 'spinning center', 'gimnasio', 'gym', 'crossfit', 'pilates', 'yoga mensualidad'],
    weight: 9,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Almacenamiento nube',
    keywords: ['icloud', 'google one', 'dropbox', 'onedrive', 'google drive', 'cloud storage'],
    weight: 9,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Plan celular',
    keywords: ['plan celular', 'pospago', 'factura celular', 'datos moviles', 'linea claro', 'linea movistar', 'linea tigo', 'linea wom'],
    weight: 8,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Suscripción software',
    keywords: ['chatgpt', 'openai', 'notion', 'figma', 'canva', 'adobe', 'midjourney', 'cursor', 'github', 'jetbrains', 'slack pro', 'zoom'],
    weight: 9,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Paseador mascotas',
    keywords: ['paseador', 'paseo perro', 'guarderia canina', 'guarderia mascotas', 'bano perro', 'peluqueria canina'],
    weight: 8,
  },
  {
    categoryId: 'cat_recurrentes',
    subcategory: 'Cafetería frecuente',
    keywords: ['juan valdez', 'starbucks', 'tostao', 'cafe frecuente', 'capsulas nespresso', 'cafe especial'],
    weight: 6,
  },

  // 3. GASTOS OCASIONALES (cat_ocasionales)
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Cena restaurante',
    keywords: ['restaurante', 'cena', 'almuerzo fuera', 'crepes', 'crepes & waffles', 'waffles', 'el corral', 'mcdonalds', 'burgers', 'pizza', 'sushi', 'wok', 'archies', 'la lucha', 'il forno'],
    weight: 8,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Domicilios comida',
    keywords: ['rappi', 'didi food', 'domicilios com', 'domicilio restaurante', 'pedidosya', 'uber eats'],
    weight: 9,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Salida bar',
    keywords: ['bar', 'cerveza', 'cervezas', 'coctel', 'cocteles', 'pub', 'discoteca', 'rumba', 'licorera', 'tragos', 'bbc', 'bogota beer company'],
    weight: 8,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Cine / Conciertos',
    keywords: ['cine', 'cinecolombia', 'cinemark', 'procinal', 'cinepolis', 'concierto', 'tuboleta', 'eticket', 'entradas concierto', 'teatro', 'show', 'evento'],
    weight: 9,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Viajes vacaciones',
    keywords: ['vuelo', 'tiquetes', 'avianca', 'latam', 'wingo', 'copa airlines', 'hotel', 'airbnb', 'booking', 'hospedaje', 'tour', 'vacaciones', 'viaje'],
    weight: 9,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Ropa / Calzado',
    keywords: ['zara', 'h&m', 'falabella', 'mango', 'bershka', 'pull&bear', 'stradivarius', 'nike', 'adidas', 'puma', 'arturo calle', 'geff', 'ropa', 'zapatos', 'tenis', 'camisa', 'pantalon'],
    weight: 7,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Decoración hogar',
    keywords: ['ikea', 'homecenter', 'easy', 'tugo', 'decoracion', 'muebles', 'lampara', 'cojines', 'cuadros', 'sabanas', 'toallas', 'menaje'],
    weight: 8,
  },
  {
    categoryId: 'cat_ocasionales',
    subcategory: 'Regalos celebraciones',
    keywords: ['regalo', 'cumpleanos', 'aniversario', 'navidad', 'detalle', 'flores', 'chocolates'],
    weight: 7,
  },

  // 4. GASTOS IMPREVISTOS (cat_imprevistos)
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Compra medicamentos',
    keywords: ['farmacia', 'drogueria', 'cruz verde', 'farmatodo', 'la rebaja', 'pasteur', 'medicamentos', 'remedios', 'pastillas', 'jarabe', 'formula medica'],
    weight: 9,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Consulta médica',
    keywords: ['consulta medica', 'medico particular', 'cita especialista', 'urgencias medicas', 'laboratorio clinico', 'examenes medicos', 'odontologia', 'dentista', 'optometria'],
    weight: 9,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Urgencia veterinaria',
    keywords: ['urgencia veterinaria', 'veterinario urgencia', 'clinica veterinaria', 'hospital mascotas', 'cirugia perro', 'cirugia gato'],
    weight: 10,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Servicio plomería',
    keywords: ['plomero', 'plomerina', 'tuberia rota', 'filtracion agua', 'grifo roto', 'destape caneria', 'arreglo lavaplatos'],
    weight: 10,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Servicio cerrajería',
    keywords: ['cerrajero', 'cerrajeria', 'llaves perdidas', 'cambio cerradura', 'apertura puerta'],
    weight: 10,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Reparación hogar',
    keywords: ['reparacion hogar', 'electricista', 'cortocircuito', 'pintura dano', 'arreglo persiana', 'arreglo puerta', 'reparacion techo', 'gotera'],
    weight: 9,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Reparación vehículo',
    keywords: ['taller mecanico', 'pinchazo', 'cambio llanta', 'bateria carro', 'bateria moto', 'grua', 'frenos carro', 'dano mecanico'],
    weight: 9,
  },
  {
    categoryId: 'cat_imprevistos',
    subcategory: 'Reemplazo electrodoméstico',
    keywords: ['arreglo nevera', 'arreglo lavadora', 'reparacion microondas', 'repuesto estufa', 'tecnico electrodomesticos'],
    weight: 9,
  },
];

/**
 * Normalizes text for robust comparisons: converts to lowercase, strips accents and punctuation.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ') // replace special chars with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

export interface MatchResult {
  categoryId: string;
  subcategory?: string;
  matchedKeyword: string;
  confidence: number; // 0.0 - 1.0
}

/**
 * Deterministically finds the best category matching a title or description.
 * Executes in < 0.2ms with zero network calls and zero AI dependencies.
 */
export function matchCategoryFromTitle(rawTitle: string): MatchResult | null {
  if (!rawTitle || rawTitle.trim().length < 2) return null;

  const normalized = normalizeText(rawTitle);
  const words = normalized.split(' ');

  let bestMatch: MatchResult | null = null;
  let highestScore = 0;

  for (const rule of CATEGORY_RULES) {
    const baseWeight = rule.weight || 5;

    for (const keyword of rule.keywords) {
      const normKeyword = normalizeText(keyword);

      // Exact match of full phrase or contains phrase
      if (normalized === normKeyword) {
        const score = 100 * baseWeight;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            categoryId: rule.categoryId,
            subcategory: rule.subcategory,
            matchedKeyword: keyword,
            confidence: 0.99,
          };
        }
      } else if (normalized.includes(normKeyword)) {
        const score = 80 * baseWeight;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            categoryId: rule.categoryId,
            subcategory: rule.subcategory,
            matchedKeyword: keyword,
            confidence: 0.9,
          };
        }
      } else {
        // Check word-by-word matching
        const kwWords = normKeyword.split(' ');
        const matchesAllKwWords = kwWords.every((kw) => words.includes(kw));
        if (matchesAllKwWords && kwWords.length > 1) {
          const score = 70 * baseWeight;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = {
              categoryId: rule.categoryId,
              subcategory: rule.subcategory,
              matchedKeyword: keyword,
              confidence: 0.85,
            };
          }
        }
      }
    }
  }

  return bestMatch;
}
