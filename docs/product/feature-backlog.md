# BixciBox Initial Feature Backlog

**Document Status:** Active
**Phase:** 0.7 - Initial Backlog
**Parent Document:** `docs/BIXCIBOX_PROJECT_COMPASS.md`

---

# 1. Purpose

This document records known BixciBox feature ideas that are not all part of the current development phase.

Its purpose is to:

- Preserve useful ideas
- Prevent new ideas from disrupting current work
- Distinguish Version 1 requirements from later possibilities
- Provide a place to evaluate future features deliberately
- Reduce the temptation to implement features simply because they are interesting

A backlog item is not automatically a commitment.

---

# 2. Backlog Categories

Each item should be placed into one of four categories:

## Now

Work required for the current development phase.

These items may actively enter development.

## Next

Work expected soon after the current phase.

These items are likely to be implemented, but should not interrupt current work.

## Later

Useful or planned capabilities that are intentionally deferred.

These items belong to future roadmap phases.

## Maybe

Ideas worth preserving but not yet committed to the product roadmap.

These may eventually move into Later, Next, or be removed entirely.

---

# 3. Backlog Rules

The following rules apply:

- New ideas enter the backlog before entering active development.
- A backlog item should describe the user problem it solves.
- Items should be moved between categories deliberately.
- Moving a major item into Version 1 should trigger a scope review.
- Large architectural changes may require an ADR.
- Duplicate or obsolete ideas should be cleaned up periodically.
- Backlog priority does not override the active development phase.

---

# 4. NOW

Current work is focused on completing Phase 0 and preparing for Version 1 implementation.

## Documentation and Foundation

- Complete Project Compass
- Complete Product Scope & Boundaries
- Complete Architecture Overview
- Complete Project & Data Model
- Complete Development Roadmap
- Complete Development Standards
- Complete Initial Backlog
- Establish Architecture Decision Record format
- Identify first ADRs required before implementation
- Confirm repository documentation structure
- Review Phase 0 documents for consistency

---

# 5. NEXT

These items belong to the earliest Version 1 development phases.

## Application Shell

- Launchable BixciBox desktop application
- Main application navigation
- Project dashboard
- Basic project settings
- Provider status indicator
- Application-level error display

## Project Management

- Create new project
- Open existing project
- Save project
- Close project
- Stable project ID
- Project title
- Project description
- Project created date
- Project modified date
- Project version
- Project storage location

## Persistence

- Select Version 1 persistence technology
- Save project metadata
- Load project metadata
- Validate project data
- Safe-write strategy
- Handle invalid project files
- Handle missing project files
- Initial project migration strategy

## Asset Management

- Asset registry
- Stable asset IDs
- Asset metadata
- Character reference image import
- Generated image registration
- Imported image registration
- Missing asset handling
- Asset file path management
- Thumbnail support if needed

---

# 6. NEXT - CHARACTER MANAGEMENT

- Create character
- Edit character
- Delete character
- Stable character ID
- Character name
- Character description
- Physical appearance notes
- Consistency rules
- Positive prompt fragments
- Negative prompt fragments
- Character notes
- Attach reference images
- Reuse character information across scenes
- Handle character deletion safely when scenes reference the character

---

# 7. NEXT - SCENE AND PROMPT MANAGEMENT

## Scenes

- Create scene
- Edit scene
- Delete scene
- Reorder scenes
- Scene title
- Scene description
- Visual action notes
- Scene status
- Assign characters to scenes
- Associate assets with scenes

## Prompts

- Create prompt
- Edit prompt
- Positive prompt
- Negative prompt
- Associate prompt with scene
- Preserve prompt history used for generations
- Store generation notes
- Reuse character prompt fragments

---

# 8. NEXT - COMFYUI INTEGRATION

- Create provider interface
- Implement ComfyUI provider
- Configure ComfyUI host
- Configure ComfyUI port
- Test provider availability
- Submit generation request
- Track generation state
- Detect generation completion
- Detect generation failure
- Retrieve generated output
- Register generated image as asset
- Keep ComfyUI-specific logic inside provider layer
- Allow BixciBox to remain usable while ComfyUI is offline

