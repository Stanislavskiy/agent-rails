import { input, select } from '@inquirer/prompts';

export async function promptForValues(placeholders) {
  const values = new Map();
  for (const p of placeholders) {
    if (p.type === 'select') {
      const answer = await select({
        message: p.message,
        choices: p.choices.map((c) => ({ name: c, value: c })),
        default: p.default,
      });
      values.set(p.token, answer);
    } else {
      const answer = await input({
        message: p.message,
        validate: p.validate,
      });
      values.set(p.token, answer.trim());
    }
  }
  return values;
}
