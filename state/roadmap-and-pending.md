# Roadmap y Tareas Pendientes — KOPAR

---

## 1. Backlog Prioritario (Próximos Sprints)

1. **Sincronización en Tiempo Real / Backend:**
   - Conexión de persistencia remota (Supabase o Firebase Firestore) para sincronizar gastos entre múltiples dispositivos en tiempo real.
2. **Exportación de Reportes Financieros:**
   - Generación de resumen mensual en PDF / CSV desde la pestaña de Presupuesto o Hogar.
3. **Escaneo Inteligente de Recibos con Gemini:**
   - Aprovechar `@google/genai` (ya listado en `package.json`) para extracción multimodal de conceptos, montos y categorías a partir de fotos de facturas en `AddExpenseModal`.
4. **Notificaciones Push y Recordatorios de Cobro:**
   - Alertas interactivas cuando se registra un nuevo gasto o cuando un miembro salda una deuda.
5. **Categorías Personalizadas:**
   - Permitir a los administradores agregar subcategorías adicionales o renombrar las existentes.

---

## 2. Mejoras de Calidad de Código y Arquitectura
- Modularizar `App.tsx` (extraer gestores de estado a custom hooks como `useHousehold`, `useExpenses`, `useAuth`).
- Añadir tests unitarios para utilidades de cálculo de balance y splits (`src/utils/format.ts`).
