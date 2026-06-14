import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const COUNT_MODEL = 'claude-haiku-4-5-20251001';

async function countRaw(system, userContent) {
  const params = {
    model: COUNT_MODEL,
    messages: [{ role: 'user', content: userContent }],
  };
  if (system) params.system = system;
  const res = await client.messages.countTokens(params);
  return res.input_tokens;
}

export async function countContextBreakdown(system, contextFiles) {
  const breakdown = {};
  const baseCount = await countRaw(system, '');

  for (const file of contextFiles) {
    const withFile = await countRaw(system, file.content);
    breakdown[file.path] = withFile - baseCount;
  }

  return breakdown;
}

export async function countPromptTokens(system, userContent) {
  return countRaw(system, userContent);
}
