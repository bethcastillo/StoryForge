# BixciBox Development Roadmap

**Document Status:** Draft
**Phase:** 0.5 - Development Roadmap
**Parent Document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

# 1. Purpose

This document defines the planned development sequence for BixciBox.

Its purpose is to:

- Break the application into manageable development phases
- Define the primary goal of each phase
- Establish dependencies between phases
- Prevent unrelated features from entering active development too early
- Define what must be true before a phase is considered complete
- Provide a clear path from the current foundation work to a usable Version 1 release

The roadmap is intended to guide development, not predict exact calendar dates.

Phases may be refined as BixciBox evolves, but major changes to the sequence should be deliberate and documented.

---

# 2. Roadmap Principles

The roadmap follows these principles:

## 2.1 Build Foundations Before Features

Core project structure, persistence, and architecture must be stable enough before higher-level features depend on them.

## 2.2 Complete One Useful Vertical Slice at a Time

Development should prefer end-to-end usable workflows over many half-finished subsystems.

## 2.3 Version 1 Scope Comes First

Features outside the approved Version 1 scope should not interrupt required Version 1 work unless they are needed to preserve architectural flexibility.

## 2.4 Reliability Before Expansion

Saving, reopening, and preserving project relationships is more important than adding extra features.

## 2.5 Future Features Influence Architecture, Not Current Scope

Later capabilities such as video, audio, and export may affect interface design, but should not be implemented until their roadmap phase.

---

# 3. Phase Overview

The planned BixciBox development phases are:

```text
Phase 0  Foundation
Phase 1  Application Shell & Project Management
Phase 2  Persistence & Asset Management
Phase 3  Character Management
Phase 4  Scene Planning & Prompt Management
Phase 5  ComfyUI Provider Integration
Phase 6  Generation Requests & Take Management
Phase 7  Storyboard & Version 1 Workflow Integration
Phase 8  Stabilization, Testing & Version 1 Release
```

Future post-Version-1 phases may include:

```text
Phase 9   Video Generation
Phase 10  Audio & Music
Phase 11  Timeline Editing
Phase 12  Export Pipeline
Phase 13  Continuity Assistance
Phase 14  Additional Providers
```

The numbering of post-Version-1 phases may change later.

---

# 4. Phase 0 - Foundation

**Status:** In Progress

## Goal

Define BixciBox before substantial new development continues.

## Work Includes

- Project Compass
- Product Scope & Boundaries
- Architecture Overview
- Project & Data Model
- Development Roadmap
- Development Standards
- Initial Backlog
- Architecture Decision Record process

## Definition of Done

Phase 0 is complete when:

- Version 1 scope is documented
- Major architectural layers are documented
- Core project entities are documented
- Development phases are documented
- Coding and testing expectations are documented
- Repository/documentation structure is documented
- Initial feature backlog exists
- Important unresolved technical choices are identified for ADRs

---

# 5. Phase 1 - Application Shell & Project Management

## Goal

Create the basic BixciBox application shell and allow users to create, open, and manage projects.

## Work Includes

- Desktop application shell
- Main navigation
- New Project workflow
- Open Project workflow
- Project metadata
- Project title and description
- Project storage location
- Basic project settings
- Project close/reopen behavior
- Basic application error handling

## Primary User Outcome

The creator can launch BixciBox, create a project, save it, close it, and reopen it successfully.

## Definition of Done

Phase 1 is complete when:

- BixciBox launches reliably
- A user can create a new project
- A project has a stable unique ID
- Project metadata can be saved
- Existing projects can be opened
- Closing and reopening does not lose basic project state
- Invalid or missing projects produce useful errors
- Project operations are not dependent on ComfyUI

---

# 6. Phase 2 - Persistence & Asset Management

## Goal

Establish reliable project persistence and physical asset handling.

## Work Includes

- Finalize Version 1 persistence technology
- Project serialization/storage
- Project version information
- Asset registry
- Asset IDs
- File path handling
- Character reference image storage
- Imported image storage
- Generated image storage
- Asset metadata
- Missing-file handling
- Basic migration strategy
- Backup or safe-write behavior where appropriate

## Primary User Outcome

BixciBox can reliably remember project data and associated files across sessions.

## Definition of Done

Phase 2 is complete when:

