/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import { resolve, join } from 'path';
import { node } from './rollup.config.ts';
import 'dotenv/config';

const DEV = process.env.NODE_ENV === 'development';
const CLIENT_PORT = parseInt(process.env.CLIENT_APP_PORT ?? '4173', 10);
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'http://localhost';
const SERVER_PORT = process.env.SERVER_PORT ?? '8000';

// Define chrome as default browser for the dev server.
const opsys = process.platform;
// windows
if (opsys === 'win32') process.env.BROWSER = 'chrome';
// macOS
if (opsys === 'darwin') process.env.BROWSER = '/Applications/Google Chrome.app';

console.log(`${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT}`);

export default defineConfig({
  base: '/',
  root: resolve(__dirname, './'),
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    minify: true,
    cssMinify: true,
    // Vite entry point (only if no index.html file at project's root folder.)
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.ts'),
    },
  },
  preview: {
    // Vite client-server.
    port: CLIENT_PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': {
        target: `${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(join(__dirname, 'src')),
      '@controllers': resolve(join(__dirname, 'src', 'controllers')),
      '@data': resolve(join(__dirname, 'src', 'data')),
      '@middlewares': resolve(join(__dirname, 'src', 'middlewares')),
      '@routers': resolve(join(__dirname, 'src', 'routers')),
      '@utils': resolve(join(__dirname, 'src', 'utils')),
    },
  },
  server: {
    // Vite client-server.
    port: CLIENT_PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': `http://localhost:${SERVER_PORT}`,
    },
  },
  // Vitest extented config.
  test: {
    // Append test files or folders to be excluded during test run.
    exclude: [...configDefaults.exclude],
    // Disable multi-threading for API testing (see ref: https://adequatica.medium.com/api-testing-with-vitest-391697942527).
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },

  // customized rollup-plugin-node-externals (see ref: https://dev.to/rxliuli/developing-and-building-nodejs-applications-with-vite-311n)
  plugins: [node()],
});