---

# 9. NEXT - GENERATION REQUESTS AND TAKES

- Create Generation Request records
- Track Pending state
- Track Running state
- Track Completed state
- Track Failed state
- Track Cancelled state
- Associate request with scene
- Associate request with prompt
- Record provider used
- Record important generation settings
- Create Take records from generated outputs
- Mark Take as Unreviewed
- Mark Take as Approved
- Mark Take as Rejected
- Add Take notes
- Preserve multiple Takes
- Prevent new generations from overwriting previous Takes
- Trace Take back to Generation Request
- Trace Generation Request back to Prompt and Scene

---

# 10. NEXT - STORYBOARD AND VERSION 1 INTEGRATION

- Ordered scene list
- Basic storyboard view
- Show approved scene image
- Scene status indicators
- Navigate from scene to prompt
- Navigate from scene to takes
- Generate from scene workflow
- Review takes from scene workflow
- Associate approved Take with scene
- Preserve full Version 1 workflow after save/reopen

---

# 11. LATER - VIDEO GENERATION

- Image-to-video generation
- Text-to-video generation
- Video provider interface
- ComfyUI video workflow support
- Additional video providers
- Video generation requests
- Video Takes
- Approve/reject video Takes
- Clip metadata
- Clip asset management
- Video preview
- Clip extension
- Frame interpolation

---

# 12. LATER - AUDIO AND MUSIC

- Import music files
- Import Suno-created music
- Audio asset management
- Music metadata
- Sound effect assets
- Narration assets
- Voice recording
- Speech-generation providers
- Voice assignment to characters
- Audio timing markers
- Beat markers
- Verse markers
- Chorus markers
- Scene-to-music alignment
- Basic audio mixing

---

# 13. LATER - TIMELINE

- Timeline view
- Scene timing
- Clip timing
- Clip ordering
- Music track
- Narration track
- Sound effect track
- Basic trimming
- Basic transitions
- Sync scenes to music
- Timing markers
- Preview assembled sequence

The timeline should not become a full professional nonlinear editor unless that expansion is deliberately approved.

---

# 14. LATER - EXPORT

- Assemble final video
- Combine video and audio
- Video encoding
- Resolution selection
- Aspect ratio selection
- Frame rate selection
- Export presets
- Output format selection
- Export job progress
- Export error handling

---

# 15. LATER - LOCATIONS

- Reusable location definitions
- Location descriptions
- Location reference images
- Lighting notes
- Time-of-day notes
- Environment consistency rules
- Location prompt fragments
- Associate locations with scenes

---

# 16. LATER - PROPS

- Reusable prop definitions
- Prop descriptions
- Prop reference images
- Scale information
- Appearance rules
- Prop prompt fragments
- Associate props with scenes

---

# 17. LATER - CONTINUITY ASSISTANCE

- Character continuity rules
- Anatomy validation
- Eye-color validation
- Hair-color validation
- Clothing continuity
- Location continuity
- Prop continuity
- Scene-to-scene continuity notes
- Automated image comparison
- AI-assisted continuity warnings
- Flag likely extra limbs or missing anatomy
- Flag likely character appearance drift

---

# 18. LATER - ADDITIONAL PROVIDERS

## Image Providers

- Additional local image providers
- Cloud image providers

## Video Providers

- Local video providers
- Cloud video providers

## Speech Providers

- Local text-to-speech
- Cloud text-to-speech

## Music Providers

- Music service integrations where appropriate

Provider additions should use the existing provider abstraction rather than introducing direct UI dependencies.

---

# 19. LATER - PROJECT PORTABILITY

- Portable BixciBox project folders
- Move project between computers
- Package project with required assets
- Detect missing external assets
- Relink assets
- Project archive
- Project backup
- Restore backup

---

# 20. LATER - SEARCH AND ORGANIZATION

- Search project assets
- Filter assets
- Tags
- Favorites
- Filter Takes by status
- Filter assets by scene
- Filter assets by character
- Sort by creation date
- Sort by approval status
- Project-wide search

