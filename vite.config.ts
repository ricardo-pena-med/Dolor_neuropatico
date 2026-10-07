import { defineConfig, loadEnv } from 'vite';
import { geminiPlugin } from './server/geminiPlugin';

export default defineConfig(({ mode }) => ({
  plugins: [geminiPlugin(loadEnv(mode, process.cwd(), 'GEMINI_'))],
}));
