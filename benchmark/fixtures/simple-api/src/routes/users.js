import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(db.users);
});

router.get('/:id', (req, res) => {
  const user = db.users.find((u) => u.id === parseInt(req.params.id, 10));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !name.trim() || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const user = { id: db.nextId.users++, name: name.trim(), email };
  db.users.push(user);
  res.status(201).json(user);
});

export default router;
