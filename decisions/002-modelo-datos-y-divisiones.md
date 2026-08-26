# Decisión 002: Modelo de Datos para Categorías, Gastos y Reglas de División

- **Fecha:** 2026-08-05
- **Estado:** Aceptado / En producción

## Contexto
Los gastos en un hogar compartido requieren categorización clara para presupuestación y reglas flexibles de división de cuentas (equitativa 50/50, asumida al 100% por una parte, o personalizada/proporcional según ingresos).

## Decisión
1. **Estructura fija de 4 categorías maestras:**
   - `cat_fijos`: Gastos mensuales imprescindibles (Arriendo, Servicios, Mercado).
   - `cat_recurrentes`: Gastos periódicos prescindibles (Streaming, Gimnasio, Planes).
   - `cat_ocasionales`: Gastos esporádicos planeados (Restaurantes, Viajes, Ocio).
   - `cat_imprevistos`: Gastos no planeados imprescindibles (Reparaciones, Urgencias).
2. **Tipos de División (`SplitType`):**
   - `50_50`: División equitativa exacta.
   - `100_PAID_BY_ME`: Pagado totalmente por el usuario activo (sin deuda para otros).
   - `100_PAID_BY_OTHER`: Pagado totalmente por el otro miembro.
   - `CUSTOM`: División porcentual personalizada o proporcional al ingreso registrado en `Member.income`.
3. **Estado de Transacciones (`TransactionStatus`):**
   - `PAGADO`, `PENDIENTE`, `DEBES`.

## Consecuencias
- Estructura predecible para cálculos de balances en `BalanceCard`, `ActividadTab` y `PresupuestoTab`.
- Permite calcular liquidaciones de deudas netas (`SettlementRecord`) sin ambigüedad.
