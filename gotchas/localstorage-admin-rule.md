# Gotcha: Regla de 1 Solo Administrador y Sanitización de LocalStorage

## Síntoma / Problema
Al cargar el hogar desde `localStorage` en `App.tsx`, miembros que debían ser integrantes comunes aparecían como administradores, o aparecían usuarios eliminados de pruebas anteriores ("Alex" / "user_1").

## Causa Raíz
Versiones previas del prototipo permitían múltiples usuarios con `role: 'admin'`, lo cual quedaba guardado en el `localStorage` del navegador.

## Solución Comprobada
En `App.tsx` al hidratar `household` y `members` desde `localStorage`, se ejecuta una función de sanitización que:
1. Filtra cualquier miembro con id `user_1` o nombre "alex".
2. Utiliza una bandera `foundAdmin`: el primer miembro con `role === 'admin'` se mantiene; cualquier admin adicional se degrada automáticamente a `role = 'member'`.
3. Si ningún miembro es admin, el primer integrante de la lista se establece como admin.
4. Cualquier componente nuevo que modifique miembros o roles debe respetar esta invariante.
