import { buildApi } from './app.js';
import { databasePool } from '../db.js';
import { scheduleReader } from './schedule.js';
import { freeDataReaders } from './free-data.js';

const pool = databasePool();
const app = await buildApi({ readSchedule: scheduleReader(pool), freeData: freeDataReaders(pool) });
app.addHook('onClose', async () => { await pool?.end(); });
const port = Number(process.env.PORT ?? 8787);
await app.listen({ port, host: process.env.HOST ?? '127.0.0.1' });
