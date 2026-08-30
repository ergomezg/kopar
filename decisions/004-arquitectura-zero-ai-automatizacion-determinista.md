# ADR 004: Arquitectura Zero-AI y Automatización Financiera Determinista

- **Fecha:** 2026-08-30
- **Estado:** Aceptado
- **Decisores:** Principal Software Architect, Tech Lead, Especialista en Optimización

---

## Contexto y Problema
En las etapas iniciales del proyecto se contempló el uso de modelos LLM (Google Gemini API vía `@google/genai`) para tareas como la categorización de gastos, la extracción de comprobantes, los cálculos de liquidación y la generación de recomendaciones de ahorro.

Sin embargo, el uso de LLMs en un producto fintech doméstico introducía riesgos críticos:
1. **Latencia elevada (800ms - 5000ms)** en formularios y cierres contables donde la respuesta debe ser inmediata.
2. **Dependencia de red y falta de soporte offline** en puntos de venta físicos (ej. supermercados o restaurantes con baja cobertura móvil).
3. **Alucinaciones numéricas y pérdida de invariantes contables** (un balance financiero debe ser una suma cero matemáticamente exacta).
4. **Costos operativos recurrentes por token** y complejidad innecesaria en el bundle de cliente.
5. **Riesgos de privacidad** al transmitir PII y textos de comprobantes bancarios a APIs de terceros.

---

## Decisión Tomada
Se decide desacoplar y eliminar completamente la dependencia del SDK `@google/genai` y la API de Gemini, sustituyendo cada funcionalidad por motores deterministas basados en lógica pura de software:

1. **Autocategorización Determinista (`categoryMatcher.ts`):** Motor de búsqueda por Trie/Hash Map con diccionario local de comercios y palabras clave de alta frecuencia (ej. *Éxito, D1, EPM, Netflix, Uber, Crepes*). Latencia $<0.2\text{ ms}$, 100% offline.
2. **Min-Cash-Flow Debt Simplifier (`debtSimplifier.ts`):** Algoritmo codicioso en grafo bipartito que minimiza el número de transferencias entre convivientes a un máximo de $N-1$ transacciones para $N$ personas en tiempo $O(N \log N)$ con garantía matemática estricta de suma cero.
3. **Parser Determinista de Comprobantes (`receiptParser.ts`):** Expresiones regulares locales para extraer monto, fecha y comercio a partir de notificaciones de SMS/portapapeles (Bancolombia, Nequi, Daviplata, PSE, Transfiya) con privacidad absoluta.
4. **Detector Heurístico de Duplicados (`duplicateDetector.ts`):** Comparación simultánea de monto exacto, ventana de tiempo $\pm 48\text{ h}$ y similitud de tokens.
5. **Motor de Diagnóstico Financiero (`budgetInsights.ts`):** Reglas de negocio e interpolación reactiva para alertas de umbral (80% y 100%) y desglose de proporciones esenciales vs. discrecionales.

---

## Consecuencias y Beneficios
- **Latencia:** Reducida de $>1500\text{ ms}$ a $<1\text{ ms}$ en todas las operaciones.
- **Disponibilidad:** 100% funcional sin conexión a internet (offline-first).
- **Costos:** $\$0$ en costos de inferencia por token.
- **Bundle Size:** Reducción de dependencias y código de terceros en el frontend.
- **Predictibilidad:** Cero alucinaciones o errores numéricos.
