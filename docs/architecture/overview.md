# BixciBox Architecture Overview

**Document Status:** Active
**Phase:** 0.3 - Architecture Overview
**Parent Document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

# 1. Purpose

This document defines the high-level architecture of BixciBox.

Its purpose is to describe the major parts of the application, what each part is responsible for, and how those parts should interact.

This document intentionally avoids low-level implementation details such as exact class names, database schemas, framework-specific patterns, and API payload formats.

The goal is to establish clear architectural boundaries before substantial development continues.

---

# 2. Architectural Goal

BixciBox should be structured so that:

- Creative project data remains independent from external AI tools.
- The user interface does not contain generation-provider logic.
- ComfyUI can be replaced, supplemented, or extended later without redesigning the entire application.
- Project data can be opened and managed even when generation providers are unavailable.
- Major features remain modular.
- Future video, audio, and export capabilities can be added without disrupting Version 1 project organization.

The architecture should support growth without requiring future features to be built now.

---

# 3. Application Type

BixciBox Version 1 is intended to be a **desktop-oriented application**.

The application should run primarily on the creator's local computer and should have direct access to:

- Local project files
- Local reference images
- Generated assets
- ComfyUI
- Local configuration
- Future local AI tools

The exact desktop packaging technology may be selected later.

Possible implementation approaches may include:

- Electron
- Tauri
- Another desktop shell around a web-based user interface

This document does not yet select the final desktop technology.

---

# 4. High-Level Architecture

BixciBox should be divided into the following major architectural areas:

```text
BixciBox Desktop Application
|
+-- User Interface
|
+-- Application Core
|
+-- Persistence Layer
|
+-- Provider Layer
|
+-- Local File System
```

Each area has a distinct responsibility.

---

# 5. User Interface Layer

The **User Interface Layer** is responsible for presenting BixciBox project information and accepting user actions.

The UI should work with BixciBox concepts such as:

- Projects
- Characters
- Scenes
- Prompts
- Takes
- Assets
- Provider status

The UI should not directly control external generation tools.

For example, the UI should request:

> Generate an image for this scene.

It should not contain the logic required to construct and submit raw ComfyUI API requests.

That work belongs in the Provider and Application layers.

---

# 6. User Interface Responsibilities

Version 1 UI responsibilities include:

- Project creation and opening
- Project navigation
- Character management
- Character reference management
- Scene creation and ordering
- Prompt editing
- Generation requests
- Reviewing generated takes
- Approving or rejecting takes
- Viewing scene assets
- Viewing provider connection status
- Displaying errors and progress

The UI should receive application state from the Application Core rather than reading project files directly.

---

# 7. Application Core

The **Application Core** contains the primary BixciBox business logic.

It represents the rules and behavior of the application independent of the user interface and external providers.

The Application Core should coordinate:

- Project operations
- Character operations
- Scene operations
- Prompt operations
- Asset operations
- Generation operations
- Persistence
- Provider communication

The Application Core acts as the central coordinator between the UI, stored project data, and provider integrations.

---

# 8. Proposed Application Core Services

The following services represent the major Version 1 responsibilities.

Exact service names may change during implementation.

## 8.1 Project Service

Responsible for:

- Creating projects
- Opening projects
- Saving projects
- Closing projects
- Validating project structure
- Managing project metadata
- Managing project version information

---

## 8.2 Character Service

Responsible for:

- Creating characters
- Editing character definitions
- Managing character consistency information
- Associating reference images
- Managing character-to-scene relationships

---

## 8.3 Scene Service

Responsible for:

- Creating scenes
- Editing scenes
- Deleting scenes
- Reordering scenes
- Associating characters
- Associating prompts
- Associating approved takes

---

## 8.4 Asset Service

Responsible for:

- Registering project assets
- Managing asset metadata
- Locating asset files
- Importing supported files
- Maintaining stable asset references
- Preventing application logic from depending solely on filenames

---

## 8.5 Generation Service

