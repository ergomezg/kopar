# Gotcha: Animaciones con Motion en React 19

## Síntoma / Problema
Error de compilación o warnings al importar `framer-motion` en proyectos con React 19:
`Cannot find module 'framer-motion'` o incompatibilidad de peer dependencies con React 19.

## Causa Raíz
El proyecto utiliza la versión moderna `motion` (v12+) optimizada para React 19. En esta versión el paquete oficial se llama `motion` y su punto de entrada para componentes React es `motion/react`.

## Solución Comprobada
Importar siempre desde `'motion/react'`:
```tsx
// 🚫 INCORRECTO:
import { motion, AnimatePresence } from 'framer-motion';

// ✅ CORRECTO:
import { motion, AnimatePresence } from 'motion/react';
```
