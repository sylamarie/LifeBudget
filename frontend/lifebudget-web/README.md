# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Contenido sugerido (simple, honesto):

```md
# LifeBudget Frontend

This is the frontend for the LifeBudget application.

## Purpose
The frontend provides a simple and human-friendly interface for users to:
- Track income and expenses
- View monthly summaries
- Understand spending habits

This frontend is under active development.

---

## Tech Stack
- Vite
- JavaScript
- HTML / CSS

---

## Development Status
- Initial project setup completed
- UI and components are in early planning stage
- Authentication integration planned for next sprints

---

## How to Run

```bash
npm install
npm run dev
Runs on:
http://localhost:5173