# BixciBox Project Compass

**Status:** Active
**Current Development Phase:** Phase 0 - Foundation
**Purpose:** Authoritative high-level guide for the development of BixciBox

---

## 1. Purpose of This Document

The **BixciBox Project Compass** is the central reference for the development of the BixciBox application.

Its purpose is to keep development focused, intentional, and understandable as the application grows.

This document answers the questions:

- What is BixciBox?
- Who is it being built for?
- What problem is it intended to solve?
- What principles guide its design?
- What are we working on now?
- What belongs in the current version?
- What has deliberately been postponed?
- How is the application organized at a high level?
- Where is detailed documentation located?
- What important decisions have already been made?
- What questions remain unresolved?

The Project Compass is **not** intended to contain every implementation detail. Detailed information belongs in supporting documents.

When a feature idea, technical decision, or development task conflicts with this document, the conflict should be resolved before development continues.

---

# 2. Product Vision

## What BixciBox Is

**BixciBox is a creative production application for building AI-assisted visual stories and videos from initial concept through final assembly.**

It provides an organized workspace in which an individual creator can plan a production, manage characters and locations, generate and organize visual assets, create video clips, manage audio and music, assemble scenes, and ultimately export a completed production.

BixciBox is intended to coordinate specialized creative tools rather than replace all of them.

For example, ComfyUI may perform local image generation while other local applications or online services may provide video generation, speech, music, or other capabilities.

BixciBox manages the creative project that connects those tools.

---

# 3. Primary User

The initial target user is an **individual creator working primarily on a personal computer**.

The creator may be producing:

- Short AI-generated films
- Visual stories
- Music videos
- Animated story sequences
- Book trailers
- Experimental AI video projects
- Other narrative or scene-based media

The initial product is **not** being designed as a large collaborative production-management platform.

The initial development assumption is:

> **One creator, one workstation, one creative project at a time.**

Multi-user collaboration may be considered later, but it must not complicate the initial architecture unnecessarily.

---

# 4. The Problem BixciBox Solves

AI-assisted creative production is currently fragmented.

A single project may involve:

- Story notes
- Scripts
- Character descriptions
- Character reference images
- Location references
- Prompts
- Negative prompts
- ComfyUI workflows
- LoRAs and models
- Generated images
- Rejected generations
- Approved generations
- Video clips
- Sound effects
- Voice recordings
- Music
- Continuity notes
- Editing timelines
- Exported files

These materials frequently exist across unrelated applications and folders.

As a project grows, the creator must remember relationships between files manually.

For example:

- Which prompt produced an image?
- Which version of a character was used?
- Which generation belongs to Scene 8?
- Which image was approved?
- Which video clip came from that image?
- Which workflow settings were used?
- Was an image rejected because of anatomy, lighting, continuity, or some other problem?
- Where is the current version of a scene?

BixciBox should preserve these relationships.

---

# 5. Core Product Principle

## The Project Is More Important Than the Generator

An image generator produces an image.

A video generator produces a video clip.

A music generator produces music.

BixciBox manages **why those assets exist and how they belong together**.

BixciBox should know, where practical:

- Which project an asset belongs to
- Which scene requested it
- Which character or location it represents
- Which prompt created it
- Which generation settings were used
- Which source image was used
- Which workflow produced it
- Whether it was accepted or rejected
- Whether it has been superseded
- Where it belongs in the production

This principle should guide the application's architecture.

---

# 6. Guiding Development Principles

## 6.1 Local-First Where Practical

BixciBox should favor local project ownership.

Project files, metadata, reference materials, and generated assets should remain under the creator's control whenever practical.

Cloud services may be used where they provide capabilities that are difficult or impractical to run locally.

---

## 6.2 Provider Independence

BixciBox should not become permanently dependent on a single AI provider.

Image, video, speech, music, and other generation systems should eventually communicate with BixciBox through defined interfaces or provider adapters.

A service may be an important provider without becoming the architecture of BixciBox itself.

---

## 6.3 Non-Destructive Workflow

Creative experimentation creates many versions.

BixciBox should avoid silently destroying earlier work.

Where practical:

- New generations should not overwrite previous generations.
- Prompt revisions should remain traceable.
- Rejected assets may remain available until deliberately removed.
- Approved assets should be distinguishable from experimental assets.
- Important revisions should preserve history.

---

## 6.4 Traceability

Generated assets should retain enough information to understand their origin.

The creator should not have to rely on memory to determine how an important asset was produced.

---

## 6.5 Modular Architecture

Major capabilities should have clear responsibilities and boundaries.

Examples may eventually include:

- Project management
- Planning
- Asset management
- Character management
- Location management
- Image generation
- Video generation
- Audio
- Timeline
- Export

Modules should communicate through intentional interfaces rather than becoming tightly entangled.

---

## 6.6 Incremental Development

BixciBox should become useful before every planned feature exists.

Each development phase should produce a stable foundation for the next phase.

Features should not be added merely because they are interesting.

---

## 6.7 Documentation Is Part of Development

Important development knowledge must not exist only in conversations or memory.

Architecture, decisions, conventions, and significant changes should be recorded in the repository.

Updating documentation is part of completing a feature or architectural change.

---

## 6.8 Avoid Premature Complexity

BixciBox should be designed for growth without implementing every possible future requirement today.

We should distinguish between:

**Designing so something can be added later**

and

**Building that thing now.**

Those are not the same.

---

# 7. Architectural Boundary

BixciBox owns the **project and creative metadata**.

External tools own specialized generation tasks.

Conceptually:

```text
BixciBox
|
+-- Project & Asset Management
|
+-- Planning / Scene Management
|
+-- Generation Provider Layer
|   |
|   +-- ComfyUI
|   +-- Future Image Providers
|   +-- Future Video Providers
|   +-- Future Speech Providers
|
+-- Audio / Music
|
+-- Timeline
|
+-- Export
```

ComfyUI is therefore not the BixciBox backend.

It is a generation system with which BixciBox communicates.

This distinction should be preserved as the application evolves.

---

# 8. Terminology

To reduce ambiguity during development, the following terms should be used consistently.

## BixciBox Product

The application and the capabilities it is ultimately intended to provide.

Example:

> Character consistency is a planned BixciBox Product capability.

## BixciBox Development

The work involved in designing, coding, testing, documenting, and releasing the application.

Example:

> BixciBox Development is currently in Phase 0.

## BixciBox Project

A creative production created and managed inside BixciBox.

Example:

> A one-minute dragon film may be stored as a BixciBox Project.

## Asset

A file or creative resource associated with a BixciBox Project.

Examples include reference images, generated images, video clips, audio files, music, and exported media.

## Provider

An external or local system that performs a specialized generation task for BixciBox.

ComfyUI is one example of a provider.

---

# 9. Current Development Phase

## Phase 0 - Foundation

**Status:** In Progress

The purpose of Phase 0 is to define the application before substantial additional development occurs.

Phase 0 establishes:

- Product vision
- Product scope
- Architectural boundaries
- Project and data model
- Development roadmap
- Development standards
- Documentation structure
- Initial backlog
- Architecture Decision Record process

---

# 10. Phase 0 Work Items

### 0.1 Project Compass

**Status:** In Progress

Create and maintain the central development reference for BixciBox.

**Primary document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

### 0.2 Product Scope & Boundaries

**Status:** Done

Defined:

- Version 1 scope
- Minimum useful workflow
- Required Version 1 capabilities
- Explicitly deferred features
- Version 1 non-goals
- Version 1 definition of done

**Primary document:** `docs/product/scope.md`

**Key outcome:** Version 1 is focused on project organization, character consistency support, scene planning, ComfyUI still-image generation, take management, and reliable project persistence.

---

### 0.3 Architecture Overview

**Status:** Done

Defined the major components of the application and their responsibilities.

**Primary document:** `docs/architecture/overview.md`

**Key outcome:** BixciBox owns project state and creative metadata, while specialized systems such as ComfyUI operate through a provider layer rather than being treated as the application backend.

---

### 0.4 Project & Data Model

**Status:** Done

Define the major entities, ownership rules, and relationships used by a BixciBox Project.

**Primary document:** `docs/architecture/data-model.md`

**Key outcome:** A clear definition of the core BixciBox entities, what data each one owns, and how they relate to one another, without yet locking us into a specific database or storage technology.

### 0.5 Development Roadmap

**Status:** Next

Break development into ordered phases with clear goals and completion criteria.

### 0.6 Development Standards

**Status:** Not Started

Define:

- Repository structure
- Naming conventions
- Coding standards
- Testing expectations
- Documentation requirements
- Development workflow

### 0.7 Initial Backlog

**Status:** Not Started

Capture known feature ideas and categorize them as:

- **Now**
- **Next**
- **Later**
- **Maybe**

Ideas in the backlog do not automatically become requirements.

---

# 11. Current Focus

The current development focus is:

> **Complete Phase 0 before beginning another major BixciBox feature.**

Small experiments needed to answer architectural questions may still be performed.

However, experimental work must not quietly become production architecture without being documented and intentionally adopted.

---

# 12. Version 1 Scope

**Status: To Be Defined During Phase 0.2**

