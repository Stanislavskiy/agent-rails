export const PLACEHOLDERS = [
  {
    token: '[PROJECT_NAME]',
    type: 'input',
    message: 'Project name:',
    validate: (v) => v.trim().length > 0 || 'Required',
  },
  {
    token: '[web-app | api | monorepo | data-pipeline | library]',
    type: 'select',
    message: 'Project type:',
    choices: ['web-app', 'api', 'monorepo', 'data-pipeline', 'library'],
  },
  {
    token: '[LANG@VERSION]',
    type: 'input',
    message: 'Primary language and version (e.g. typescript@5.4):',
    validate: (v) => v.trim().length > 0 || 'Required',
  },
  {
    token: '[FRAMEWORK@VERSION]',
    type: 'input',
    message: 'Primary framework and version (e.g. next@14, or "none"):',
  },
  {
    token: '[cloud-provider]',
    type: 'input',
    message: 'Cloud provider (e.g. aws, gcp, or "none"):',
  },
  {
    token: '[container/orchestration]',
    type: 'input',
    message: 'Container/orchestration (e.g. kubernetes, ecs, or "none"):',
  },
  {
    token: '[db]',
    type: 'input',
    message: 'Database (e.g. postgres, mongodb, or "none"):',
  },
  {
    token: '[main | develop | master]',
    type: 'input',
    message: 'Default branch (e.g. main, develop, master):',
    validate: (v) => v.trim().length > 0 || 'Required',
  },
];

export function replacePlaceholders(content, values) {
  let result = content;
  for (const [token, value] of values) {
    result = result.replaceAll(token, value);
  }
  return result;
}
