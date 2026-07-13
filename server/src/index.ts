import express, { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { runMigrations } from './db/migrate.js';
import { campaignsRouter } from './modules/campaigns/campaigns.routes.js';
import { ideasRouter } from './modules/ideas/ideas.routes.js';
import { AppError } from './shared/errors.js';

const PORT = 3333;

runMigrations();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/ideas', ideasRouter);
app.use('/api/campaigns', campaignsRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: err.issues.map((i) => i.message).join('; ') },
    });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
