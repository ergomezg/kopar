# Roadmap y Tareas Pendientes — KOPAR

---

## 1. Backlog Prioritario (Próximos Sprints)

1. **Sincronización en Tiempo Real / Backend:**
   - **(En Progreso)** Infraestructura creada (Supabase SDK + Schema SQL listos).
   - *Pendiente:* Refactorizar `App.tsx` y vistas para consumir la base de datos real en lugar de los mocks de `src/data.ts`.
2. **Exportación de Reportes Financieros:**
   - Generación de resumen mensual en PDF / CSV desde la pestaña de Presupuesto o Hogar.
3. **Notificaciones Push y Recordatorios de Cobro:**
   - Alertas interactivas cuando se registra un nuevo gasto o cuando un miembro salda una deuda.
4. **Categorías Personalizadas:**
   - Permitir a los administradores agregar subcategorías adicionales o renombrar las existentes.

---

## 2. Mejoras de Calidad de Código y Arquitectura
- Modularizar `App.tsx` (extraer gestores de estado a custom hooks como `useHousehold`, `useExpenses`, `useAuth`).
- **[x]** Añadir tests unitarios para motores de Fase 1 (`categoryMatcher.ts`, `duplicateDetector.ts`, `budgetInsights.ts`).
- **[x]** Añadir tests unitarios para utilidades Core (`debtSimplifier.ts`).
- **[x]** Implementar el parser de recibos con Regex (`receiptParser.ts`) estipulado en la Fase 2 del plan Zero-AI.
