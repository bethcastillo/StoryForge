# BixciBox Product Scope & Boundaries

**Document Status:** Active
**Phase:** 0.2 - Product Scope & Boundaries
**Applies To:** BixciBox Version 1
**Parent Document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

# 1. Purpose

This document defines the scope of **BixciBox Version 1**.

Its purpose is to establish:

- What Version 1 must accomplish
- What features are required
- What features are useful but not required
- What features are deliberately postponed
- What BixciBox Version 1 is not intended to be
- What conditions must be met before Version 1 can be considered useful and complete

This document acts as a boundary against uncontrolled feature growth.

A feature may be valuable without belonging in Version 1.

---

# 2. Version 1 Product Goal

BixciBox Version 1 should provide an individual creator with a reliable workflow for planning an AI-assisted visual story, maintaining character consistency, generating still images through ComfyUI, organizing those generations, and preserving enough information to understand how each asset was created and where it belongs.

Version 1 does not need to produce a finished movie.

It needs to solve the earlier and currently more fragmented part of the creative workflow:

> **Organize the story, organize the characters, generate the visual material, and keep everything connected.**

---

# 3. Minimum Useful Workflow

The minimum useful BixciBox Version 1 workflow is:

```text
Create Project
      |
      v
Define Characters
      |
      v
Plan Scenes
      |
      v
Create / Edit Generation Prompts
      |
      v
Generate Images Through ComfyUI
      |
      v
Review Generated Takes
      |
      +-- Approve
      |
      +-- Reject
      |
      +-- Generate Again
      |
      v
Associate Approved Assets With Scenes
      |
      v
Arrange Scenes in Story Order
      |
      v
Save Project
      |
      v
Close and Reopen Without Losing Project State
```

If BixciBox can perform this workflow reliably, Version 1 provides genuine creative value even without later video, audio, and editing capabilities.

---

# 4. Version 1 Required Capabilities

The following capabilities are required for Version 1.

---

## 4.1 Project Management

The creator must be able to:

- Create a new BixciBox Project
- Give the project a title
- Save the project
- Close the project
- Reopen an existing project
- Preserve project state between sessions
- Identify the project's asset storage location
- Keep project assets associated with the correct project

The project format must be sufficiently structured to support future expansion without requiring Version 1 to implement those future features.

---

## 4.2 Character Management

The creator must be able to define reusable characters.

A character record should support, at minimum:

- Character name
- Character description
- Physical appearance notes
- Important consistency rules
- Reference images
- Generation prompt information
- Negative prompt information where appropriate
- Notes relevant to generation

Examples of consistency rules might include:

- Eye color
- Hair color
- Clothing
- Species
- Body shape
- Anatomy
- Distinguishing marks
- Required or prohibited physical features

Character information should be reusable across multiple scenes.

The creator should not need to reconstruct the character definition manually every time the character appears.

---

## 4.3 Scene Planning

The creator must be able to create and manage scenes.

A scene should support, at minimum:

- Scene number or order
- Scene title or short identifier
- Scene description
- Characters appearing in the scene
- Visual action
- Generation notes
- Associated prompts
- Associated generated assets
- Scene status

Scenes must be reorderable.

Version 1 scene ordering represents **story order**, not a full video-editing timeline.

---

## 4.4 Prompt Management

BixciBox must allow generation prompts to be stored as part of the project rather than existing only inside ComfyUI.

Prompt information should be associated with the scene, asset, or generation attempt for which it was used.

Where practical, BixciBox should preserve:

- Positive prompt
- Negative prompt
- Character-related prompt information
- Relevant generation settings
- Workflow or workflow identifier
- Generation date/time
- Provider used

Prompt revisions should not silently destroy useful generation history.

---

## 4.5 ComfyUI Integration

ComfyUI will be the primary image-generation provider for Version 1.

BixciBox must be able to communicate with a locally running ComfyUI installation sufficiently to:

- Submit an image-generation request
- Provide the workflow and necessary generation inputs
- Detect completion or failure
- Receive or locate the generated output
- Import the output into the BixciBox Project
- Associate the output with the request that created it

BixciBox should treat ComfyUI as a **provider**, not as the BixciBox application backend.

Provider-specific details should remain separated from general BixciBox project concepts wherever practical.

---

## 4.6 Generated Take Management

One generation request may produce several attempts before the creator gets the desired result.

BixciBox must therefore treat generated images as **takes**, not merely files.

The creator must be able to distinguish between:

- Unreviewed takes
- Approved takes
- Rejected takes

A rejected take should not automatically be deleted.

The creator should be able to generate another take without overwriting earlier results.

Where practical, a take should retain information about:

- The scene it belongs to
- The prompt used
- The character definitions involved
- The provider used
- Relevant generation settings
- The source workflow
- Generation time
- Approval status

---

## 4.7 Asset Management

