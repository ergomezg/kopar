# Decisión 001: Arquitectura Zero-Cost (Fase 1)

- **Fecha:** 2026-08-30
- **Contexto:** KOPAR necesita integrarse con servicios externos para consultar la Tasa Representativa del Mercado (TRM), autenticar usuarios de manera segura, persistir datos colaborativos en tiempo real y, a futuro, enviar notificaciones y almacenar comprobantes (imágenes).
- **Decisión Tomada:** Se optó por una arquitectura "Zero-Cost" priorizando soluciones de capa gratuita generosa o datos públicos:
  - **Base de Datos & Auth:** Supabase (PostgreSQL + RLS). Cubre Auth, base de datos relacional y storage. Su capa gratuita de 50k usuarios activos es suficiente y el RLS garantiza la seguridad entre hogares.
  - **TRM:** SODA API (datos.gov.co) para Colombia, con caché local de 24 horas (`localStorage`) para evitar bloqueos y dependencia excesiva de red.
- **Razonamiento y Consecuencias:**
  - Se descartó Firebase Firestore porque el modelo de datos de KOPAR es altamente relacional (Splits, Liquidaciones cruzadas), lo cual encaja perfectamente en PostgreSQL.
  - Se descartó crear un backend propio intermedio porque introduce costos de infraestructura. Con Supabase, el frontend React puede consultar la BD directamente de forma segura usando Row Level Security.
