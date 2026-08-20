# BixciBox Development Standards

**Document Status:** Draft
**Phase:** 0.6 - Development Standards
**Parent Document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

# 1. Purpose

This document defines the development standards used while building BixciBox.

Its purpose is to keep the codebase:

* Understandable
* Consistent
* Testable
* Maintainable
* Documented
* Safe to change

These standards should guide day-to-day development decisions.

They are not intended to make development rigid or bureaucratic. They exist to prevent the project from becoming difficult to understand as it grows.

---

# 2. General Development Principles

BixciBox development should follow these principles:

* Prefer simple solutions over clever solutions.
* Keep modules focused on one responsibility.
* Avoid duplicating business logic.
* Keep provider-specific logic isolated.
* Keep UI code separate from core application logic where practical.
* Preserve data integrity over convenience.
* Write code that can be understood later without relying on memory.
* Document important architectural decisions.
* Add tests for important behavior and bug fixes.
* Avoid introducing dependencies without a clear reason.

---

# 3. Repository Structure

The repository should remain organized by responsibility.

A high-level structure may resemble:

```text
/
+-- src/
+-- server/
+-- tests/
+-- docs/
+-- public/
+-- scripts/
+-- README.md
+-- package.json
```

The exact structure may evolve as the application architecture becomes more concrete.

Documentation should remain under:

```text
docs/
```

Important project-wide planning and architecture documents should not be scattered throughout unrelated folders.

---

# 4. Source Code Organization

Source code should be grouped by responsibility rather than allowed to accumulate in large general-purpose files.

Examples of major areas may include:

* Projects
* Characters
* Scenes
* Assets
* Prompts
* Generation
* Providers
* Persistence
* Shared UI components
* Utilities

Large files should be split when they begin handling unrelated responsibilities.

A file should ideally have one clear reason to change.

---

# 5. Naming Conventions

Names should describe intent clearly.

Avoid vague names such as:

* `data`
* `thing`
* `stuff`
* `temp`
* `misc`
* `helper2`
* `newVersion`

Prefer names such as:

* `projectService`
* `characterRepository`
* `generationRequest`
* `comfyUiProvider`
* `assetRegistry`

Names should remain consistent across the codebase.

If the project uses JavaScript or TypeScript:

* Variables and functions should use `camelCase`.
* Components and classes should use `PascalCase`.
* Constants may use `UPPER_SNAKE_CASE` where appropriate.
* File naming should follow one consistent convention within each area.

---

# 6. Function and Module Design

Functions should be small enough to understand without excessive mental bookkeeping.

A function should generally perform one clear task.

Avoid functions that:

* Read project files
* Modify UI state
* Call ComfyUI
* Create assets
* Write logs

all in one place.

Those responsibilities should be separated.

Modules should expose clear interfaces and hide internal implementation details where practical.

---

# 7. UI Standards

The UI should primarily work with BixciBox concepts rather than provider-specific details.

UI components should not directly call ComfyUI APIs.

The UI should communicate with the application layer through defined functions or services.

Reusable interface patterns should be implemented as reusable components rather than repeatedly recreated.

User-facing error messages should be clear and actionable.

Raw technical exceptions should not be shown to the user unless they are explicitly viewing diagnostic information.

---

# 8. Provider Integration Standards

Provider-specific code must remain isolated from general BixciBox logic.

For example:

* ComfyUI workflow JSON handling belongs in the ComfyUI provider.
* ComfyUI queue IDs belong in the ComfyUI provider.
* ComfyUI endpoint details belong in the ComfyUI provider.

General BixciBox concepts such as:

* Scene
* Prompt
* Take
* Asset
* Character

must not depend directly on ComfyUI-specific types or APIs.

This rule is intended to make future provider support possible without rewriting the Application Core.

---

# 9. Persistence Standards

Project persistence should prioritize safety and recoverability.

Persistence code should:

* Preserve stable entity IDs.
* Avoid silent data loss.
* Validate loaded project data.
* Handle missing or invalid data gracefully.
* Avoid partially overwriting a valid project with corrupted data.
* Preserve version information needed for future migrations.

Changes to persistent project structure should be documented.

Significant project format changes should include a migration strategy before release.

---

# 10. Error Handling

Errors should be handled deliberately.

Code should not silently ignore failures that affect project state.

Errors should be categorized where practical.

Examples include:

* Validation errors
* File-system errors
* Persistence errors
* Provider connection errors
* Generation failures
* Configuration errors

The application should convert low-level failures into meaningful higher-level errors.

For example:

A network connection refusal should eventually become a message such as:

> ComfyUI is unavailable.

rather than exposing a raw stack trace to the creator.

---

# 11. Logging

Important technical events should be logged.

Examples include:

* Application startup
* Project creation
* Project open
* Project save
* Project load failure
* Provider connection attempts
* Generation submission
* Generation completion
* Generation failure
* File-system errors
* Unexpected exceptions

Logs should contain enough information to diagnose problems without becoming unnecessarily noisy.

Sensitive information should not be written to logs.

---

# 12. Testing Standards

Testing should focus on behavior that would be costly or frustrating to break.

At minimum, important tests should cover:

* Project creation
* Project save/load
* Entity ID preservation
* Scene ordering
* Character persistence
* Asset registration
* Prompt persistence
* Generation request state
* Take approval/rejection
* Provider failure handling

Critical project-state behavior should not rely only on manual testing.

---

# 13. Unit Tests

Unit tests should be used for isolated logic.

Examples include:

* Validation functions
* Project transformations
* Scene ordering logic
* Status transitions
* Provider request mapping
* Utility functions

Unit tests should be fast and deterministic where practical.

---

# 14. Integration Tests

Integration tests should verify that major components work together.

