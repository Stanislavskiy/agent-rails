import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(db.users);
});

// BUG 1: no null check before accessing .name — crashes with TypeError when user not found
router.get('/:id', (req, res) => {
  const user = db.users.find((u) => u.id === parseInt(req.params.id, 10));
  res.json(user.name);
});

// BUG 3: whitespace-only name ("   ") passes validation — name.trim() check is missing
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const user = { id: db.nextId.users++, name, email };
  db.users.push(user);
  res.status(201).json(user);
});

export default router;
