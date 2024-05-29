import express from 'express';
import chalk from 'chalk';
import 'dotenv/config';

const { DEV } = import.meta.env;
const SERVER_PORT = parseInt(process.env.SERVER_PORT ?? '8000', 10);
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'http://localhost';
const app = express();

// Application-level middlewares.
app.use(express.json());

// Routes.
app.get('/', (_, res) => {
  res.json({ message: 'Hello World!' });
});

// Server.
const _server = app.listen(SERVER_PORT, (): void => {
  console.info(
    chalk.yellow(
      `Server is running on ${
        DEV ? 'http://localhost' : SERVER_HOSTNAME
      }:${SERVER_PORT.toString()}...`,
    ),
  );
});

// Fix: properly close existing server prior to HMR (sources: https://github.com/vitest-dev/vitest/issues/2334, https://github.com/vitejs/vite/issues/9539).
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    _server.close();
  });
}

// Change log below to see HRM in action...
console.log('hi!');
