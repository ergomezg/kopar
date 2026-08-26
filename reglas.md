# KOPAR — Reglas Duras e Invariantes

Este archivo contiene únicamente reglas prohibitivas y detectables. No contiene descripciones vagas ni sugerencias estilísticas subjetivas. Toda regla aquí listada es de cumplimiento obligatorio y verificable en código.

---

## 1. Diseño y Estética Visual (Anti-Patrones Prohibidos)

1. **PROHIBIDO el uso de sombras difusas o cajas flotantes:**
   - 🚫 NUNCA usar clases de Tailwind como `shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` ni `drop-shadow-*`.
   - 🚫 NUNCA usar `box-shadow` en CSS custom.
   - ✅ La elevación y jerarquía se logran ÚNICAMENTE mediante bordes de 1px (`border-[#dedfe2]`) y alternancia de superficies (`bg-[#ffffff]` frente a `bg-[#f7f8f9]`).

2. **PROHIBIDO el modo oscuro o fondos negros completos:**
   - 🚫 NUNCA crear layouts con `bg-[#0a0b0d]` o `bg-black` como fondo de pantalla principal o contenedor.
   - ✅ La interfaz es 100% Light Mode con fondo `bg-[#ffffff]` y secciones en `bg-[#f7f8f9]`.

3. **PROHIBIDO el uso de glassmorphism con fondos oscuros:**
   - 🚫 NUNCA usar `backdrop-blur` sobre fondos oscuros o tarjetas translúcidas negras.

4. **PROHIBIDO botones, chips o tags que no sean píldoras:**
   - 🚫 NUNCA usar `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` en botones (`<button>`) o etiquetas de estado/filtros.
   - ✅ Todos los botones interactivos, tags y chips DEBEN usar `rounded-full` (`56px` o `9999px`).

5. **PROHIBIDO radio de esquina incorrecto en contenedores:**
   - Tarjetas principales: Únicamente `rounded-[24px]`.
   - Sub-contenedores / Filas internas: Únicamente `rounded-[16px]`.
   - Inputs de formulario: Únicamente `rounded-[12px]`.
   - Modales: Únicamente `rounded-[28px]`.

6. **PROHIBIDO el mal uso del Azul Coinbase (`#0052ff`):**
   - 🚫 NUNCA usar `#0052ff` para fondos decorativos grandes, textos secundarios o bordes generales.
   - ✅ Reservado EXCLUSIVAMENTE para: botón de acción primaria (CTA), indicador de tab activo y logo de la marca.

---

## 2. Moneda, Fechas y Formato de Datos

7. **PROHIBIDO formatear moneda manualmente sin locale colombiano:**
   - 🚫 NUNCA usar `.toFixed(2)` para montos en pesos.
   - 🚫 NUNCA usar coma `,` como separador de miles.
   - ✅ SIEMPRE usar `formatAmount(amount, currency)` o `amount.toLocaleString('es-CO')`.

8. **PROHIBIDO inputs monetarios sin separación de prefijo:**
   - 🚫 NUNCA colocar el signo `$` dentro del valor del `<input type="number">` o `<input type="text">`.
   - ✅ El input DEBE tener clase `pl-11` y la etiqueta de la divisa DEBE posicionarse con `absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5b616e] font-semibold`.

9. **PROHIBIDO mostrar nombres completos en listas de actividad:**
   - 🚫 NUNCA mostrar "Mateo Morales" o "Natalia Gómez" en el renglón de metadata de transacciones.
   - ✅ Usar `formatDisplayName(name)` que genera "Mateo M." o "Natalia G.".

---

## 3. Iconografía y Dependencias

10. **PROHIBIDO usar iconos fuera de Lucide React o SVGs inline inventados:**
    - 🚫 NUNCA importar `react-icons`, `@heroicons`, `font-awesome` ni insertar SVGs crudos ad-hoc en componentes.
    - ✅ Usar exclusivamente `lucide-react`.

11. **PROHIBIDO importar desde `'framer-motion'` directamente:**
    - 🚫 NUNCA escribir `import { motion } from 'framer-motion'`.
    - ✅ En React 19 se DEBE importar desde `import { motion } from 'motion/react'`.

---

## 4. Lógica de Dominio y Datos

12. **PROHIBIDO múltiples administradores en un mismo hogar:**
    - 🚫 NUNCA permitir que más de un miembro tenga `role: 'admin'`. Exactamente 1 miembro es admin; los demás son `role: 'member'`.

13. **PROHIBIDO resucitar usuarios de prueba obsoletos:**
    - 🚫 NUNCA reintroducir el usuario 'Alex' o id 'user_1' en datos iniciales o mocks.

---

## 5. Gestión del Contexto y Archivos del Agente

14. **PROHIBIDO cargar todo el árbol de archivos o todo el historial de conversaciones.**
15. **PROHIBIDO que `AGENTS.md` supere las 300 líneas.**
16. **PROHIBIDO duplicar `design.md` en subcarpetas (la única fuente es `/design.md`).**
