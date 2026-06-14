import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let base;

before(() => {
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

describe('GET /users', () => {
  it('returns all users', async () => {
    const res = await fetch(`${base}/users`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body) && body.length >= 2);
  });
});

describe('GET /users/:id', () => {
  it('returns user by id', async () => {
    const res = await fetch(`${base}/users/1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.id, 1);
  });

  it('returns 404 for unknown id', async () => {
    const res = await fetch(`${base}/users/999`);
    assert.equal(res.status, 404);
  });
});

describe('POST /users', () => {
  it('creates a user', async () => {
    const res = await fetch(`${base}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Charlie', email: 'charlie@example.com' }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.name, 'Charlie');
  });

  it('rejects whitespace-only name', async () => {
    const res = await fetch(`${base}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '   ', email: 'x@example.com' }),
    });
    assert.equal(res.status, 400);
  });
});

describe('GET /products', () => {
  it('returns all products', async () => {
    const res = await fetch(`${base}/products`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body) && body.length >= 2);
  });
});

describe('POST /products', () => {
  it('rejects negative price', async () => {
    const res = await fetch(`${base}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bad Product', price: -5 }),
    });
    assert.equal(res.status, 400);
  });
});
