# Decisión 001: Sistema de Diseño Light Mode de Alto Contraste (Estilo Coinbase)

- **Fecha:** 2026-08-01
- **Estado:** Aceptado / En producción

## Contexto
KOPAR es una aplicación fintech enfocada en la gestión colaborativa y transparente de finanzas y gastos del hogar entre parejas o compañeros de vivienda. Las interfaces financieras con modo oscuro masivo o efectos de glassmorphism difuso generan fatiga visual, pérdida de legibilidad en números pequeños y sensación de baja precisión.

## Decisión
1. Adoptar un sistema visual **100% Light Mode** con estética arquitectónica y minimalista.
2. Eliminar todas las sombras difusas (`box-shadow`, `shadow-lg`, `drop-shadow`).
3. Construir la profundidad y jerarquía exclusivamente mediante:
   - Bordes nítidos de 1px con token Pewter (`#dedfe2`).
   - Bloques alternados de color de superficie: fondo base blanco puro (`#ffffff`) vs contenedores y secciones Frost (`#f7f8f9`).
4. Reservar el color **Coinbase Blue (`#0052ff`)** de forma estricta y única para acciones primarias (CTAs), tab activo e isotipo de marca.
5. Todos los botones interactivos y tags deben tener geometría de píldora (`rounded-full`).

## Consecuencias
- **Positivas:** Máxima legibilidad de cifras, tablas y metadata; identidad visual limpia, sólida y profesional.
- **Negativas / Restricciones:** No se permite modo oscuro ni sombras decorativas; cualquier intento de usar sombras difusas debe ser bloqueado.
