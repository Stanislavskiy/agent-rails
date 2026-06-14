import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(db.products);
});

// BUG 2: missing price > 0 check — negative price is accepted (e.g. price: -5)
router.post('/', async (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'name and price are required' });
  }
  const product = { id: db.nextId.products++, name, price };
  await Promise.resolve(); // simulates async DB write
  db.products.push(product);
  res.status(201).json(product);
});

export default router;
