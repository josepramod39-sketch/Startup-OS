# Startup Lab — OpenAI Codex / Generic Agents

Refer to @agents.md for full directives, file formats, and command specifications.

## Codex Usage

Startup Lab commands are invoked through natural language. Tell Codex what you want to do:

```
"I want to define my startup vision"
"Walk me through the lean canvas"
"Help me build a user persona"
"Generate a pitch deck from my existing files"
"Export my full startup plan"
```

Codex will read `agents.md` and follow the appropriate workflow, asking questions
one or two at a time before writing any files.

## Important

- Always read `agents.md` before starting any workflow
- Read existing `startup/` files before writing to avoid overwriting data
- When appending personas, read `startup/personas/personas.json` first
- Follow exact file formats defined in `agents.md` — the React app parser depends on them
- Never write files based on assumptions — gather enough input from the founder first
