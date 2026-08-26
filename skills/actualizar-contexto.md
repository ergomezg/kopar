# Skill: Actualizar Contexto (`skills/actualizar-contexto.md`)

Esta skill define el procedimiento estricto para mantener la memoria persistente del repositorio KOPAR limpia, actualizada, compacta y de alta fidelidad.

---

## 1. Cuándo Correr esta Skill
- **SÍ ejecutar:** Al finalizar o pausar una sesión de trabajo importante donde se crearon/modificaron componentes, se resolvieron bugs, se tomaron decisiones de arquitectura o se cambiaron reglas de negocio.
- **NO ejecutar:** En cada mensaje o iteración menor durante una conversación activa.

---

## 2. Protocolo de Ejecución Paso a Paso

El agente debe ejecutar las siguientes acciones en orden:

### Paso 1: Actualizar Estado (`state/`)
1. Abrir `state/current-state.md`.
2. Mover tareas completadas a la sección **Implementado / Estable**.
3. Añadir nuevas tareas detectadas a `state/roadmap-and-pending.md`.
4. Si se resolvieron blockers, eliminarlos de `state/blockers.md`.

### Paso 2: Registrar Nuevas Decisiones (`decisions/`)
1. Si durante la sesión se eligió un enfoque técnico o de UX clave, crear un nuevo archivo numerado: `decisions/NNN-nombre-de-la-decision.md` con:
   - **Fecha:** `YYYY-MM-DD`
   - **Contexto:** Qué problema surgió.
   - **Decisión tomada:** Qué solución se eligió.
   - **Razonamiento y Consecuencias:** Por qué se descartaron las alternativas.

### Paso 3: Documentar Gotchas Novedosos (`gotchas/`)
1. Si se encontró un bug engañoso (ej. incompatibilidad de versiones, comportamiento de Tailwind v4, issues de React 19, quirks de inputs en Safari/Chrome), documentarlo en `gotchas/<nombre-del-problema>.md` con:
   - **Síntoma / Error.**
   - **Causa raíz.**
   - **Solución comprobada.**

### Paso 4: Comprimir Sesión en Logs (`logs/`)
1. Crear un log comprimido `logs/YYYY-MM-DD-resumen.md` (máximo 25-40 líneas) documentando:
   - Resumen ejecutivo de lo realizado.
   - Archivos modificados o creados.
   - Próximo paso prioritario para la siguiente sesión.

### Paso 5: Auditar Líneas Rojas (`reglas.md` y `AGENTS.md`)
1. Si surgió una nueva prohibición técnica o de diseño detectable, registrarla en `reglas.md`.
2. Verificar que `AGENTS.md` **NUNCA supere las 300 líneas**. Si está cerca del límite, condensar o delegar detalles a subcarpetas de memoria (`state/`, `gotchas/`, `decisions/`).

---

## 3. Principios de Eficiencia y Reducción de Contexto

- **Comprimir lo viejo:** Nunca dejar acumular listas gigantes de pendientes obsoletos.
- **Borrar lo que ya no sirve:** Eliminar archivos temporales, logs de prueba y código muerto.
- **Evitar dumps de código en logs:** Los logs solo guardan nombres de archivos y propósitos, nunca bloques enteros de código.
- **Resultado esperado:** El contexto resultante en disco queda más ordenado, claro y conciso que al inicio de la sesión.
