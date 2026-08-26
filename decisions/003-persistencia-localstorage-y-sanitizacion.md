# Decisión 003: Persistencia en LocalStorage y Sanitización de Datos Iniciales

- **Fecha:** 2026-08-15
- **Estado:** Aceptado / En producción

## Contexto
Durante las fases de prototipado e iteración se generaron datos legados bajo nombres anteriores (ej. `SplitHome`, `DUOPAY+`, usuario ficticio `Alex`/`user_1`, múltiples administradores simultáneos). Al cargar datos desde `localStorage`, los estados corruptos rompían el flujo de roles.

## Decisión
1. Mantener sincronización en `localStorage` con claves `splithome_household`, `splithome_members`, `splithome_auth_status`.
2. Implementar funciones de saneamiento al inicializar el estado en `App.tsx`:
   - Eliminar automáticamente cualquier miembro con id `user_1` o nombre "Alex".
   - Garantizar la regla de **Exactamente 1 Administrador**: Si hay más de un `role === 'admin'`, solo el primero conserva el rol y los demás se convierten a `role = 'member'`. Si no hay admin, el primer miembro se promueve a admin.
   - Forzar el nombre de la app a "KOPAR".
3. Formatear nombres completos a estándar "Nombre + Inicial apellido" en vistas resumidas usando `formatDisplayName`.

## Consecuencias
- Cero fallos por esquemas de datos obsoletos guardados en el navegador del usuario.
- Transición fluida a una futura capa de base de datos / backend.
