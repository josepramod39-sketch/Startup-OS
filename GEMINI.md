# Startup Lab — Gemini CLI

Refer to @agents.md for full directives, file formats, and command specifications.

## Gemini CLI Usage

Startup Lab commands are invoked through natural language. Tell Gemini what you want to do:

```
"Run the startup vision workflow"
"Help me fill in the lean canvas"
"Create a new user persona"
"Generate my pitch deck"
"Export my startup plan"
```

Gemini will read `agents.md` and follow the appropriate workflow for each request.

## File Context

Use `@` to give Gemini context from existing files:

```
@startup/startup-overview.md — your startup foundation
@startup/lean-canvas/lean-canvas.md — your business model
@startup/personas/personas.json — your customer personas
@agents.md — full workflow instructions
```

## MCP Tools (Optional)

If `.gemini/settings.json` configures MCP servers, Gemini can use structured tools
for reading and writing startup files. Otherwise, standard file read/write applies.
