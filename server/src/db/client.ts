import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type * as NodeSqlite from 'node:sqlite';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite') as typeof NodeSqlite;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH ?? path.join(__dirname, '..', '..', 'data', 'conteudo.db');

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON');
if (dbPath !== ':memory:') {
  db.exec('PRAGMA journal_mode = WAL');
}
