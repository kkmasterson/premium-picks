import { buildApi } from './app.js';

const app = await buildApi();
const port = Number(process.env.PORT ?? 8787);
await app.listen({ port, host: process.env.HOST ?? '127.0.0.1' });
