# BixciBox Project & Data Model

**Document Status:** Draft
**Phase:** 0.4 - Project & Data Model
**Parent Document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

# 1. Purpose

This document defines the core information that BixciBox must store and the relationships between that information.

The goal is to define the conceptual model of a BixciBox Project before choosing the exact storage technology.

This document does not decide whether data will ultimately be stored in JSON files, SQLite, another database, or a combination.

---

# 2. Core Entities

BixciBox Version 1 requires the following core entities:

- Project
- Character
- Scene
- Prompt
- Generation Request
- Take
- Asset
- Provider Configuration

---

# 3. Project

A **Project** is the top-level creative production managed by BixciBox.

A Project owns the characters, scenes, prompts, takes, assets, and project-level settings associated with that production.

A Project should contain, at minimum:

- Unique project ID
- Project title
- Optional description
- Created date
- Last modified date
- Project version
- Project storage location
- Scene order
- Project settings

A Project may contain:

- Many Characters
- Many Scenes
- Many Assets
- Many Generation Requests
- Many Takes

---

# 4. Character

A **Character** represents a reusable person, creature, or recurring subject in the production.

A Character should contain, at minimum:

- Unique character ID
- Character name
- Description
- Physical appearance notes
- Consistency rules
- Positive prompt information
- Negative prompt information
- Notes

A Character may also contain:

- One or more reference images
- Model information
- LoRA information
- ControlNet-related settings
- Other generation-specific settings

A Character may appear in many Scenes.

A Scene may contain many Characters.

This means the relationship between Characters and Scenes is many-to-many.

---

# 5. Scene

A **Scene** represents a planned story segment.

A Scene should contain, at minimum:

- Unique scene ID
- Scene number or order
- Scene title
- Scene description
- Visual action
- Generation notes
- Scene status

A Scene may contain:

- Many Characters
- Many Prompts
- Many Generation Requests
- Many Takes
- Many Assets

A Scene belongs to one Project.

Scenes must be reorderable.

---

# 6. Prompt

A **Prompt** stores the creative text used to guide generation.

A Prompt should contain, at minimum:

- Unique prompt ID
- Positive prompt
- Optional negative prompt
- Date created
- Date modified

A Prompt may also contain:

- Character prompt fragments
- Style information
- Camera information
- Lighting information
- Composition notes
- Provider-specific notes

A Prompt should be associated with the Scene for which it was created.

A Prompt may be reused by more than one Generation Request.

Prompt revisions should not silently overwrite useful generation history.

---

# 7. Generation Request

A **Generation Request** represents one request sent from BixciBox to a generation provider.

For Version 1, the primary provider is ComfyUI.

A Generation Request should contain, at minimum:

- Unique generation request ID
- Project ID
- Scene ID
- Prompt ID
- Provider used
- Date and time submitted
- Request status

Possible request statuses include:

- Pending
- Running
- Completed
- Failed
- Cancelled

A Generation Request should also record enough provider information to reproduce or understand the request where practical.

This may include:

- Workflow identifier
- Workflow version
- Seed
- Model
- Sampler
- Steps
- CFG value
- Image dimensions
- Other provider-specific parameters

A Generation Request may produce one or more Takes.

---

# 8. Take

A **Take** represents one generated result created from a Generation Request.

A Take is not just the image file itself.

It represents the generated result together with its project context.

A Take should contain, at minimum:

- Unique take ID
- Generation Request ID
- Asset ID
- Review status
- Date created

Review status should support:

- Unreviewed
- Approved
- Rejected

A Take may also contain:

- Creator notes
- Rejection reason
- Rating or favorite status
- Superseded status

A Take belongs to one Generation Request.

A Generation Request may produce many Takes.

---

# 9. Asset

An **Asset** represents a physical file associated with a BixciBox Project.

Examples include:

- Character reference image
- Generated image
- Imported image
- Future video clip
- Future audio file
- Future music file

An Asset should contain, at minimum:

