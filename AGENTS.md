# KOPAR — Master Agent Control & Memory Hub

Este archivo es el centro de control e instrucciones maestras para cualquier agente de IA que trabaje en el repositorio de **KOPAR**.

---

## 1. Identidad y Propósito del Proyecto
- **Proyecto:** KOPAR (Finanzas Compartidas & Hogar)
- **Propósito:** Aplicación web fintech colaborativa para la gestión transparente de gastos del hogar, presupuestos por categorías y liquidación equitativa o proporcional de saldos entre convivientes.
- **Stack Tecnológico:** React 19, TypeScript ~5.8, Tailwind CSS v4 (`@tailwindcss/vite`), Vite 6, Motion (`motion/react`), Lucide React, Recharts.

---

## 2. Reglas de Comportamiento con el Contexto (Invariantes de Sesión)
- **El context window es caro y volátil:** La memoria real y duradera vive en los archivos del repositorio, no en el historial de la conversación.
- **Carga mínima necesaria:** NUNCA cargues todo el historial ni todos los archivos del proyecto a la vez. Lee únicamente lo estrictamente necesario para la tarea actual.
- **Referenciar antes de volcar:** Prefiere indicar rutas de archivos y fragmentos exactos antes que copiar bloques largos de código en el prompt.
- **Modularidad y Skills:** Convierte procedimientos repetitivos en skills reutilizables dentro de `skills/`.
- **Cierre de sesión:** Al finalizar o pausar una sesión importante, corre obligatoriamente `skills/actualizar-contexto.md` para actualizar `state/`, registrar decisiones en `decisions/` y comprimir la sesión en `logs/`.
- **Densidad de información:** Mantén `AGENTS.md` siempre por debajo de las 300 líneas y con máxima densidad informativa.

---

## 3. Punteros al Sistema de Memoria Persistente

| Carpeta / Archivo | Propósito | Cuándo consultarlo |
|---|---|---|
| [`contexto/`](./contexto/) | **Documentos base de contexto** (`design.md`, `reglas.md`, `decisiones.md`) | Referencia rápida de tokens, líneas rojas y decisiones consolidadas. |
| [`contexto/reglas.md`](./contexto/reglas.md) | **Líneas rojas y prohibiciones estrictas** | Antes de escribir o refactorizar cualquier código. |
| [`contexto/design.md`](./contexto/design.md) | **Design System completo y tokens UI** | Al crear o modificar estilos, colores, espaciados y componentes. |
| [`contexto/decisiones.md`](./contexto/decisiones.md) | **Registro consolidado de decisiones** | Para conocer el historial y justificación de decisiones clave. |
| [`state/`](./state/) | **Estado real del proyecto** | Para saber qué está implementado (`current-state.md`), qué falta (`roadmap-and-pending.md`) y qué está bloqueado (`blockers.md`). |
| [`decisions/`](./decisions/) | **Registro detallado de decisiones técnicas / UX** | Para entender el porqué de la arquitectura (`001-...`, `002-...`, `003-...`). |
| [`gotchas/`](./gotchas/) | **Problemas conocidos y soluciones rápidas** | Al encontrarse con errores de build, Tailwind v4, React 19, moneda o LocalStorage. |
| [`logs/`](./logs/) | **Resúmenes comprimidos de sesiones** | Al iniciar una sesión para retomar el contexto del trabajo previo. |
| [`skills/actualizar-contexto.md`](./skills/actualizar-contexto.md) | **Protocolo de mantenimiento de memoria** | Al cerrar o pausar un hito importante de trabajo. |

---

## 4. Resumen de Reglas Duras e Invariantes Clave
*(Para la lista exhaustiva y verificable, consulta [`reglas.md`](./reglas.md))*

1. **Estética Light Mode & Elevación sin Sombras:** Cero sombras difusas (`box-shadow`, `shadow-*`). La jerarquía se define solo con bordes de 1px (`#dedfe2`) y fondos alternados (`#ffffff` vs `#f7f8f9`).
2. **Azul Coinbase (`#0052ff`):** Exclusivo para botones de acción primaria (CTA), indicador de tab activo y logo.
3. **Forma de Botones & Tags:** Todos los botones y tags interactivos deben ser píldoras (`rounded-full`).
4. **Formato Monetario:** Siempre usar `formatAmount(amount, currency)` o locale colombiano (`es-CO`). Los inputs numéricos monetarios deben tener prefijo absoluto con `pl-11`.
5. **Animaciones:** Importar siempre de `motion/react` (no de `'framer-motion'`).
6. **Iconos:** Exclusivamente `lucide-react`.
7. **Regla de 1 Administrador:** Cada hogar tiene exactamente 1 administrador (`role: 'admin'`).

---

## 5. Orden de Lectura Preferido según Tipo de Tarea

- **Crear o modificar componentes UI:**
  1. `design.md` (Tokens y radios)
  2. `src/types.ts` (Estructura de interfaces)
  3. Archivo del componente en `src/components/`

- **Lógica de cálculos, balances o splits:**
  1. `state/current-state.md` (Estado funcional)
  2. `src/types.ts` y `src/data.ts` (Modelos y datos iniciales)
  3. `src/utils/format.ts` (Utilidades de formato y nombres)

- **Corrección de bugs / Errores técnicos:**
  1. `gotchas/` (Verificar si el problema ya está documentado)
  2. Archivo objetivo específico

- **Nuevas funcionalidades o features grandes:**
  1. `state/current-state.md` y `state/roadmap-and-pending.md`
  2. `decisions/` (Revisar precedentes arquitectónicos)
  3. `src/App.tsx` y componentes involucrados

---

## 6. Mapeo de Skills por Tipo de Tarea

| Tipo de Tarea | Skill Recomendada |
|---|---|
| **Cerrar o pausar sesión de trabajo** | `skills/actualizar-contexto.md` |
| **Auditoría de accesibilidad UI (a11y)** | `a11y-debugging` / `flutter_a11y_agent` |
| **Estilos, layout moderno y compatibilidad CSS/React** | `modern-web-guidance` |
| **Integración con modelos de IA (Gemini API)** | `gemini-api-dev` / `gemini-interactions-api` |

---

## 7. Definition of Done (DoD)
Una tarea se considera terminada únicamente si cumple con:
1. **Tipado estricto:** Tipos declarados y consistentes con `src/types.ts`.
2. **Cumplimiento de diseño:** Cumple estrictamente con `design.md` y `reglas.md` (Light mode, sin sombras, botones `rounded-full`, 1px borders).
3. **Formato monetario:** Montos presentados con `formatAmount` e inputs con prefijo separado (`pl-11`).
4. **Sin errores de consola ni linter:** Código limpio y libre de advertencias en tiempo de ejecución.
5. **Memoria actualizada:** Si la tarea cerró un hito o introdujo decisiones/gotchas, se ejecutó `skills/actualizar-contexto.md`.
