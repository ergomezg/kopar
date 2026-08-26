# Bloqueadores y Riesgos Activos — KOPAR

- **Última revisión:** 2026-08-26

---

## 1. Bloqueadores Técnicos Actuales

- **Entorno Local sin `node_modules`:**
  - *Descripción:* En la máquina local el comando `npm install` no se ha ejecutado recientemente en este directorio de trabajo, lo que impide correr `npm run lint` (`tsc --noEmit`) directamente sin `npx`.
  - *Impacto:* La verificación estática de TypeScript depende de que las dependencias locales estén instaladas en el host.
  - *Acción requerida:* El usuario o entorno debe ejecutar `npm install` o `bun install` cuando se desee levantar el servidor de desarrollo (`npm run dev`).

---

## 2. Riesgos y Puntos de Atención
- **Tamaño de `App.tsx`:** Cuenta con más de 700 líneas. Si bien funciona de forma estable, futuras adiciones de lógica deben extraerse a hooks para evitar regresiones.
- **Sincronización multi-pestaña:** Actualmente el estado vive en memoria React con hidratación inicial desde `localStorage`. Cambios en una pestaña no se reflejan automáticamente en otra sin refrescar.
