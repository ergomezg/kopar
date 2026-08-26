# Gotcha: Formateo de Moneda y Posicionamiento de Prefijos en Inputs

## Síntoma / Problema
Los campos numéricos monetarios pueden mostrar el signo `$` solapado con los dígitos introducidos por el usuario, o mostrar cifras con formato anglosajón (`$100,000.00` en vez de `$100.000`), rompiendo la estética fintech.

## Causa Raíz
Insertar el símbolo `$` dentro del string del `value` en `<input>` genera problemas al parsear números y romper la validación HTML5 `type="number"`. Además, `toLocaleString('en-US')` usa comas en lugar de puntos.

## Solución Comprobada
1. En inputs de montos, separar el prefijo como un label absoluto y añadir padding izquierdo al input:
```tsx
<div className="relative">
  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5b616e] font-semibold text-sm">
    {household.currency || '$'}
  </span>
  <input
    type="number"
    className="w-full bg-[#f7f8f9] border border-[#dedfe2] rounded-[12px] pl-11 pr-4 py-3 text-base text-[#0a0b0d] font-semibold focus:outline-none focus:border-[#0052ff]"
    placeholder="0"
  />
</div>
```
2. Para mostrar montos en cards, listas o modales, utilizar siempre la función centralizada `formatAmount(amount, currency)` de `src/utils/format.ts`.
