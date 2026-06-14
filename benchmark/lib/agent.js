import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM = `You are an agent working in a software project. The following files are your loaded context for this task. Follow the instructions carefully and produce only the requested output.`;

export async function runAgent(contextText, taskPrompt, model = 'claude-sonnet-4-6') {
  const userContent = `${contextText}\n\n---\n\n${taskPrompt}`;

  const start = Date.now();
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0,
    system: SYSTEM,
    messages: [{ role: 'user', content: userContent }],
  });
  const latency_ms = Date.now() - start;

  return {
    content: response.content[0].text,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
    stop_reason: response.stop_reason,
    latency_ms,
  };
}

export { SYSTEM };