---

# 21. LATER - PROMPT TOOLS

- Prompt templates
- Reusable style fragments
- Camera prompt fragments
- Lighting prompt fragments
- Prompt library
- Prompt comparison
- Prompt version history
- Copy prompt from another scene
- Prompt presets

---

# 22. MAYBE - AI WRITING ASSISTANCE

- Story brainstorming
- Synopsis generation
- Scene suggestions
- Dialogue suggestions
- Script generation
- Rewrite assistance
- Story structure analysis

BixciBox should not become dependent on built-in AI writing tools to function.

---

# 23. MAYBE - AUTOMATIC PROMPT GENERATION

- Build prompts from character definitions
- Build prompts from scene descriptions
- Automatic negative prompt suggestions
- Provider-specific prompt optimization
- Prompt cleanup
- Prompt consistency checking

---

# 24. MAYBE - PROJECT TEMPLATES

- Short-film template
- Music-video template
- Book-trailer template
- Character-focused template
- Storyboard-only template
- User-created templates

---

# 25. MAYBE - WORKFLOW LIBRARY

- Store reusable ComfyUI workflows
- Categorize workflows
- Associate workflows with generation types
- Workflow previews
- Recommended workflows
- Workflow version tracking
- Import/export workflow definitions

---

# 26. MAYBE - MODEL MANAGEMENT

- Display installed models
- Display LoRAs
- Display ControlNet models
- Associate preferred models with characters
- Associate models with workflows
- Model availability warnings
- Model metadata

BixciBox should avoid becoming a full ComfyUI model manager unless there is a clear product need.

---

# 27. MAYBE - GENERATION COMPARISON

- Compare two Takes side by side
- Compare several Takes
- Zoom comparison
- Mark preferred details
- Rate Takes
- Favorite Takes
- Compare generation settings

---

# 28. MAYBE - AUTOMATIC ASSET ANALYSIS

- Detect image dimensions
- Detect aspect ratio
- Detect possible duplicate images
- Automatic thumbnails
- Basic image metadata
- AI-generated asset descriptions
- Character recognition within project assets

---

# 29. MAYBE - CLOUD FEATURES

- Optional cloud backup
- Optional cross-device sync
- Remote generation
- Hosted project storage

Cloud features should remain optional and must not undermine local-first project ownership.

---

# 30. MAYBE - COLLABORATION

- Multiple users
- Shared projects
- Comments
- Review requests
- Permissions
- Roles
- Shared asset libraries
- Simultaneous editing

Collaboration is outside the current single-creator product goal and should only be reconsidered deliberately.

---

# 31. MAYBE - MOBILE OR TABLET COMPANION

- Project review
- Storyboard viewing
- Take approval/rejection
- Notes
- Remote generation status
- Reference image capture

A mobile companion should not influence Version 1 desktop architecture unless later approved.

---

# 32. MAYBE - ADVANCED EDITING

- Video effects
- Color grading
- Keyframes
- Compositing
- Masks
- Advanced transitions
- Motion graphics
- Multicam editing

These capabilities risk turning BixciBox into a professional nonlinear editor and should require a major scope decision before implementation.

---

# 33. Backlog Review Process

The backlog should be reviewed:

- At the end of each major development phase
- When Version 1 scope is reconsidered
- When a major new provider or capability becomes relevant
- When an item repeatedly appears during development discussions

During review:

- Remove obsolete items
- Merge duplicates
- Clarify unclear items
- Move items between categories where justified
- Identify items that require ADRs
- Avoid promoting items solely because they are exciting

---

# 34. Feature Promotion Rule

Before moving a substantial item from **Later** or **Maybe** into **Next** or **Now**, answer:

1. What user problem does it solve?
2. Is it required by the current roadmap phase?
3. Does it change Version 1 scope?
4. Which module owns it?
5. What data does it require?
6. Does it introduce a dependency?
7. Does it require an ADR?
8. What existing work could it delay?

If the answers are unclear, the item remains in the backlog.
