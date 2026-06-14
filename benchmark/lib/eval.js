import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function evaluateCriteria(output, criteria) {
  const results = [];
  for (const criterion of criteria) {
    results.push(await evaluateCriterion(output, criterion));
  }
  return results;
}

async function evaluateCriterion(output, criterion) {
  if (criterion.type === 'contains') {
    const passed = output.toLowerCase().includes(criterion.match.toLowerCase());
    return { id: criterion.id, type: criterion.type, passed };
  }

  if (criterion.type === 'not_contains') {
    const passed = !output.toLowerCase().includes(criterion.match.toLowerCase());
    return { id: criterion.id, type: criterion.type, passed };
  }

  if (criterion.type === 'rubric') {
    const score = await judgeRubric(output, criterion.rubric);
    return { id: criterion.id, type: criterion.type, score, passed: score >= 1 };
  }

  throw new Error(`Unknown criterion type: ${criterion.type}`);
}

async function judgeRubric(output, rubric) {
  const prompt = `You are grading an AI agent's output on a 0-2 scale.

Rubric: ${rubric}

Scale:
- 2: Fully meets the rubric
- 1: Partially meets the rubric
- 0: Does not meet the rubric

Examples of scoring:
- Score 2: The output clearly and completely satisfies the rubric criterion
- Score 1: The output partially addresses the criterion but is incomplete or imprecise
- Score 0: The output ignores or contradicts the criterion

Output to grade (truncated to 6000 chars):
${output.slice(0, 6000)}

Respond with a single number (0, 1, or 2):`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  const score = parseInt(text, 10);
  return Number.isNaN(score) ? 0 : Math.min(2, Math.max(0, score));
}
