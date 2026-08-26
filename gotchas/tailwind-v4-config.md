# Gotcha: Configuración y Tokens de Tailwind CSS v4

## Síntoma / Problema
En Tailwind CSS v4 ya no se utiliza `tailwind.config.js` clásico. Si un agente intenta añadir clases o tokens creando o editando un `tailwind.config.js`, no tendrán efecto en Vite.

## Causa Raíz
El proyecto utiliza `@tailwindcss/vite` con directiva `@import "tailwindcss";` dentro de `src/index.css`. Las variables CSS de tema (`--color-coinbase-blue`, `--font-coinbasedisplay`, etc.) se declaran directamente en el bloque `:root` en `src/index.css`.

## Solución Comprobada
1. Para colores o valores fijos del design system, usar las clases directas con valor arbitrario estandarizado:
   - `bg-[#0052ff]`, `text-[#0052ff]` (Coinbase Blue)
   - `bg-[#f7f8f9]` (Frost)
   - `border-[#dedfe2]` (Pewter)
   - `text-[#0a0b0d]` (Midnight)
   - `text-[#5b616e]` (Slate)
   - `text-[#27ad75]` (Positive Green)
   - `text-[#f0616d]` (Negative Red)
2. Para tipografías, usar `font-display` (Manrope) y `font-sans` (Inter).
3. Nunca crear un archivo `tailwind.config.js` legacy.