- Project state persists reliably
- Asset IDs remain stable
- Assets can be registered and located
- Moving or renaming project metadata does not silently break identity
- Missing asset files are reported clearly
- Project data can be saved without corrupting an existing project
- Persistence tests cover normal save/load behavior

---

# 7. Phase 3 - Character Management

## Goal

Allow creators to define reusable characters and preserve consistency information.

## Work Includes

- Character creation
- Character editing
- Character deletion
- Character IDs
- Character descriptions
- Appearance notes
- Consistency rules
- Positive prompt fragments
- Negative prompt fragments
- Reference image association
- Optional generation-related settings
- Character list/detail views

## Primary User Outcome

The creator can define a character once and reuse that character information throughout the project.

## Definition of Done

Phase 3 is complete when:

- Characters can be created and edited
- Character data persists between sessions
- Reference images can be attached
- Consistency rules are stored
- Character prompt information can be reused
- Characters have stable IDs independent of names
- Character deletion handles related references safely

---

# 8. Phase 4 - Scene Planning & Prompt Management

## Goal

Allow the creator to organize the story into scenes and prepare reusable generation prompts.

## Work Includes

- Scene creation
- Scene editing
- Scene deletion
- Scene ordering
- Scene descriptions
- Visual action notes
- Scene status
- Character-to-scene relationships
- Prompt creation
- Positive prompts
- Negative prompts
- Prompt revision handling
- Scene-level generation notes

## Primary User Outcome

The creator can plan the visual story before generating anything.

## Definition of Done

Phase 4 is complete when:

- Scenes can be created and reordered
- Characters can be assigned to scenes
- Prompts can be created and associated with scenes
- Prompt revisions do not destroy prior generation history
- Scene and prompt data persists reliably
- Project organization works without ComfyUI running

---

# 9. Phase 5 - ComfyUI Provider Integration

## Goal

Connect BixciBox to a locally running ComfyUI instance through a dedicated provider layer.

## Work Includes

- Provider interface
- ComfyUI provider implementation
- Provider configuration
- Host/port settings
- Availability checks
- Workflow selection or loading
- Request submission
- Job tracking
- Completion detection
- Failure detection
- Output retrieval
- Provider status display

## Primary User Outcome

BixciBox can request an image from ComfyUI without exposing ComfyUI-specific mechanics throughout the application.

## Definition of Done

Phase 5 is complete when:

- BixciBox can detect whether ComfyUI is available
- A valid generation request can be submitted
- Completion can be detected
- Failures produce useful errors
- Generated files can be located
- ComfyUI-specific logic remains inside the provider layer
- The rest of BixciBox remains usable when ComfyUI is offline

---

# 10. Phase 6 - Generation Requests & Take Management

## Goal

Turn image generation into a traceable BixciBox workflow rather than a loose collection of files.

## Work Includes

- Generation Request records
- Generation request status
- Prompt association
- Scene association
- Character association
- Provider metadata
- Generation settings
- Generated Take records
- Take review status
- Approve
- Reject
- Regenerate
- Take notes
- Generated asset registration
- Traceability from Take back to Generation Request

## Primary User Outcome

The creator can generate several attempts, compare them, approve one, reject others, and later understand how each result was created.

## Definition of Done

Phase 6 is complete when:

- Generation requests are stored
- Generated outputs become registered assets
- Each output becomes a Take
- Takes can be Approved or Rejected
- Multiple Takes do not overwrite one another
- A Take can be traced back to its prompt and generation request
- Failed requests remain understandable in project history
- Take state persists after closing and reopening the project

---

# 11. Phase 7 - Storyboard & Version 1 Workflow Integration

## Goal

Connect all required Version 1 features into one coherent creative workflow.

## Work Includes

- Ordered scene list
- Storyboard-style scene view
- Approved image display
- Scene status indicators
- Character references visible where useful
- Generation controls integrated into scene workflow
- Take review integrated into scene workflow
- Navigation between scenes, prompts, and takes
- Workflow cleanup and usability improvements

## Primary User Outcome

The creator can move naturally from project planning to character definition, scene planning, image generation, take review, and story organization.

## Definition of Done

Phase 7 is complete when the creator can complete the full Version 1 minimum useful workflow:

1. Create a project
2. Define characters
3. Add character references
4. Create scenes
5. Order scenes
6. Write prompts
7. Generate images through ComfyUI
8. Review multiple takes
9. Approve and reject takes
10. Associate approved takes with scenes
11. View scenes in story order
12. Save the project
13. Close BixciBox
14. Reopen the project
15. Recover the same project state

