# KOPAR — Finanzas Compartidas para el Hogar

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Zero AI](https://img.shields.io/badge/Architecture-Zero--AI%20Deterministic-27AD75?style=for-the-badge&logo=fastapi&logoColor=white)

<p align="center">
  <strong>Gestión transparente, colaborativa y equitativa de gastos del hogar, presupuestos por categorías y liquidación de saldos entre convivientes.</strong>
</p>

[Demostración](#🚀-instalación-y-ejecución-local) •
[Características](#✨-características-principales) •
[Stack Tecnológico](#🛠️-stack-tecnológico) •
[Estructura](#📂-estructura-del-proyecto) •
[Principios de Diseño](#🎨-principios-de-diseño-y-ux)

</div>

---

## 📖 Tabla de Contenidos

- [Acerca del Proyecto](#🏠-acerca-del-proyecto)
- [Características Principales](#✨-características-principales)
- [Stack Tecnológico](#🛠️-stack-tecnológico)
- [Estructura del Proyecto](#📂-estructura-del-proyecto)
- [Instalación y Ejecución Local](#🚀-instalación-y-ejecución-local)
- [Variables de Entorno](#🔑-variables-de-entorno)
- [Scripts Disponibles](#📜-scripts-disponibles)
- [Principios de Diseño y UX](#🎨-principios-de-diseño-y-ux)
- [Sistema de Memoria y Contexto (AI Agents)](#🧠-sistema-de-memoria-y-contexto-ai-agents)
- [Licencia](#📄-licencia)

---

## 🏠 Acerca del Proyecto

**KOPAR** es una aplicación web *fintech* diseñada específicamente para parejas, *roommates* y familias que comparten gastos domésticos. Elimina la fricción en las cuentas compartidas mediante:

- **Visibilidad en tiempo real:** Sabes exactamente cuánto debes, cuánto te deben y el balance neto consolidado.
- **División inteligente y justa:** Opciones de repartición equitativa (50/50 o entre partes iguales) o proporcional a los ingresos reales de cada conviviente.
- **Presupuestos y límites mensuales:** Monitoreo visual de gastos categorizados con alertas deterministas de sobrecosto.
- **Liquidación sin estrés:** Algoritmo *Min-Cash-Flow* para minimizar el número de transferencias entre integrantes.
- **Arquitectura Zero-AI y Backend Híbrido:** 100% lógica determinista en el cliente combinada con Supabase para sincronización de datos y autenticación, logrando baja latencia, cero alucinaciones y cero costos de inferencia.

---

## ✨ Características Principales

### 📊 Gestión de Balances y Gastos
- **Balance Card Dinámico:** Muestra el desglose de "Debes", "Te deben" y el saldo neto, con portada personalizable para el hogar.
- **Registro Rápido de Gastos con Autocategorización:** Agrega compras con reconocimiento instantáneo de categorías por palabras clave y comercios frecuentes.
- **Detector Heurístico de Duplicados:** Alertas reactivas para evitar registrar dos veces el mismo gasto.
- **Parser de Comprobantes Bancarios:** Extracción automática de montos, fechas y conceptos de notificaciones de Bancolombia, Nequi, Daviplata y PSE.
- **División Flexible:** Soporta división equitativa (*50/50*, *1/N*) o porcentaje personalizado.
- **Feed de Actividad:** Historial de transacciones con búsqueda en tiempo real, filtros por categoría y badges de estado.

### 🎯 Presupuestos y Categorías
- **Gráficos Interactivos:** Visualización con Recharts de gastos actuales vs. topes presupuestarios por categoría.
- **Diagnóstico y Alertas Financieras:** Reglas deterministas de advertencia al alcanzar el 80% y 100% del límite de cada categoría.
- **Personalización:** Creación y ajuste de límites presupuestarios y categorías del hogar.

### 🤝 Gestión de Hogar y Liquidaciones
- **Perfiles y Roles:** 1 Administrador por hogar con miembros activos y pendientes de invitación mediante código único.
- **Módulo de Liquidación (Min-Cash-Flow):** Algoritmo de minimización de transacciones para saldar todas las deudas en el menor número de pagos posibles.
- **Sincronización con Supabase:** Datos almacenados y protegidos en la nube (PostgreSQL + RLS) con autenticación oficial.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
|---|---|---|
| **Frontend Core** | [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) | Tipado estricto y componentes funcionales modernos. |
| **Backend & Auth** | [Supabase](https://supabase.com/) | Base de datos PostgreSQL, autenticación y políticas RLS. |
| **Bundler & Dev Server** | [Vite 6](https://vite.dev/) | HMR ultrarrápido y optimización de compilación. |
| **Estilos & UI** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) | Estilizado atómico con tokens de diseño centralizados. |
| **Animaciones** | [Motion](https://motion.dev/) (`motion/react`) | Transiciones fluidas y micro-interacciones. |
| **Iconografía** | [Lucide React](https://lucide.dev/) | Iconos SVG ligeros, limpios y consistentes. |
| **Gráficos & Métricas** | [Recharts 3](https://recharts.org/) | Gráficos de barras y distribución de presupuestos. |
| **Lógica Financiera** | *Zero-AI Local Engines* | Algoritmos Min-Cash-Flow, Trie/Keyword Matcher y Regex Parsers. |

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
├── supabase/              # Configuración y esquemas de base de datos
│   └── schema.sql         # Script DDL con tablas, constraints y políticas RLS
├── src/
│   ├── components/        # Componentes modulares de la interfaz
│   │   ├── auth/          # Autenticación, bienvenida y OnboardingWizard
│   │   ├── budget/        # Componentes específicos del presupuesto
│   │   ├── modals/        # Modales (AddExpense, Settle, Invite, EditBudget, etc.)
│   │   ├── tabs/          # Pestañas principales (Actividad, Presupuesto, Hogar)
│   │   └── ui/            # Elementos base de UI
│   ├── constants/         # Tokens de tema y valores estáticos
│   ├── lib/               # Clientes de terceros (ej. supabase.ts)
│   ├── services/          # Servicios externos (ej. trm.ts)
│   ├── utils/             # Utilidades deterministas (Min-Cash-Flow, Parser, etc.)
│   ├── data.ts            # Datos iniciales y mocks tipados
│   ├── types.ts           # Definición de interfaces y tipos TypeScript
│   ├── App.tsx            # Componente raíz y control de estado
│   ├── index.css          # Importaciones de Tailwind CSS v4
│   └── main.tsx           # Punto de entrada de React 19
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18.0 o superior recomendada)
- Gestor de paquetes: `npm`, `pnpm` o `bun`
- Proyecto en Supabase (Base de datos y Autenticación)

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

3. **Configurar Supabase:**
   Copia el archivo `.env.example` a `.env.local` y agrega tus credenciales:
   ```bash
   VITE_SUPABASE_URL="tu_supabase_url"
   VITE_SUPABASE_ANON_KEY="tu_supabase_anon_key"
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 🔑 Variables de Entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `VITE_SUPABASE_URL` | Sí | URL del proyecto de Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Sí | Clave anónima pública de Supabase. |
| `APP_URL` | Opcional | URL base de la aplicación. |

---

## 📜 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

- `npm run dev`: Inicia el servidor de desarrollo con Vite.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Previsualiza localmente el *build* de producción.
- `npm run lint`: Ejecuta el verificador de tipos de TypeScript.

---

## 🎨 Principios de Diseño y UX

- **Estética Light Mode & Sin Sombras:** Todo el diseño se construye sobre fondos limpios (`#ffffff` y `#f7f8f9`), delimitado exclusivamente por bordes de 1px (`#dedfe2`).
- **Botones en Píldora (`rounded-full`):** Todas las acciones interactivas y botones utilizan esquinas completamente redondeadas.
- **Azul Coinbase (`#0052ff`):** Empleado con estricta jerarquía para botones de acción primaria (CTA), tabs activos y acentos clave.
- **Formato Monetario Colombiano:** Separadores de miles con punto (`$250.000`) sin decimales superfluos.
- **Regla de 1 Administrador:** Cada hogar posee exactamente un usuario con rol `admin`.

---

## 🧠 Sistema de Memoria y Contexto (AI Agents)

Este repositorio implementa un sistema de memoria estructurada para agentes de Inteligencia Artificial:

- [`AGENTS.md`](./AGENTS.md): Centro de control e instrucciones maestras del proyecto.
- [`contexto/`](./contexto/): Documentos base de diseño, reglas de negocio y decisiones consolidadas.
- [`state/`](./state/): Estado actual (`current-state.md`), backlog (`roadmap-and-pending.md`) y bloqueos (`blockers.md`).
- [`skills/actualizar-contexto.md`](./skills/actualizar-contexto.md): Protocolo obligatorio de cierre y sincronización de memoria tras cada hito.

---

## 📄 Licencia

Este proyecto es privado y de uso educativo para el curso de AI para UXers. Todos los derechos reservados.