Responsible for coordinating image-generation requests.

The Generation Service should:

- Receive a generation request from the UI
- Gather relevant scene and prompt data
- Gather character references and generation settings
- Select the appropriate provider
- Submit the request
- Track progress
- Receive the result
- Create Take records
- Register generated assets
- Report success or failure to the UI

The Generation Service should not contain ComfyUI-specific transport logic.

That belongs in the Provider Layer.

---

# 9. Persistence Layer

The **Persistence Layer** is responsible for storing and retrieving BixciBox project state.

It should provide the Application Core with structured project information without requiring application logic to know the exact underlying storage mechanism.

The Persistence Layer should support:

- Saving project metadata
- Loading project metadata
- Preserving entity IDs
- Preserving relationships
- Preserving scene order
- Preserving prompts
- Preserving generation history
- Preserving take review status
- Preserving asset references
- Handling project version information

The exact persistence technology is intentionally undecided at this stage.

Possible approaches include:

- JSON-based project files
- SQLite
- A hybrid model
- Another local persistence mechanism

A later architecture decision should select the final approach.

---

# 10. Asset Storage

Creative files should be stored separately from their descriptive metadata.

Examples include:

- Character reference images
- Generated images
- Imported images
- Future video files
- Future audio files

BixciBox should maintain metadata that describes each asset and its relationship to the project.

The application should not rely on the physical filename alone to determine what an asset represents.

For example:

```text
IMG_003842.png
```

is not sufficient project information.

BixciBox should also know that the file represents:

- A generated image
- For Scene 7
- From Generation Request 42
- Using a particular Prompt
- Reviewed as Approved

---

# 11. Provider Layer

The **Provider Layer** isolates BixciBox from the implementation details of external generation systems.

A provider is a component that knows how to communicate with a specific external tool or service.

Version 1 requires:

- ComfyUI Provider

Possible future providers may include:

- Other local image-generation systems
- Cloud image providers
- Video-generation systems
- Speech-generation systems
- Music-generation systems

---

# 12. Provider Interface Principle

The Application Core should communicate with providers through a common abstraction.

Conceptually:

```text
Application Core
      |
      v
Generation Service
      |
      v
Provider Interface
      |
      +-- ComfyUI Provider
      |
      +-- Future Provider
```

The Generation Service should not need to understand how ComfyUI internally represents nodes, workflow JSON, queue IDs, or output locations.

The ComfyUI Provider translates between BixciBox generation requests and ComfyUI-specific requirements.

---

# 13. ComfyUI Provider

The Version 1 ComfyUI Provider should be responsible for:

- Connecting to a local ComfyUI instance
- Confirming provider availability
- Loading or receiving workflow definitions
- Supplying generation inputs
- Submitting jobs
- Tracking job state
- Detecting completion
- Detecting failure
- Locating generated output
- Returning results to the Generation Service

The ComfyUI Provider should not own:

- Project data
- Character definitions
- Scene definitions
- Approval status
- Story order
- BixciBox asset metadata

Those remain BixciBox responsibilities.

---

# 14. Offline Provider Behavior

BixciBox must remain usable when ComfyUI is not running.

When the provider is unavailable, the creator should still be able to:

- Open projects
- Create or edit characters
- Create or edit scenes
- Edit prompts
- Review existing generated takes
- Approve or reject existing takes
- Organize project assets
- Save project changes

Only generation-related actions should become unavailable.

The UI should indicate provider status clearly rather than treating provider unavailability as an application failure.

---

# 15. Generation Job Lifecycle

Image generation may take time and should not block the entire application.

A generation job should conceptually pass through states such as:

```text
Created
   |
   v
Queued
   |
   v
Running
   |
   +-- Completed
   |
   +-- Failed
   |
   +-- Cancelled
```

The user interface should be able to display the current state.

The application should remain responsive while generation is running.

Long-running work should therefore be handled asynchronously within the application architecture.

---

