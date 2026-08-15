import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE_PATH se inyecta en el workflow de GitHub Actions
// con el nombre del repositorio, p. ej. "/mi-repo/"
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
});
