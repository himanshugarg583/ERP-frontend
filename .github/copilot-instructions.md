# Copilot Instructions for ERP-frontend

## Project Overview
This is a React-based ERP frontend for school management, using Vite and Tailwind CSS. The codebase is modular, with feature-specific folders under `src/components/` and context/state management in `src/context/` and `src/store/`.

## Architecture & Patterns
- **Routing:** Centralized in `src/Routes.jsx`. Route protection is handled via `src/components/ProtectedRoute.jsx`.
- **State Management:** Uses React Context (`src/context/`) and Redux slices (`src/store/slices/`).
- **API Methods:** All HTTP requests are abstracted in `src/helper/requests-method/`. Use these helpers for backend communication.
- **UI Components:** Organized by feature (e.g., `academics/`, `AdminDash/`, `attendance/`). Shared/reusable components are in `comman_components/` and `common/`.
- **Styling:** Tailwind CSS is configured in `tailwind.config.js`. Component-level styles are in `src/styles/`.

## Developer Workflows
- **Build:** Use `npm run build` (see `vite.config.js`).
- **Dev Server:** Use `npm run dev` to start Vite locally.
- **No formal test suite detected.**
- **Debugging:** Use browser dev tools and React DevTools. Redux state can be inspected via Redux DevTools.

## Conventions
- **Component Naming:** PascalCase for components, camelCase for functions/variables.
- **File Organization:** Feature-based folders. Shared logic/components are in `comman_components/` and `common/`.
- **API Usage:** Always use helpers from `src/helper/requests-method/` for backend calls.
- **Protected Routes:** Use `ProtectedRoute.jsx` for authentication/authorization checks.

## Integration Points
- **External Libraries:**
  - React, Redux, Vite, Tailwind CSS
  - Charting: Various chart components in `AdminDash/`
- **Backend:** All API calls are abstracted; update endpoints in `src/helper/requests-method/` as needed.

## Key Files & Directories
- `src/Routes.jsx` – Main routing logic
- `src/context/` – Auth and theme context
- `src/store/` – Redux store and slices
- `src/helper/requests-method/` – API helpers
- `src/components/` – Feature and shared UI components
- `vite.config.js`, `tailwind.config.js` – Build and styling config

## Example Patterns
- To add a new feature, create a folder in `src/components/` and follow the structure of existing modules.
- For new API calls, add methods to `src/helper/requests-method/apiMethods.js` and use them in components.
- For protected pages, wrap routes with `ProtectedRoute`.

---
For questions or unclear conventions, review similar files or ask for clarification.