# 16. Error Handling

Errors should be handled at the layer where they occur and translated into useful application-level messages.

For example:

A ComfyUI network error may originate in the Provider Layer.

The Provider Layer should convert that into a meaningful provider failure.

The Generation Service should then report the failed Generation Request.

The UI should present a clear message such as:

> ComfyUI is unavailable.

rather than exposing a raw network exception to the creator.

Errors should not silently corrupt project state.

---

# 17. Logging

BixciBox should maintain application logs sufficient to diagnose failures.

Logging should eventually include:

- Application startup
- Project open/save operations
- Provider connection attempts
- Generation requests
- Generation failures
- File access errors
- Persistence errors

Logs should be separate from normal user-facing project data.

Detailed logging design will be handled during later development standards work.

---

# 18. Configuration

Application-level configuration should remain separate from creative project data where practical.

Examples include:

- ComfyUI host
- ComfyUI port
- Default project location
- Application preferences
- Logging configuration

A BixciBox Project may reference provider-related settings when necessary for reproducibility, but the project should not own the installed provider itself.

---

# 19. Module Communication Rule

Major modules should communicate through clearly defined interfaces.

A module should not reach into another module's internal data structures or implementation details simply because doing so is convenient.

For example:

- The UI talks to the Application Core.
- The Application Core talks to Persistence.
- The Generation Service talks to Provider interfaces.
- Providers talk to external systems.
- The Asset Service manages project file references.

This rule exists to prevent tight coupling as BixciBox grows.

---

# 20. Architecture Dependency Direction

Dependencies should generally flow inward toward BixciBox concepts.

Conceptually:

```text
UI
 |
 v
Application Core
 |
 +--> Persistence Interface
 |
 +--> Provider Interface
          |
          v
     ComfyUI Provider
```

The Application Core should not depend directly on ComfyUI-specific implementation details.

Likewise, project entities should not depend on UI framework components.

---

# 21. Future Expansion

The architecture should allow future modules to be added without redesigning Version 1 project concepts.

Potential future modules include:

- Location Management
- Prop Management
- Video Generation
- Audio
- Music
- Narration
- Timeline
- Export
- Continuity Analysis
- Additional Providers

These features may add new services and entities, but should build on the same project-centered architecture.

---

# 22. Version 1 Architectural Boundaries

For Version 1:

BixciBox **does own**:

- Project state
- Characters
- Scenes
- Prompts
- Generation history
- Takes
- Asset metadata
- Approval state
- Project persistence

BixciBox **does not own**:

- ComfyUI internals
- Model execution
- AI inference engines
- Professional video editing
- Audio production systems
- Cloud collaboration

This distinction should remain clear during implementation.

---

# 23. Architecture Decisions Still Required

The following architecture questions remain unresolved:

- Which desktop shell will be used?
- Which frontend framework will be used?
- Which persistence technology will be used?
- How will project folders be structured?
- How will provider interfaces be represented in code?
- How will generation jobs be persisted, if at all?
- How will project migrations work?
- How much ComfyUI workflow information will be stored inside the project?
- How will thumbnails and derived assets be handled?
- How will application settings be stored?

These should be resolved through later architecture work and Architecture Decision Records where appropriate.

---

# 24. Phase 0.3 Completion Criteria

Phase 0.3 is complete when:

- The major architectural layers are defined.
- Responsibilities of each layer are documented.
- The UI is separated from provider logic.
- Project state is separated from generation-provider state.
- ComfyUI is clearly defined as a provider.
- Offline provider behavior is defined.
- Long-running generation work is recognized as asynchronous.
- Persistence responsibilities are defined without prematurely selecting storage technology.
- Future expansion can be supported through modular boundaries.

---

# 25. Key Outcome

> **Established a project-centered, modular BixciBox architecture in which the User Interface communicates through an Application Core, project state is preserved through a dedicated Persistence Layer, and external systems such as ComfyUI are isolated behind a Provider Layer.**
