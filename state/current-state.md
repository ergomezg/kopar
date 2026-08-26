# Estado Actual del Proyecto KOPAR

- **Última actualización:** 2026-08-26
- **Versión:** 0.1.0-alpha
- **Stack:** React 19, TypeScript ~5.8, Tailwind CSS v4 (`@tailwindcss/vite`), Vite 6, Motion (`motion/react`), Lucide React, Recharts.

---

## 1. Vistas y Componentes Implementados (Estables)

| Componente / Pantalla | Ruta / Ubicación | Estado | Descripción |
|---|---|---|---|
| **Header** | `src/components/Header.tsx` | Estable | Sticky con logo KOPAR, botones de invitación y notificaciones con badge. |
| **Balance Card** | `src/components/BalanceCard.tsx` | Estable | Portada fotográfica con cambio de cover, breakdown de "Debes", "Te deben" y balance neto. |
| **Quick Actions** | `src/components/QuickActions.tsx` | Estable | Acciones rápidas (Agregar Gasto, Liquidar Cuentas, Invitar). |
| **Recent Activity** | `src/components/RecentActivity.tsx` | Estable | Feed de últimos movimientos con badges de estado y formato relativo de fechas. |
| **Bottom Navigation** | `src/components/BottomNavigation.tsx` | Estable | Barra de navegación inferior móvil/desktop para las 4 pestañas. |
| **Tab Actividad** | `src/components/tabs/ActividadTab.tsx` | Estable | Listado completo de transacciones con búsqueda, filtros por categoría y estado. |
| **Tab Presupuesto** | `src/components/tabs/PresupuestoTab.tsx` | Estable | Gráfico de distribución de gastos vs límites por categoría con `Recharts`. |
| **Tab Hogar** | `src/components/tabs/HogarTab.tsx` | Estable | Miembros del hogar, roles (1 admin), ingresos registrados y liquidaciones. |
| **Onboarding Wizard** | `src/components/auth/OnboardingWizard.tsx` | Estable | Flujo de 4 pasos para configurar hogar, divisa, integrantes, presupuesto y primer gasto. |
| **Auth & Welcome** | `src/components/auth/` | Estable | Login, registro y bienvenida inicial con persistencia de sesión. |
| **Modales de Acción** | `src/components/modals/` | Estable | `AddExpenseModal`, `SettleModal`, `EditBudgetModal`, `ExpenseDetailModal`, `InviteModal`, `CustomCoverModal`, `HelpModal`. |
| **Design System Tokens** | `src/constants/theme.ts` & `design.md` | Estable | Tokens de colores, radios y fuentes centralizados. |
| **Utilidades de Formato** | `src/utils/format.ts` | Estable | `formatAmount`, `formatDateDDMMAAAA`, `formatRelativeDate`, `formatDisplayName`. |

---

## 2. Modelos de Datos Activos (`src/types.ts`)
- `Member`: id, name, email, avatar, role (`admin` | `member`), status (`active` | `pending`), income.
- `Household`: id, name, code, currency, defaultSplitRule, createdDate, members, coverImage.
- `Category`: id, name, definition, icon, budgetLimit, color, subcategories.
- `Expense`: id, title, amount, categoryId, subcategory, paidById, date, status, notes, receiptUrl, splits, createdAt.
- `SettlementRecord`: id, date, period, totalAmount, paidBy, paidTo, note.