Version 1 should represent the first BixciBox release that provides a genuinely useful creative workflow.

The scope must be intentionally constrained.

A feature should not be included in Version 1 merely because BixciBox may eventually need it.

---

# 13. Explicitly Deferred Features

**Status: To Be Defined During Phase 0.2**

This section will contain important capabilities that are intentionally postponed.

Keeping them here allows us to preserve good ideas without allowing them to expand the current development phase.

---

# 14. High-Level Architecture

**Status: To Be Defined During Phase 0.3**

The architecture should define responsibilities before implementation details.

At minimum, Phase 0 should determine:

- Application type
- Frontend architecture
- Application/service layer
- Project storage
- Asset storage
- Metadata storage
- Provider integration
- Generation job management
- Configuration management
- Error handling strategy
- Logging
- Testing boundaries

---

# 15. Documentation Structure

The repository should eventually contain a documentation structure similar to:

```text
docs/
|
+-- BIXCIBOX_PROJECT_COMPASS.md
|
+-- product/
|   +-- vision.md
|   +-- scope.md
|   +-- roadmap.md
|   +-- feature-backlog.md
|
+-- architecture/
|   +-- overview.md
|   +-- project-structure.md
|   +-- data-model.md
|   +-- asset-management.md
|   +-- generation-pipeline.md
|   +-- provider-system.md
|
+-- decisions/
|   +-- ADR-001-...
|   +-- ADR-002-...
|
+-- development/
|   +-- setup.md
|   +-- coding-standards.md
|   +-- testing.md
|   +-- release-process.md
|
+-- features/
    +-- ...
```

The exact structure may change during Phase 0.

---

# 16. Architecture Decision Records

Consequential technical decisions should be recorded as **Architecture Decision Records (ADRs).**

An ADR should document:

- The problem or decision
- Relevant context
- Alternatives considered
- The selected approach
- Why it was selected
- Important consequences

Once accepted, an ADR should not simply be rewritten when the decision changes.

A later ADR should supersede it so that the reasoning history remains available.

---

# 17. Proposed Initial Architecture Decision

## ADR-001: BixciBox Owns Project State; Providers Perform Specialized Generation

**Proposed status:** Accepted in principle, formal ADR pending

BixciBox should own and manage its project data and creative metadata.

Generation systems such as ComfyUI should be integrated as providers rather than becoming the core application architecture.

This allows BixciBox to evolve independently from any individual generation system.

---

# 18. Feature Admission Rule

Before a substantial new feature enters active development, we should be able to answer:

1. What user problem does this solve?
2. Is it part of the current development phase?
3. Which application module owns it?
4. What data does it create or modify?
5. What other modules does it depend on?
6. Does it introduce a new external dependency?
7. Does it change an existing architectural decision?
8. How will it be tested?
9. What documentation must change?

If these questions cannot yet be answered, the feature belongs in the backlog until they can.

---

# 19. Open Questions

The following questions remain intentionally unresolved and should be answered during Phase 0:

- What exactly constitutes BixciBox Version 1?
- What is the minimum useful BixciBox workflow?
- What application architecture will be used?
- How will BixciBox projects be stored?
- Will project metadata use files, a database, or a combination?
- How will generated assets be organized?
- How will BixciBox communicate with ComfyUI?
- How should long-running generation jobs be represented?
- How will provider-specific settings be separated from general project data?
- What portions of the application should work without any AI provider running?
- What testing strategy should be required for each layer?
- How should project-file migrations be handled as BixciBox evolves?

These questions should be resolved intentionally rather than incidentally during coding.

---

# 20. Change Policy for This Document

The Project Compass is a living document, but it should remain stable enough to act as an authoritative reference.

Changes should be made when:

- Product direction changes
- A development phase begins or ends
- Version scope changes
- A major architectural decision changes the overall design
- Documentation structure changes
- Important terminology changes

Detailed implementation information should normally be placed in supporting documentation rather than expanding this document indefinitely.

---

# 21. Change Log

## 2026-08-19

- Created initial BixciBox Project Compass.
- Established Phase 0 - Foundation.
- Defined initial product vision.
- Defined primary-user assumption.
- Established project-over-generator principle.
- Established provider-independence principle.
- Established preliminary BixciBox/Product/Development/Project terminology.
- Identified Phase 0 work items.
- Proposed provider architectural boundary.
- Established feature-admission rule.
- Identified initial unresolved architectural questions.

---

# 22. Immediate Next Step

Complete:

**Phase 0.2 - Product Scope & Boundaries**

The result should establish the first concrete answer to:

> **What must BixciBox do before we can call Version 1 useful, and what are we deliberately refusing to build until later?**