BixciBox must maintain a meaningful relationship between project metadata and physical asset files.

Version 1 asset handling should support:

- Character reference images
- Generated images
- Other image references needed for generation
- Approved scene images
- Rejected or experimental generated images

Assets should not depend on meaningless filenames alone for identification.

The application should provide metadata explaining what an asset is and why it exists.

---

## 4.8 Character Consistency Support

Version 1 must help the creator maintain visual consistency across scenes.

This does not mean BixciBox must solve AI character consistency perfectly.

It means BixciBox must preserve and reuse the information needed to pursue consistency.

At minimum, this includes:

- Character reference images
- Character descriptions
- Character prompt information
- Character-specific generation rules
- Important anatomy or appearance constraints
- Reusable ComfyUI-related settings where appropriate

BixciBox should reduce repeated manual setup.

---

## 4.9 Basic Story Sequence

The creator must be able to see the planned scenes in story order.

Version 1 should provide a basic representation of:

```text
Scene 1
Scene 2
Scene 3
Scene 4
...
```

Where practical, approved scene images may be shown with the scenes.

This feature is intended as a **story sequence or storyboard view**.

It is not intended to become a frame-accurate video-editing timeline during Version 1.

---

## 4.10 Reliable Persistence

This is a critical Version 1 requirement.

The creator must be able to close BixciBox, reopen the project later, and recover the state of the project.

At minimum, the following relationships must survive:

- Characters
- Character references
- Scenes
- Scene order
- Prompts
- Generated assets
- Approved/rejected status
- Relevant generation metadata
- Project settings

A system that generates images successfully but loses or corrupts project organization is not considered a successful Version 1.

---

# 5. Version 1 Optional Capabilities

These features may be included in Version 1 if they fit naturally into the architecture and do not delay the required workflow.

They are not required for Version 1 completion.

Possible optional features include:

- Reusable location definitions
- Reusable prop definitions
- Scene thumbnails
- Simple search or filtering
- Asset tags
- Favorites
- Generation notes
- Duplicate project
- Basic project templates
- Prompt templates
- Simple generation history browsing
- Manual asset import
- Manual asset export
- Lightweight continuity notes

Optional features must not destabilize required Version 1 capabilities.

---

# 6. Explicitly Deferred Features

The following capabilities are intentionally deferred beyond Version 1 unless a later Phase 0 decision changes their status.

---

## 6.1 Video Generation

Version 1 will not require:

- Text-to-video generation
- Image-to-video generation
- Multiple video providers
- Video-generation job management
- Automated clip extension
- Frame interpolation

The architecture should avoid blocking these capabilities later.

---

## 6.2 Full Video Editing Timeline

Version 1 will not attempt to replace a dedicated nonlinear video editor.

Deferred capabilities include:

- Frame-accurate editing
- Multiple video tracks
- Transitions
- Keyframes
- Compositing
- Color grading
- Advanced trimming
- Effects
- Proxy workflows

A basic scene/storyboard order is sufficient for Version 1.

---

## 6.3 Audio and Music Production

Version 1 will not require:

- Music synchronization
- Suno integration
- Voice generation
- Dialogue recording
- Automatic narration
- Sound-effect libraries
- Audio mixing
- Multitrack audio editing

These remain important future capabilities.

---

## 6.4 Final Video Export Pipeline

Version 1 will not require BixciBox to render a finished movie.

Advanced export belongs to a later development phase.

Version 1 may allow individual assets to be accessed or exported, but producing a final encoded production is not part of the required scope.

---

## 6.5 Multi-User Collaboration

Version 1 is designed for one creator.

Deferred capabilities include:

- User accounts
- Shared projects
- Simultaneous editing
- Permissions
- Roles
- Comments
- Team review
- Cloud collaboration

---

## 6.6 Cloud Project Synchronization

Version 1 does not require:

- Automatic cloud backup
- Cross-device synchronization
- Hosted project storage
- Cloud asset management

BixciBox should remain local-first.

---

## 6.7 Mobile Applications

Version 1 targets desktop use.

Dedicated phone and tablet applications are deferred.

---

## 6.8 Provider Marketplace or Plugin Ecosystem

Version 1 does not require a public provider marketplace, plugin store, or third-party extension ecosystem.

Provider boundaries should nevertheless be designed so additional providers can be added later.

---

## 6.9 AI Story Writing

BixciBox Version 1 is not required to generate complete stories, screenplays, or dialogue through built-in language models.

Creators may use external AI writing tools if desired.

Story-writing assistance may be considered later.

---

## 6.10 Automatic Continuity Analysis

Version 1 does not require AI to automatically detect continuity errors.

For example, Version 1 is not required to recognize that a generated character has:

- The wrong eye color
- Incorrect anatomy
- Missing clothing
- Extra limbs
- A different hairstyle

