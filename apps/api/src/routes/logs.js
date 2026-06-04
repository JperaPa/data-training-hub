import fs from 'fs';
import path from 'path';
import express from 'express';

const router = express.Router();
const ROOT = process.cwd();
const logsDir = path.join(ROOT, 'logs');

router.get('/dates', (req, res) => {
  const sessionsDir = path.join(logsDir, 'sessions');
  const files = fs.readdirSync(sessionsDir);
  const dates = files
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
  res.json(dates);
});

router.get('/:date', (req, res) => {
  const { date } = req.params;

  const read = (folder, ext) => {
    const p = path.join(logsDir, folder, `${date}.${ext}`);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  };

  const transcript = read('transcripts', 'txt');
  const session = read('sessions', 'md');
  const reflection = read('reflections', 'md');
  const sop = read('sop-checks', 'md');

  let progress = null;
  const progressPath = path.join(logsDir, 'progress', `${date}.json`);
  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  }

  res.json({
    transcript,
    session,
    reflection,
    progress,
    sop
  });
});

export default router;