- Unique asset ID
- Project ID
- Asset type
- File path
- Original filename
- Date added

An Asset may also contain:

- Width
- Height
- File size
- Format
- Thumbnail path
- Notes
- Source information

Version 1 asset types should include at least:

- Character Reference Image
- Generated Image
- Imported Image

The Asset entity should remain general enough to support future video and audio assets.

---

# 10. Provider Configuration

A **Provider Configuration** stores the information BixciBox needs to communicate with an external generation system.

For Version 1, the primary provider is ComfyUI.

Provider Configuration should contain, at minimum:

- Unique provider configuration ID
- Provider type
- Display name
- Enabled or disabled status
- Connection settings

For ComfyUI, connection settings may include:

- Host
- Port
- Base URL
- Default workflow location
- Other required connection settings

Provider Configuration should be kept separate from Project creative data where practical.

A Project may reference a provider configuration without owning the provider itself.

---

# 11. Relationship Summary

The Version 1 relationships are:

```text
Project
|
+-- Characters
|
+-- Scenes
|   |
|   +-- Prompts
|   |
|   +-- Generation Requests
|       |
|       +-- Takes
|           |
|           +-- Asset
|
+-- Assets
|
+-- Project Settings
```

Character and Scene relationships:

```text
Character <----> Scene

Many Characters may appear in one Scene.
One Character may appear in many Scenes.
```

Generation relationships:

```text
Scene
  |
  v
Prompt
  |
  v
Generation Request
  |
  v
Take
  |
  v
Asset
```

This chain is important because BixciBox should be able to trace a generated image back to the creative information that produced it.

---

# 12. Ownership Rules

The following ownership rules apply in Version 1:

- A Project owns its Scenes.
- A Project owns its Characters.
- A Project owns its project Assets.
- A Scene belongs to one Project.
- A Character belongs to one Project.
- A Generation Request belongs to one Project and one Scene.
- A Take belongs to one Generation Request.
- An Asset belongs to one Project.
- Provider Configuration is application-level configuration and should not be tightly owned by one Project.

---

# 13. Identity Rules

Every core entity should have its own stable unique ID.

Names and file paths should not be used as identity.

For example:

A Character named "Vespie" should still have a separate unique ID because the character may later be renamed without breaking relationships.

Likewise, moving an asset file should not change which Asset it represents.

---

# 14. Persistence Requirements

The storage system selected later must preserve:

- Entity IDs
- Relationships
- Scene order
- Character-to-scene relationships
- Prompt history
- Generation Request history
- Take review status
- Asset references

Closing and reopening BixciBox must not break these relationships.

---

# 15. Future Compatibility

The Version 1 data model should allow future entities and relationships to be added without redesigning the entire project structure.

Likely future additions include:

- Locations
- Props
- Video Clips
- Audio Tracks
- Music
- Timeline Events
- Dialogue
- Narration
- Export Jobs
- Multiple providers
- Continuity checks

These future entities are not required for Version 1.

---

# 16. Questions Deferred to Later Architecture Work

This document intentionally does not decide:

- JSON versus database storage
- SQLite versus another database
- Exact folder structure
- Exact API formats
- Exact TypeScript or JavaScript class structure
- Exact field names used in source code
- Database normalization strategy
- File migration implementation

Those decisions belong in later architecture and implementation work.

---

# 17. Phase 0.4 Completion Criteria

Phase 0.4 is complete when:

- Core Version 1 entities are defined.
- Each entity has a clear responsibility.
- Entity relationships are documented.
- Ownership rules are documented.
- Generated assets can be traced conceptually from Scene to Prompt to Generation Request to Take to Asset.
- Future compatibility has been considered without expanding Version 1 scope.
- Storage technology remains intentionally undecided until the appropriate architecture decision.

---

# 18. Key Outcome

> **Defined the core BixciBox data entities and their relationships, including Projects, Characters, Scenes, Prompts, Generation Requests, Takes, Assets, and Provider Configuration, establishing a stable conceptual model for persistence and future development.**
