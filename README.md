# React App

A React application built with TypeScript, Vite, Redux Toolkit, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or later)
- npm or yarn

### Installation

1. Clone the repository
Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

**Environment Setup**:

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Edit .env.local with your actual values
   ```

4. Start development server:
   ```bash
   npm run start
   # or
   yarn start
   ```

## 🔧 Environment Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env.local` and configure:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com

# Application Environment
VITE_APP_ENV=development

# Debug Mode
VITE_DEBUG_MODE=true
```

## 📦 Project Structure

```
src/
├── components/     # Reusable components
├── constants/      # App constants and API configs
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── redux/         # Redux store and slices
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  }
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