Examples include:

* Saving and reopening a project
* Registering an asset and recovering it after reload
* Submitting a generation request through the provider abstraction
* Converting a provider result into a Take and Asset

External providers may be mocked where necessary for reliable automated tests.

---

# 15. Bug Fix Testing Rule

When a meaningful bug is fixed, add a regression test when practical.

The test should demonstrate the behavior that previously failed.

This helps prevent the same bug from returning later.

---

# 16. Manual Testing

Manual testing remains important for:

* UI behavior
* Visual layout
* Drag-and-drop interactions
* File selection
* Provider connection behavior
* Generation workflows
* Error messages

Manual testing should supplement automated testing, not replace it for critical logic.

---

# 17. Code Review Standard

Before considering a meaningful change complete, review it for:

* Correctness
* Readability
* Scope
* Error handling
* Test coverage
* Documentation impact
* Unnecessary duplication
* Architectural boundary violations

Even when development is performed by one person, a deliberate review pass should occur before the change is treated as finished.

---

# 18. Dependency Standard

New third-party dependencies should be added only when they provide clear value.

Before adding a dependency, consider:

* What problem does it solve?
* Can existing tools solve the problem adequately?
* Is the library actively maintained?
* Is the dependency stable?
* Does it significantly increase application size or complexity?
* Does it introduce licensing concerns?
* Would replacing it later be difficult?

Avoid adding libraries for very small tasks that can be implemented safely and clearly in a few lines.

---

# 19. Documentation Standards

Documentation is part of the development process.

Documentation should be updated when changes affect:

* Product scope
* Architecture
* Persistent data
* Provider behavior
* Setup instructions
* Development workflow
* Major feature behavior

The Project Compass should remain a high-level navigation and status document.

Detailed information belongs in the appropriate supporting document.

---

# 20. Architecture Decision Records

Significant technical decisions should be documented using Architecture Decision Records.

An ADR should be created when a decision:

* Has long-term architectural impact
* Is difficult to reverse
* Affects multiple modules
* Introduces an important dependency
* Changes persistence strategy
* Changes provider architecture
* Changes application packaging
* Changes a previously accepted architecture decision

ADRs should be stored under:

```text
docs/decisions/
```

A later ADR should supersede an earlier one rather than rewriting historical reasoning.

---

# 21. Git Standards

Source control should preserve a readable history.

Commits should represent coherent changes where practical.

Commit messages should briefly describe what changed.

Examples:

```text
Add project persistence service
Add character reference management
Fix scene ordering after deletion
Document ComfyUI provider boundary
```

Avoid unclear messages such as:

```text
stuff
update
changes
fix
more work
```

Large unrelated changes should not be bundled into one commit unless there is a strong reason.

---

# 22. Branching

For small, low-risk changes, direct work on the primary development branch may be acceptable during early development.

For larger or riskier changes, use a separate branch.

Examples include:

* Persistence redesign
* Provider integration
* Major UI restructuring
* Project-format migration
* Large refactoring

The branching strategy may become more formal as the project grows.

---

# 23. Definition of Done for a Development Task

A development task should not be considered complete merely because the code runs once.

A meaningful task is complete when, where applicable:

* The intended behavior works.
* Relevant errors are handled.
* Existing behavior is not broken.
* Tests pass.
* New tests are added where appropriate.
* Documentation is updated if necessary.
* No temporary debug code remains.
* No known critical issue is being silently ignored.
* The change fits the current architecture and roadmap.

---

# 24. Temporary and Experimental Code

Experimental code is allowed when needed to answer technical questions.

However, experimental code should be clearly identified.

It should either:

* Be removed after the experiment
* Be rewritten into production-quality code
* Be intentionally adopted and documented

Experimental code should not quietly become permanent architecture.

---

# 25. Comments

Comments should explain why something is done when the reason is not obvious.

Comments should not merely restate the code.

Useful:

```js
// Preserve the old asset ID so existing scene references remain valid.
```

Less useful:

```js
// Set asset ID.
asset.id = id;
```

Complex workarounds should include enough explanation to understand why they exist.

---

# 26. Configuration and Secrets

Application configuration should remain separate from source code where practical.

Credentials, API keys, tokens, or secrets must not be committed to the repository.

Local configuration files containing secrets should be excluded through `.gitignore` or another appropriate mechanism.

Example configuration may be documented using safe placeholder values.

---

# 27. Security Basics

Even though Version 1 is local-first, basic security practices still apply.

BixciBox should:

* Validate file paths.
* Avoid executing arbitrary project content.
* Treat imported files as untrusted input.
* Avoid exposing local services unnecessarily.
* Keep secrets out of logs.
* Avoid storing credentials directly inside project files unless specifically designed and protected.

More advanced security requirements may be added if cloud or collaboration features are introduced later.

---

# 28. Performance Standards

Performance optimization should be driven by observed problems rather than speculation.

However, BixciBox should avoid obviously wasteful behavior such as:

* Reloading entire projects unnecessarily
* Duplicating large asset files without reason
* Blocking the UI during generation
* Recomputing expensive data repeatedly when a simple cache is appropriate

Correctness and maintainability should come before premature optimization.

---

# 29. Refactoring Rule

Refactoring is encouraged when it improves clarity or reduces technical debt.

However, refactoring should not become an excuse to redesign unrelated parts of the application during feature work.

Large refactoring efforts should be treated as deliberate development tasks.

---

# 30. Development Standard Change Policy

These standards may evolve as BixciBox grows.

A standard should be changed when:

* It no longer fits the architecture
* It creates unnecessary friction
* A recurring development problem reveals a missing rule
* Tooling changes make the existing rule obsolete

Changes should improve clarity and maintainability rather than add ceremony for its own sake.
