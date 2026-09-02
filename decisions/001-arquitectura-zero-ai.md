# Decisión 001: Arquitectura Zero-AI y Sustitución por Motores Deterministas

**Fecha:** 2026-09-01

## Contexto
El registro de gastos colaborativos y la liquidación de deudas en KOPAR requieren alta precisión contable, respuesta inmediata y bajo costo operativo. Inicialmente, se plantearon o simularon integraciones con LLMs (como Gemini) para autocategorizar textos, leer recibos y calcular quién le debe a quién basándose en historiales de texto libre.

## Decisión Tomada
Se ha migrado permanentemente a una **Arquitectura Zero-AI (Determinista)**.
En lugar de depender de inferencias de redes neuronales, se han implementado motores matemáticos y lógicos locales en `src/utils/`:
1. `categoryMatcher.ts`: Diccionario y sistema de pesos con limpieza de *strings* para clasificar categorías en < 0.2ms.
2. `debtSimplifier.ts`: Algoritmo *Min-Cash-Flow* sobre grafos dirigidos para minimizar transacciones contables con 100% de precisión.
3. `receiptParser.ts`: Extracción mediante Expresiones Regulares (Regex) orientada a montos financieros colombianos (separadores de miles) y fechas.
4. `duplicateDetector.ts`: Heurística reactiva (montos + fechas en ventana de 48h) en vez de comprensión semántica.

Adicionalmente, se integró `vitest` y todos los motores cuentan con pruebas unitarias exhaustivas garantizando cobertura determinista.

## Razonamiento y Consecuencias
- **Latencia:** Pasó de > 2000ms a < 1ms por acción.
- **Costo:** Cero llamadas de red a APIs externas, sin tokens.
- **Confiabilidad Financiera:** Se elimina por completo el riesgo crítico de alucinaciones matemáticas de un LLM al calcular balances y extraer dinero, asegurando que las cuentas sean exactas.
- **Offline First:** Toda la lógica pesada corre instantáneamente del lado del cliente.
