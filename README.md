# KOPAR — Finanzas Compartidas para el Hogar

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-4285F4?style=for-the-badge&logo=google&logoColor=white)

<p align="center">
  <strong>Gestión transparente, colaborativa y equitativa de gastos del hogar, presupuestos por categorías y liquidación de saldos entre convivientes.</strong>
</p>

[Demostración](#-instalación-y-ejecución-local) •
[Características](#-características-principales) •
[Stack Tecnológico](#%EF%B8%8F-stack-tecnológico) •
[Estructura](#-estructura-del-proyecto) •
[Principios de Diseño](#-principios-de-diseño-y-ux)

</div>

---

## 📖 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#%EF%B8%8F-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Principios de Diseño y UX](#-principios-de-diseño-y-ux)
- [Sistema de Memoria y Contexto (AI Agents)](#-sistema-de-memoria-y-contexto-ai-agents)
- [Licencia](#-licencia)

---

## 🏠 Acerca del Proyecto

**KOPAR** es una aplicación web *fintech* diseñada específicamente para parejas, *roommates* y familias que comparten gastos domésticos. Elimina la fricción en las cuentas compartidas mediante:

- **Visibilidad en tiempo real:** Sabes exactamente cuánto debes, cuánto te deben y el balance neto consolidado.
- **División inteligente y justa:** Opciones de repartición equitativa (50/50 o entre partes iguales) o proporcional a los ingresos reales de cada conviviente.
- **Presupuestos y límites mensuales:** Monitoreo visual de gastos categorizados con alertas de sobrecosto.
- **Liquidación sin estrés:** Registro claro de transferencias y saldos finiquitados para mantener la paz en el hogar.

---

## ✨ Características Principales

### 📊 Gestión de Balances y Gastos
- **Balance Card Dinámico:** Muestra el desglose de "Debes", "Te deben" y el saldo neto, con portada personalizable para el hogar.
- **Registro Rápido de Gastos:** Agrega compras con título, monto, categoría, subcategoría, pagador, comprobante/recibo y notas.
- **División Flexible:** Soporta división equitativa (*50/50*, *1/N*) o proporcional según ingresos reportados.
- **Feed de Actividad:** Historial de transacciones con búsqueda en tiempo real, filtros por categoría y badges de estado.

### 🎯 Presupuestos y Categorías
- **Gráficos Interactivos:** Visualización con Recharts de gastos actuales vs. topes presupuestarios por categoría.
- **Personalización:** Creación y ajuste de límites presupuestarios y categorías del hogar.

### 🤝 Gestión de Hogar y Liquidaciones
- **Perfiles y Roles:** 1 Administrador por hogar con miembros activos y pendientes de invitación mediante código único.
- **Módulo de Liquidación (Settle Up):** Cálculo automático de deudas cruzadas con registro de recibos de pago.
- **Onboarding Wizard:** Flujo guiado de 4 pasos para configurar un nuevo hogar, moneda, integrantes, presupuesto y primer gasto.

### 🤖 Asistencia Inteligente con Gemini AI
- Integración con `@google/genai` para categorización inteligente, análisis de recibos y recomendaciones de ahorro para el hogar.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
|---|---|---|
| **Frontend Core** | [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) | Tipado estricto y componentes funcionales modernos. |
| **Bundler & Dev Server** | [Vite 6](https://vite.dev/) | HMR ultrarrápido y optimización de compilación. |
| **Estilos & UI** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) | Estilizado atómico con tokens de diseño centralizados. |
| **Animaciones** | [Motion](https://motion.dev/) (`motion/react`) | Transiciones fluidas y micro-interacciones. |
| **Iconografía** | [Lucide React](https://lucide.dev/) | Iconos SVG ligeros, limpios y consistentes. |
| **Gráficos & Métricas** | [Recharts 3](https://recharts.org/) | Gráficos de barras y distribución de presupuestos. |
| **Inteligencia Artificial** | [@google/genai](https://www.npmjs.com/package/@google/genai) | SDK oficial para modelos Google Gemini. |

---

## 📂 Estructura del Proyecto

```text
kopar/
├── contexto/              # Documentos base del Design System, reglas y decisiones
│   ├── design.md          # Tokens de diseño, tipografía, paleta de colores y componentes
│   ├── reglas.md          # Invariantes y líneas rojas estrictas de UI y dominio
│   └── decisiones.md      # Historial consolidado de decisiones técnicas y de producto
├── state/                 # Estado de desarrollo persistente para agentes y desarrolladores
│   ├── current-state.md   # Estado funcional actual del proyecto
│   ├── roadmap-and-pending.md # Tareas pendientes y próximos hitos
│   └── blockers.md        # Bloqueos y dependencias críticas
├── src/
│   ├── components/        # Componentes modulares de la interfaz
│   │   ├── auth/          # Autenticación, bienvenida y OnboardingWizard
│   │   ├── budget/        # Componentes específicos del presupuesto
│   │   ├── modals/        # Modales (AddExpense, Settle, Invite, EditBudget, etc.)
│   │   ├── tabs/          # Pestañas principales (Actividad, Presupuesto, Hogar)
│   │   ├── ui/            # Elementos base de UI
│   │   ├── BalanceCard.tsx    # Tarjeta principal de balance y portada
│   │   ├── BottomNavigation.tsx # Barra de navegación inferior
│   │   ├── Header.tsx         # Encabezado sticky con alertas e invitaciones
│   │   ├── QuickActions.tsx   # Acciones rápidas (Gasto, Liquidar, Invitar)
│   │   └── RecentActivity.tsx # Feed de últimos movimientos
│   ├── constants/         # Tokens de tema y valores estáticos
│   ├── utils/             # Utilidades (formato de moneda es-CO, fechas, nombres)
│   ├── data.ts            # Datos iniciales y mocks tipados
│   ├── types.ts           # Definición de interfaces y tipos TypeScript
│   ├── App.tsx            # Componente raíz y control de estado
│   ├── index.css          # Importaciones de Tailwind CSS v4
│   └── main.tsx           # Punto de entrada de React 19
├── package.json           # Dependencias y scripts de ejecución
├── tsconfig.json          # Configuración del compilador TypeScript
└── vite.config.ts         # Configuración de Vite con soporte Tailwind v4
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18.0 o superior recomendada)
- Gestor de paquetes: `npm`, `pnpm` o `bun`

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd kopar
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo `.env.example` a `.env.local` y define tu API Key de Gemini:
   ```bash
   cp .env.example .env.local
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con los siguientes parámetros:

| Variable | Requerida | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | Opcional | Clave de API de Google Gemini para funciones inteligentes (análisis de gastos, categorización). |
| `APP_URL` | Opcional | URL base de la aplicación (usado en despliegues en producción o callbacks). |

---

## 📜 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

- `npm run dev`: Inicia el servidor de desarrollo con Hot Module Replacement en el puerto 3000.
- `npm run build`: Compila la aplicación para producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza localmente la compilación de producción.
- `npm run lint`: Ejecuta el verificador de tipos de TypeScript (`tsc --noEmit`).
- `npm run clean`: Limpia artefactos generados de compilación (`dist`).

---

## 🎨 Principios de Diseño y UX

El diseño de KOPAR sigue una estética minimalista, inspirada en plataformas como Coinbase y Stripe:

1. **Elevación sin Sombras:** Cero sombras difusas (`box-shadow`). La jerarquía visual se define exclusivamente mediante bordes finos de 1px (`#dedfe2`) y contraste entre superficies (`#ffffff` frente a `#f7f8f9`).
2. **Azul de Acción (`#0052ff`):** Reservado estrictamente para botones de acción primaria (CTA), indicador de tab activo y logo.
3. **Forma Píldora (`rounded-full`):** Todos los botones interactivos, chips y tags usan bordes redondeados completos.
4. **Formato Monetario Estricto:** Formato de moneda con locale colombiano (`es-CO`, ej: `$ 1.250.000 COP`) y prefijo monetario separado en formularios.
5. **100% Light Mode:** Interfaz optimizada para máxima legibilidad y claridad bajo luz diurna.

---

## 🧠 Sistema de Memoria y Contexto (AI Agents)

Este repositorio implementa una arquitectura de memoria persistente para flujos de trabajo con asistentes de inteligencia artificial:

- **[`AGENTS.md`](./AGENTS.md):** Centro de control con instrucciones maestras e invariantes de desarrollo.
- **[`contexto/`](./contexto/):** Documentación viva de reglas (`reglas.md`), diseño (`design.md`) y decisiones arquitectónicas (`decisiones.md`).
- **[`state/`](./state/):** Registro del estado funcional actual (`current-state.md`) y backlog (`roadmap-and-pending.md`).
- **[`decisions/`](./decisions/) & [`gotchas/`](./gotchas/):** Registro ADR y base de conocimiento de problemas resueltos.

---

## 📄 Licencia

Este proyecto es de uso privado / educativo para el curso *AI para UXers*. Todos los derechos reservados.

