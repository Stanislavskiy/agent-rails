# Playbook: [Name]
> Reusable sub-task procedure. Reference from a routine or prompt step:
> `Actions: follow .agents/playbooks/[name].md`

## When to use
[Describe the situation where this playbook applies — be specific enough that the agent
can recognize the trigger without ambiguity.]

## Steps
1. [step — concrete and project-specific]
2. [step]
3. [step]

## Output
[What this playbook produces — file, artifact, or observable result]

---

## After creating this playbook

Wire it up so agents find it automatically — choose one or both:

- **Routine step**: add `follow .agents/playbooks/[name].md` to the relevant `Actions:` line in `.agents/routines/[routine].md`
- **Principle**: add `When [doing X], follow .agents/playbooks/[name].md` to the relevant `.agents/context/principles/[file].md`

Without this, the agent will only use the playbook if the developer references it explicitly in the task prompt.

> **Stepping stone note:** Once this playbook is stable, consider implementing it as a
> native agent tool (MCP tool, slash command, function_calling schema). The prose above
> becomes the spec; the tool becomes the deterministic implementation.
