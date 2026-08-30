# Sesión 2026-08-30: Fase 1 Arquitectura Zero-Cost

- **Resumen:** Se planificó e implementó la estructura de servicios base para la Fase 1 del proyecto. KOPAR usará Supabase para DB relacional + Auth, y SODA API para la TRM. No se integraron los servicios a la UI todavía, solo se dejaron configurados los clientes y la estructura SQL para no romper el front.
- **Archivos Modificados/Creados:**
  - `package.json` (instalación `@supabase/supabase-js`)
  - `.env.example` (añadidas variables de entorno)
  - `src/lib/supabase.ts` (cliente de Supabase)
  - `src/services/trm.ts` (cliente SODA API con caché)
  - `supabase/schema.sql` (esquema DDL completo y RLS policies)
  - `decisions/001-arquitectura-zero-cost-fase1.md`
- **Próximo paso prioritario:** Conectar los servicios de Supabase a la UI refactorizando los contextos de datos (reemplazar la data de `src/data.ts`).
