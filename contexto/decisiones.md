# KOPAR — Registro de Decisiones de Arquitectura y Diseño (ADR)

Este documento consolida las decisiones fundamentales tomadas durante el diseño y desarrollo de **KOPAR**, junto con sus referencias directas en la carpeta [`decisions/`](../decisions/).

---

## Índice de Decisiones

| ID | Fecha | Título | Estado | Documento Detallado |
|---|---|---|---|---|
| **001** | 2026-08-01 | Sistema de Diseño Light Mode de Alto Contraste (Estilo Coinbase) | Aceptado | [`001-sistema-diseno-luz-alto-contraste.md`](../decisions/001-sistema-diseno-luz-alto-contraste.md) |
| **002** | 2026-08-05 | Modelo de Datos para Categorías, Gastos y Reglas de División | Aceptado | [`002-modelo-datos-y-divisiones.md`](../decisions/002-modelo-datos-y-divisiones.md) |
| **003** | 2026-08-15 | Persistencia en LocalStorage y Sanitización de Datos Iniciales | Aceptado | [`003-persistencia-localstorage-y-sanitizacion.md`](../decisions/003-persistencia-localstorage-y-sanitizacion.md) |

---

## Resumen Ejecutivo de Decisiones

### ADR 001: Sistema de Diseño Light Mode de Alto Contraste (Estilo Coinbase)
- **Problema:** Interfaces financieras con dark mode o efectos de sombras difusas/glassmorphism pierden legibilidad en números pequeños y tablas.
- **Solución:** Adoptar 100% Light Mode. Cero sombras difusas (`box-shadow`). Jerarquía construida únicamente con bordes de 1px (`#dedfe2`) y fondos alternados (`#ffffff` vs `#f7f8f9`). Azul Coinbase (`#0052ff`) reservado solo para acciones primarias (CTAs), tab activo y logo. Botones y tags siempre píldoras (`rounded-full`).

### ADR 002: Modelo de Datos para Categorías, Gastos y Divisiones
- **Problema:** Necesidad de predecir la distribución del gasto y soportar divisiones de costos tanto equitativas (50/50) como personalizadas o proporcionales a los ingresos del hogar.
- **Solución:** Establecer 4 categorías maestras fijas (`cat_fijos`, `cat_recurrentes`, `cat_ocasionales`, `cat_imprevistos`) con subcategorías. Soportar tipos de división `50_50`, `100_PAID_BY_ME`, `100_PAID_BY_OTHER`, `CUSTOM` y estados `PAGADO`, `PENDIENTE`, `DEBES`.

### ADR 003: Persistencia en LocalStorage y Sanitización de Datos
- **Problema:** Datos residuales en el navegador causaban corrupción de datos (múltiples administradores o reaparición del usuario ficticio "Alex").
- **Solución:** Al hidratar el estado en `App.tsx`, filtrar miembros obsoletos y forzar la regla de **Exactamente 1 Administrador** en el hogar. Formatear nombres completos a estándar "Nombre + Inicial del apellido" con `formatDisplayName`.