---

# 12. Phase 8 - Stabilization, Testing & Version 1 Release

## Goal

Prepare the completed Version 1 workflow for dependable use.

## Work Includes

- Bug fixing
- Integration testing
- Persistence testing
- Provider failure testing
- Invalid project testing
- Missing asset testing
- UI cleanup
- Error message cleanup
- Performance review
- Documentation review
- Setup instructions
- Basic release packaging
- Version numbering
- Release checklist

## Primary User Outcome

The creator can use BixciBox repeatedly without the application feeling experimental or fragile.

## Definition of Done

Phase 8 is complete when:

- The Version 1 definition-of-done workflow passes
- Critical bugs are resolved
- Projects survive repeated save/load cycles
- Provider failures do not corrupt project state
- Missing files produce understandable errors
- Setup instructions are documented
- Version 1 can be packaged and launched on the target desktop environment
- Required user-facing documentation exists
- Version 1 is tagged or otherwise formally identified as a release

---

# 13. Post-Version-1 Development

The following areas are explicitly outside the Version 1 roadmap but remain planned future directions.

---

## Phase 9 - Video Generation

Possible capabilities:

- Image-to-video generation
- Text-to-video generation
- Video provider abstraction
- Clip tracking
- Video takes
- Clip approval/rejection

---

## Phase 10 - Audio & Music

Possible capabilities:

- Music import
- Suno-created music import
- Sound effects
- Narration
- Voice generation
- Audio asset management
- Timing markers

---

## Phase 11 - Timeline Editing

Possible capabilities:

- Scene timing
- Clip ordering
- Track-based timeline
- Music alignment
- Narration alignment
- Basic transitions

This phase should remain intentionally limited unless BixciBox is deliberately expanded toward full video editing.

---

## Phase 12 - Export Pipeline

Possible capabilities:

- Final render assembly
- Video encoding
- Audio mixing
- Export presets
- Resolution settings
- Format selection

---

## Phase 13 - Continuity Assistance

Possible capabilities:

- Character appearance checks
- Anatomy consistency checks
- Clothing continuity
- Location continuity
- Prompt-rule validation
- Automated warnings

This may eventually include AI-assisted comparison of generated images against stored character rules.

---

## Phase 14 - Additional Providers

Possible capabilities:

- Additional image providers
- Additional video providers
- Speech providers
- Cloud services
- Provider-specific configuration and credentials

The provider system should allow these to be added without redesigning the Application Core.

---

# 14. Phase Dependency Summary

The major dependency order is:

```text
Foundation
    |
    v
Project Management
    |
    v
Persistence & Assets
    |
    v
Characters
    |
    v
Scenes & Prompts
    |
    v
ComfyUI Provider
    |
    v
Generation Requests & Takes
    |
    v
Storyboard Integration
    |
    v
Stabilization
    |
    v
Version 1
```

Some work may overlap where practical, but later phases should not assume unfinished foundations are stable.

---

# 15. Development Rule for Active Phases

At any given time, BixciBox Development should have:

- One **current phase**
- One clearly defined **next phase**
- A backlog for everything else

Work outside the current phase should occur only when:

- It is required to unblock the current phase
- It resolves an architectural question
- It fixes a critical defect
- It is explicitly approved as a roadmap change

This rule is intended to prevent feature drift.

---

# 16. Roadmap Change Policy

The roadmap may change.

However, changes should be intentional.

A roadmap change should document:

- What is changing
- Why it is changing
- Which phases are affected
- Whether Version 1 scope changes
- Whether an ADR or Compass update is required

Moving a feature from a later phase into Version 1 should require a clear reason.

---

# 17. Phase 0.5 Completion Criteria

Phase 0.5 is complete when:

- Version 1 development phases are defined
- Each phase has a clear goal
- Each phase has a primary user outcome
- Each phase has a definition of done
- Major phase dependencies are documented
- Post-Version-1 directions are identified
- The roadmap change policy is documented
- The Project Compass is updated with the roadmap outcome

---

# 18. Key Outcome

> **Defined an ordered development path from Phase 0 through BixciBox Version 1, with each phase focused on a specific user outcome and governed by explicit completion criteria.**