BixciBox should store the rules needed for such analysis later, but automated visual verification is deferred.

---

# 7. Version 1 Non-Goals

BixciBox Version 1 is **not** intended to be:

- A replacement for ComfyUI
- A replacement for a professional video editor
- A complete digital audio workstation
- A collaborative studio-management platform
- A cloud-first SaaS product
- A general-purpose AI image generator
- A universal interface for every AI model
- A complete screenplay-writing application
- A finished solution for every stage of filmmaking

Version 1 exists to solve a narrower problem well.

---

# 8. Version 1 User Experience Boundary

The creator should primarily interact with **creative concepts**, not raw infrastructure.

Where practical, the BixciBox interface should speak in terms such as:

- Project
- Character
- Scene
- Prompt
- Reference
- Take
- Approved
- Rejected
- Generate

Technical details such as workflow JSON, node identifiers, provider communication, file paths, and job IDs may need to exist internally but should not dominate the normal creative workflow.

Advanced technical controls may be exposed where useful.

---

# 9. Version 1 Definition of Done

BixciBox Version 1 can be considered functionally useful when a creator can complete the following test:

1. Launch BixciBox.
2. Create a new project.
3. Define at least one recurring character.
4. Attach one or more character reference images.
5. Record important character consistency information.
6. Create several scenes.
7. Arrange those scenes in story order.
8. Prepare a generation prompt for a scene.
9. Send an image-generation request to ComfyUI.
10. Receive the generated image in BixciBox.
11. Generate multiple alternate takes.
12. Approve one take and reject another.
13. View which prompt and generation information produced those takes.
14. Associate the approved image with its scene.
15. Repeat the process for additional scenes.
16. Save the project.
17. Close BixciBox.
18. Reopen BixciBox.
19. Reopen the project.
20. Confirm that the project's characters, scenes, assets, prompts, take status, and scene order remain intact.

If this workflow is stable and understandable, BixciBox Version 1 has achieved its primary goal.

---

# 10. Scope Guardrails

The following rules apply during Version 1 development.

### Rule 1: New Ideas Go to the Backlog First

A new idea does not automatically become an active feature.

It should first be categorized as:

- Now
- Next
- Later
- Maybe

---

### Rule 2: Required Workflow Comes Before Polish

Features necessary to complete the minimum useful workflow take priority over convenience features and visual refinement.

---

### Rule 3: Future Features May Influence Interfaces, Not Implementation

It is appropriate to design an interface that can later support multiple image providers.

It is not necessary to implement multiple image providers in Version 1.

It is appropriate to design scene data so video clips can later be attached.

It is not necessary to build video generation now.

---

### Rule 4: Avoid Building Hidden Second Products

A feature should be reconsidered if implementing it requires BixciBox to quietly become:

- A video editor
- An audio workstation
- A cloud platform
- A ComfyUI replacement
- A collaboration suite

These may become future capabilities, but they should emerge through deliberate development phases.

---

### Rule 5: Reliability Beats Feature Count

A smaller workflow that saves, reloads, and preserves creative relationships reliably is more valuable than a larger collection of partially working features.

---

# 11. Dependencies for Version 1

The primary known external generation dependency for Version 1 is:

## ComfyUI

ComfyUI will provide local image-generation capabilities.

BixciBox should remain usable for project organization even when ComfyUI is not running.

Generation features may become unavailable when the provider is offline, but the project itself should remain accessible.

---

# 12. Open Scope Questions

The following questions may be resolved during later Phase 0 work without changing the fundamental Version 1 goal:

- Are locations required for Version 1 or optional?
- Should manual image import be required?
- How much ComfyUI workflow editing should occur inside BixciBox?
- Should users select existing workflows, use BixciBox-provided workflows, or both?
- How much generation metadata should be visible in the normal interface?
- Should rejected takes remain indefinitely or support configurable cleanup?
- Is a storyboard view required, or is an ordered scene list sufficient initially?
- Should project duplication be part of Version 1?
- Should BixciBox create portable project folders that can be moved between computers?

These questions should be resolved according to the minimum useful workflow rather than by attempting to anticipate every future use case.

---

# 13. Phase 0.2 Completion Criteria

Phase 0.2 is complete when:

- The Version 1 goal is accepted.
- The minimum useful workflow is accepted.
- Required capabilities are identified.
- Deferred capabilities are identified.
- Version 1 non-goals are documented.
- The definition of done is accepted.
- Remaining implementation questions are assigned to later Phase 0 work rather than left ambiguous.
- The BixciBox Project Compass is updated to reflect the approved Version 1 scope.

---

# 14. Scope Summary

BixciBox Version 1 is fundamentally about this:

> **Plan scenes, define consistent characters, generate still images through ComfyUI, organize the resulting takes, preserve their creative history, and reliably save the entire project.**

Everything else must justify its inclusion against that goal.
