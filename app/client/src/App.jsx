import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/api";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setError("");

      const response = await fetch(`${API_URL}/projects`);

      if (!response.ok) {
        throw new Error("Could not load projects.");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the StoryForge server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function createProject() {
    const name = window.prompt("Project name:");

    if (!name?.trim()) {
      return;
    }

    const description = window.prompt("Short description:", "") || "";

    try {
      setError("");

      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create project.");
      }

      const newProject = await response.json();

      setProjects((currentProjects) => [newProject, ...currentProjects]);
    } catch (err) {
      console.error(err);
      setError("Could not create the project.");
    }
  }

  function handleProjectUpdate(updatedProject) {
    setSelectedProject(updatedProject);

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
  }

  if (selectedProject) {
    return (
      <ProjectWorkspace
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onProjectUpdate={handleProjectUpdate}
      />
    );
  }

  return (
    <div className='app-shell'>
      <header className='topbar'>
        <h1>StoryForge Studio</h1>
        <span>v0.1</span>
      </header>

      <main className='main-content'>
        <section className='projects-header'>
          <div>
            <h2>Projects</h2>
            <p>Create and manage your AI video projects.</p>
          </div>

          <button
            className='primary-button'
            onClick={createProject}
          >
            + New Project
          </button>
        </section>

        {error && <div className='error-message'>{error}</div>}

        {loading ? (
          <p className='status-message'>Loading projects...</p>
        ) : projects.length === 0 ? (
          <section className='empty-state'>
            <div className='empty-icon'>🎬</div>

            <h3>No projects yet</h3>

            <p>Create your first StoryForge project.</p>

            <button
              className='primary-button'
              onClick={createProject}
            >
              Create Project
            </button>
          </section>
        ) : (
          <section className='project-grid'>
            {projects.map((project) => (
              <article
                className='project-card'
                key={project.id}
              >
                <div className='project-thumbnail'>
                  <span>🎬</span>
                </div>

                <div className='project-info'>
                  <h3>{project.name}</h3>

                  <p>{project.description || "No description yet"}</p>

                  <button
                    className='secondary-button'
                    onClick={() => setSelectedProject(project)}
                  >
                    Open Project
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function ProjectWorkspace({ project, onBack, onProjectUpdate }) {
  const [activeView, setActiveView] = useState("overview");

  const characterCount = project.characters?.length || 0;

  const sceneCount = project.scenes?.length || 0;

  const renderCount = project.renders?.length || 0;

  return (
    <div className='workspace-shell'>
      <header className='topbar'>
        <div className='workspace-title'>
          <button
            className='back-button'
            onClick={onBack}
          >
            ← Projects
          </button>

          <h1>StoryForge Studio</h1>
        </div>

        <span>v0.1</span>
      </header>

      <div className='workspace-layout'>
        <aside className='sidebar'>
          <div className='project-name'>
            <small>PROJECT</small>
            <strong>{project.name}</strong>
          </div>

          <nav className='sidebar-nav'>
            <button
              className={`nav-button ${
                activeView === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveView("overview")}
            >
              Overview
            </button>

            <button
              className={`nav-button ${
                activeView === "characters" ? "active" : ""
              }`}
              onClick={() => setActiveView("characters")}
            >
              Characters
            </button>

            <button
              className={`nav-button ${
                activeView === "scenes" ? "active" : ""
              }`}
              onClick={() => setActiveView("scenes")}
            >
              Scenes
            </button>

            <button className='nav-button'>Storyboard</button>

            <button className='nav-button'>Renders</button>
          </nav>
        </aside>

        <main className='workspace-content'>
          {activeView === "overview" && (
            <OverviewView
              project={project}
              characterCount={characterCount}
              sceneCount={sceneCount}
              renderCount={renderCount}
              onGoToCharacters={() => setActiveView("characters")}
            />
          )}

          {activeView === "characters" && (
            <CharactersView
              project={project}
              onProjectUpdate={onProjectUpdate}
            />
          )}
          {activeView === "scenes" && (
            <ScenesView
              project={project}
              onProjectUpdate={onProjectUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function OverviewView({
  project,
  characterCount,
  sceneCount,
  renderCount,
  onGoToCharacters,
}) {
  return (
    <>
      <div className='workspace-heading'>
        <div>
          <h2>{project.name}</h2>

          <p>{project.description || "No description yet"}</p>
        </div>
      </div>

      <section className='stats-grid'>
        <div className='stat-card'>
          <span>Characters</span>
          <strong>{characterCount}</strong>
        </div>

        <div className='stat-card'>
          <span>Scenes</span>
          <strong>{sceneCount}</strong>
        </div>

        <div className='stat-card'>
          <span>Renders</span>
          <strong>{renderCount}</strong>
        </div>
      </section>

      <section className='getting-started'>
        <h3>Build your story</h3>

        <p>Start by creating the characters that appear in this project.</p>

        <button
          className='primary-button'
          onClick={onGoToCharacters}
        >
          + Add Character
        </button>
      </section>
    </>
  );
}

function CharactersView({ project, onProjectUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const [form, setForm] = useState({
    name: "",
    species: "",
    visualDescription: "",
    personality: "",
    movement: "",
    continuityRules: "",
  });

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveCharacter(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Character name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${project.id}/characters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        throw new Error("Could not save character.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);

      setForm({
        name: "",
        species: "",
        visualDescription: "",
        personality: "",
        movement: "",
        continuityRules: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Could not save character.");
    } finally {
      setSaving(false);
    }
  }

  if (selectedCharacter) {
    const currentCharacter =
      project.characters.find(
        (character) => character.id === selectedCharacter.id,
      ) || selectedCharacter;

    return (
      <CharacterDetail
        project={project}
        character={currentCharacter}
        onBack={() => setSelectedCharacter(null)}
        onProjectUpdate={onProjectUpdate}
      />
    );
  }

  return (
    <>
      <section className='characters-header'>
        <div>
          <h2>Characters</h2>
          <p>Create persistent character identities for this project.</p>
        </div>

        <button
          className='primary-button'
          onClick={() => setShowForm(true)}
        >
          + Add Character
        </button>
      </section>

      {error && <div className='error-message'>{error}</div>}

      {showForm && (
        <form
          className='character-form'
          onSubmit={saveCharacter}
        >
          <div className='form-heading'>
            <div>
              <h3>New Character</h3>
              <p>
                Define the character StoryForge should preserve across scenes.
              </p>
            </div>

            <button
              type='button'
              className='close-button'
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <div className='form-row'>
            <label>
              Character Name
              <input
                name='name'
                value={form.name}
                onChange={updateField}
                placeholder='Vespie'
              />
            </label>

            <label>
              Species / Type
              <input
                name='species'
                value={form.species}
                onChange={updateField}
                placeholder='Baby dragon'
              />
            </label>
          </div>

          <label>
            Visual Description
            <textarea
              name='visualDescription'
              value={form.visualDescription}
              onChange={updateField}
              rows='6'
              placeholder="Describe the character's physical appearance..."
            />
          </label>

          <label>
            Personality
            <textarea
              name='personality'
              value={form.personality}
              onChange={updateField}
              rows='4'
              placeholder='Curious, affectionate, easily distracted...'
            />
          </label>

          <label>
            Movement
            <textarea
              name='movement'
              value={form.movement}
              onChange={updateField}
              rows='4'
              placeholder='Describe how this character moves...'
            />
          </label>

          <label>
            Continuity Rules
            <textarea
              name='continuityRules'
              value={form.continuityRules}
              onChange={updateField}
              rows='5'
              placeholder='Rules the AI should never violate...'
            />
          </label>

          <div className='form-actions'>
            <button
              type='button'
              className='secondary-button'
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type='submit'
              className='primary-button'
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Character"}
            </button>
          </div>
        </form>
      )}

      {!showForm && (project.characters?.length || 0) === 0 && (
        <section className='empty-state character-empty'>
          <div className='empty-icon'>🐉</div>

          <h3>No characters yet</h3>

          <p>Add the first character in your story.</p>
        </section>
      )}

      {!showForm && project.characters?.length > 0 && (
        <section className='character-grid'>
          {project.characters.map((character) => (
            <article
              key={character.id}
              className='character-card clickable'
              onClick={() => setSelectedCharacter(character)}
            >
              <div className='character-avatar'>
                {character.referenceImages?.length > 0 ? (
                  <img
                    src={
                      `http://localhost:3001` +
                      (
                        character.referenceImages.find(
                          (image) => image.isPrimary,
                        ) || character.referenceImages[0]
                      ).url
                    }
                    alt={character.name}
                  />
                ) : (
                  <span>🐾</span>
                )}
              </div>

              <div>
                <h3>{character.name}</h3>

                <span className='character-species'>
                  {character.species || "Unknown type"}
                </span>

                <p>
                  {character.visualDescription || "No visual description yet."}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

function CharacterDetail({ project, character, onBack, onProjectUpdate }) {
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  async function uploadReferenceImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/projects/${project.id}` +
          `/characters/${character.id}` +
          `/reference-images`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Could not upload image.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);
    } catch (err) {
      console.error(err);

      setError(err.message || "Could not upload image.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  async function updateReferenceImage(imageId, changes) {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${project.id}` +
          `/characters/${character.id}` +
          `/reference-images/${imageId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(changes),
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Could not update image.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);
    } catch (err) {
      console.error(err);

      setError(err.message || "Could not update image.");
    }
  }

  async function deleteReferenceImage(image) {
    const confirmed = window.confirm(`Delete ${image.originalName}?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${project.id}` +
          `/characters/${character.id}` +
          `/reference-images/${image.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Could not delete image.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);
    } catch (err) {
      console.error(err);

      setError(err.message || "Could not delete image.");
    }
  }

  return (
    <>
      <section className='character-detail-header'>
        <button
          className='back-button'
          onClick={onBack}
        >
          ← Characters
        </button>

        <div>
          <h2>{character.name}</h2>

          <p>{character.species || "Character"}</p>
        </div>
      </section>

      {error && <div className='error-message'>{error}</div>}

      <section className='character-detail-grid'>
        <div className='character-profile-panel'>
          <h3>Character Identity</h3>

          <CharacterField
            title='Visual Description'
            value={character.visualDescription}
          />

          <CharacterField
            title='Personality'
            value={character.personality}
          />

          <CharacterField
            title='Movement'
            value={character.movement}
          />

          <CharacterField
            title='Continuity Rules'
            value={character.continuityRules}
          />
        </div>

        <div className='reference-panel'>
          <div className='reference-header'>
            <div>
              <h3>Reference Images</h3>

              <p>Images that define how this character should look.</p>
            </div>

            <label className='upload-button'>
              {uploading ? "Uploading..." : "+ Add Image"}

              <input
                type='file'
                accept='image/png,image/jpeg,image/webp'
                onChange={uploadReferenceImage}
                disabled={uploading}
              />
            </label>
          </div>

          {character.referenceImages?.length > 0 ? (
            <div className='reference-grid'>
              {character.referenceImages.map((image) => (
                <ReferenceImageCard
                  key={image.id}
                  character={character}
                  image={image}
                  onUpdate={updateReferenceImage}
                  onDelete={deleteReferenceImage}
                />
              ))}
            </div>
          ) : (
            <div className='reference-empty'>
              <div>🖼️</div>

              <strong>No reference images yet</strong>

              <p>
                Add several views of {character.name} so StoryForge can preserve
                the character's appearance.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ReferenceImageCard({ character, image, onUpdate, onDelete }) {
  const [label, setLabel] = useState(image.label || "Unlabeled");

  const [note, setNote] = useState(image.note || "");

  const [saving, setSaving] = useState(false);

  const referenceTypes = [
    "Unlabeled",
    "Primary",
    "Front",
    "Side",
    "Rear",
    "Three-Quarter",
    "Flying",
    "Expression",
    "Detail",
    "Other",
  ];

  async function saveMetadata() {
    setSaving(true);

    await onUpdate(image.id, {
      label,
      note,
    });

    setSaving(false);
  }

  async function makePrimary() {
    await onUpdate(image.id, {
      isPrimary: true,
    });
  }

  return (
    <article
      className={`reference-card ${image.isPrimary ? "primary-reference" : ""}`}
    >
      <div className='reference-image-wrapper'>
        <img
          src={`http://localhost:3001` + image.url}
          alt={`${character.name} reference`}
        />

        {image.isPrimary && <span className='primary-badge'>★ Primary</span>}
      </div>

      <div className='reference-controls'>
        <label>
          View
          <select
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          >
            {referenceTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Notes
          <textarea
            rows='3'
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder='Best wing reference, correct eye color...'
          />
        </label>

        <div className='reference-actions'>
          {!image.isPrimary && (
            <button
              type='button'
              className='secondary-button'
              onClick={makePrimary}
            >
              ★ Make Primary
            </button>
          )}

          <button
            type='button'
            className='secondary-button'
            onClick={saveMetadata}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type='button'
            className='danger-button'
            onClick={() => onDelete(image)}
          >
            Delete
          </button>
        </div>

        <small className='reference-filename'>{image.originalName}</small>
      </div>
    </article>
  );
}

function CharacterField({ title, value }) {
  return (
    <div className='character-field'>
      <h4>{title}</h4>

      <p>{value || "Not defined yet."}</p>
    </div>
  );
}

function ScenesView({ project, onProjectUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedScene, setSelectedScene] = useState(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    action: "",
    camera: "",
    audioDirection: "",
    negativeInstructions: "",
    duration: 5,
    aspectRatio: "16:9",
    characterIds: [],
  });

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function toggleCharacter(characterId) {
    setForm((current) => ({
      ...current,
      characterIds: current.characterIds.includes(characterId)
        ? current.characterIds.filter((id) => id !== characterId)
        : [...current.characterIds, characterId],
    }));
  }

  async function saveScene(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Scene title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/projects/${project.id}/scenes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Could not save scene.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);

      setForm({
        title: "",
        location: "",
        action: "",
        camera: "",
        audioDirection: "",
        negativeInstructions: "",
        duration: 5,
        aspectRatio: "16:9",
        characterIds: [],
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);

      setError(err.message || "Could not save scene.");
    } finally {
      setSaving(false);
    }
  }

  if (selectedScene) {
    const currentScene =
      project.scenes?.find((scene) => scene.id === selectedScene.id) ||
      selectedScene;

    return (
      <SceneDetail
        project={project}
        scene={currentScene}
        onBack={() => setSelectedScene(null)}
        onProjectUpdate={onProjectUpdate}
      />
    );
  }

  return (
    <>
      <section className='characters-header'>
        <div>
          <h2>Scenes</h2>
          <p>Build the individual shots that make up your story.</p>
        </div>

        <button
          className='primary-button'
          onClick={() => setShowForm(true)}
        >
          + Add Scene
        </button>
      </section>

      {error && <div className='error-message'>{error}</div>}

      {showForm && (
        <form
          className='character-form'
          onSubmit={saveScene}
        >
          <div className='form-heading'>
            <div>
              <h3>New Scene</h3>

              <p>
                Define what happens, who appears, and how the camera sees it.
              </p>
            </div>

            <button
              type='button'
              className='close-button'
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <div className='form-row'>
            <label>
              Scene Title
              <input
                name='title'
                value={form.title}
                onChange={updateField}
                placeholder='Butterfly'
              />
            </label>

            <label>
              Location
              <input
                name='location'
                value={form.location}
                onChange={updateField}
                placeholder='Deep Forest'
              />
            </label>
          </div>

          <label>
            Action
            <textarea
              name='action'
              value={form.action}
              onChange={updateField}
              rows='5'
              placeholder='Vespie notices a butterfly and follows it through the ferns...'
            />
          </label>

          <label>
            Camera
            <textarea
              name='camera'
              value={form.camera}
              onChange={updateField}
              rows='3'
              placeholder='Low tracking shot following behind Vespie...'
            />
          </label>

          <label>
            Audio Direction
            <textarea
              name='audioDirection'
              value={form.audioDirection}
              onChange={updateField}
              rows='4'
              placeholder='No dialogue. No music. Vespie chirps and trills. Forest ambience and birds overhead.'
            />
          </label>

          <label>
            Negative Instructions
            <textarea
              name='negativeInstructions'
              value={form.negativeInstructions}
              onChange={updateField}
              rows='4'
              placeholder='No text. No humans. Do not change Vespie’s colors or anatomy.'
            />
          </label>

          <div className='form-row'>
            <label>
              Duration
              <input
                name='duration'
                type='number'
                min='1'
                max='30'
                value={form.duration}
                onChange={updateField}
              />
            </label>

            <label>
              Aspect Ratio
              <select
                name='aspectRatio'
                value={form.aspectRatio}
                onChange={updateField}
              >
                <option value='16:9'>16:9 Widescreen</option>

                <option value='9:16'>9:16 Vertical</option>

                <option value='1:1'>1:1 Square</option>
              </select>
            </label>
          </div>

          <fieldset className='scene-characters'>
            <legend>Characters</legend>

            {project.characters?.length > 0 ? (
              project.characters.map((character) => (
                <label
                  key={character.id}
                  className='character-check'
                >
                  <input
                    type='checkbox'
                    checked={form.characterIds.includes(character.id)}
                    onChange={() => toggleCharacter(character.id)}
                  />

                  <span>{character.name}</span>
                </label>
              ))
            ) : (
              <p>No characters have been added yet.</p>
            )}
          </fieldset>

          <div className='form-actions'>
            <button
              type='button'
              className='secondary-button'
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type='submit'
              className='primary-button'
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Scene"}
            </button>
          </div>
        </form>
      )}

      {!showForm && (project.scenes?.length || 0) === 0 && (
        <section className='empty-state character-empty'>
          <div className='empty-icon'>🎬</div>

          <h3>No scenes yet</h3>

          <p>Create the first shot in your story.</p>
        </section>
      )}

      {!showForm && project.scenes?.length > 0 && (
        <section className='scene-grid'>
          {project.scenes.map((scene, index) => {
            const characters =
              project.characters?.filter((character) =>
                scene.characterIds?.includes(character.id),
              ) || [];

            return (
              <article
                className='scene-card clickable'
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
              >
                <div className='scene-number'>Scene {index + 1}</div>

                <h3>{scene.title}</h3>

                <div className='scene-meta'>
                  <span>{scene.duration}s</span>

                  <span>{scene.aspectRatio}</span>

                  {scene.location && <span>{scene.location}</span>}
                </div>

                <p className='scene-action'>
                  {scene.action || "No action description yet."}
                </p>

                {characters.length > 0 && (
                  <div className='scene-cast'>
                    {characters.map((character) => (
                      <span
                        key={character.id}
                        className='cast-chip'
                      >
                        {character.name}
                      </span>
                    ))}
                  </div>
                )}

                {scene.camera && (
                  <div className='scene-camera'>
                    <strong>Camera:</strong> {scene.camera}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

function SceneDetail({ project, scene, onBack, onProjectUpdate }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: scene.title || "",
    location: scene.location || "",
    action: scene.action || "",
    camera: scene.camera || "",
    audioDirection: scene.audioDirection || "",
    negativeInstructions: scene.negativeInstructions || "",
    duration: scene.duration || 5,
    aspectRatio: scene.aspectRatio || "16:9",
    characterIds: scene.characterIds || [],
  });

  const [showBrief, setShowBrief] = useState(false);

  const [copyStatus, setCopyStatus] = useState("");

  const [generating, setGenerating] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function toggleCharacter(characterId) {
    setForm((current) => ({
      ...current,

      characterIds: current.characterIds.includes(characterId)
        ? current.characterIds.filter((id) => id !== characterId)
        : [...current.characterIds, characterId],
    }));
  }

  async function saveScene(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${project.id}/scenes/${scene.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Could not update scene.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);
      setEditing(false);
    } catch (err) {
      console.error(err);

      setError(err.message || "Could not update scene.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadStartingFrame(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/projects/${project.id}` +
          `/scenes/${scene.id}` +
          `/starting-frame`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error || "Could not upload starting frame.");
      }

      const result = await response.json();

      onProjectUpdate(result.project);
    } catch (err) {
      console.error(err);

      setError(err.message || "Could not upload starting frame.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function copyGenerationBrief() {
    try {
      await navigator.clipboard.writeText(generationBrief);

      setCopyStatus("Copied!");

      setTimeout(() => {
        setCopyStatus("");
      }, 1500);
    } catch (error) {
      console.error("Could not copy generation brief:", error);

      setCopyStatus("Copy failed");
    }
  }

async function generateStartingFrame() {
  try {
    setGenerating(true);
    setError("");

    const response = await fetch(
      `${API_URL}/projects/${project.id}` +
        `/scenes/${scene.id}` +
        `/generate-starting-frame`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      const result = await response.json();

      throw new Error(result.error || "Could not generate starting frame.");
    }

    const result = await response.json();

    onProjectUpdate(result.project);
  } catch (err) {
    console.error(err);

    setError(err.message || "Could not generate starting frame.");
  } finally {
    setGenerating(false);
  }
}
  const generationBrief = buildGenerationBrief(project, scene);

  const cast =
    project.characters?.filter((character) =>
      scene.characterIds?.includes(character.id),
    ) || [];

  return (
    <>
      <section className='character-detail-header'>
        <button
          className='back-button'
          onClick={onBack}
        >
          ← Scenes
        </button>

        <div>
          <h2>{scene.title}</h2>

          <p>{scene.location || "No location"}</p>
        </div>
      </section>

      {error && <div className='error-message'>{error}</div>}

      <div className='scene-detail-toolbar'>
        <button
          className='secondary-button'
          onClick={() => setShowBrief(!showBrief)}
        >
          {showBrief ? "Hide Generation Brief" : "Generation Brief"}
        </button>

        <button
          className='secondary-button'
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel Edit" : "Edit Scene"}
        </button>
      </div>

      {showBrief && (
        <section className='generation-brief'>
          <div className='generation-brief-header'>
            <div>
              <h3>Generation Brief</h3>

              <p>
                Model-ready instructions assembled from this scene and its
                characters.
              </p>
            </div>

            <button
              type='button'
              className='primary-button'
              onClick={copyGenerationBrief}
            >
              {copyStatus || "Copy Brief"}
            </button>
          </div>

          <pre>{generationBrief}</pre>
        </section>
      )}

      {editing ? (
        <form
          className='character-form scene-edit-form'
          onSubmit={saveScene}
        >
          <div className='form-row'>
            <label>
              Scene Title
              <input
                name='title'
                value={form.title}
                onChange={updateField}
              />
            </label>

            <label>
              Location
              <input
                name='location'
                value={form.location}
                onChange={updateField}
              />
            </label>
          </div>

          <label>
            Action
            <textarea
              name='action'
              rows='5'
              value={form.action}
              onChange={updateField}
            />
          </label>

          <label>
            Camera
            <textarea
              name='camera'
              rows='3'
              value={form.camera}
              onChange={updateField}
            />
          </label>

          <label>
            Audio Direction
            <textarea
              name='audioDirection'
              rows='4'
              value={form.audioDirection}
              onChange={updateField}
            />
          </label>

          <label>
            Negative Instructions
            <textarea
              name='negativeInstructions'
              rows='4'
              value={form.negativeInstructions}
              onChange={updateField}
            />
          </label>

          <div className='form-row'>
            <label>
              Duration
              <input
                name='duration'
                type='number'
                min='1'
                max='30'
                value={form.duration}
                onChange={updateField}
              />
            </label>

            <label>
              Aspect Ratio
              <select
                name='aspectRatio'
                value={form.aspectRatio}
                onChange={updateField}
              >
                <option value='16:9'>16:9 Widescreen</option>

                <option value='9:16'>9:16 Vertical</option>

                <option value='1:1'>1:1 Square</option>
              </select>
            </label>
          </div>

          <fieldset className='scene-characters'>
            <legend>Characters</legend>

            {project.characters?.map((character) => (
              <label
                className='character-check'
                key={character.id}
              >
                <input
                  type='checkbox'
                  checked={form.characterIds.includes(character.id)}
                  onChange={() => toggleCharacter(character.id)}
                />

                <span>{character.name}</span>
              </label>
            ))}
          </fieldset>

          <div className='form-actions'>
            <button
              type='submit'
              className='primary-button'
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <section className='scene-detail-grid'>
          <div className='scene-info-panel'>
            <h3>Scene Brief</h3>

            <SceneField
              title='Action'
              value={scene.action}
            />

            <SceneField
              title='Camera'
              value={scene.camera}
            />

            <SceneField
              title='Audio Direction'
              value={scene.audioDirection}
            />

            <SceneField
              title='Negative Instructions'
              value={scene.negativeInstructions}
            />

            <SceneField
              title='Duration'
              value={`${scene.duration} seconds`}
            />

            <SceneField
              title='Aspect Ratio'
              value={scene.aspectRatio}
            />

            <div className='character-field'>
              <h4>Characters</h4>

              {cast.length > 0 ? (
                <div className='scene-cast-detail'>
                  {cast.map((character) => {
                    const primary =
                      character.referenceImages?.find(
                        (image) => image.isPrimary,
                      ) || character.referenceImages?.[0];

                    return (
                      <div
                        className='scene-character-row'
                        key={character.id}
                      >
                        <div className='scene-character-thumb'>
                          {primary ? (
                            <img
                              src={`http://localhost:3001` + primary.url}
                              alt={character.name}
                            />
                          ) : (
                            <span>🐾</span>
                          )}
                        </div>

                        <span>{character.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No characters selected.</p>
              )}
            </div>
          </div>

          <div className='starting-frame-panel'>
            <div className='reference-header'>
              <div>
                <h3>Starting Frame</h3>

                <p>The visual frame this scene should begin from.</p>
              </div>

              <div className='starting-frame-actions'>
                <button
                  type='button'
                  className='primary-button'
                  onClick={generateStartingFrame}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate Starting Frame"}
                </button>

                <label className='upload-button'>
                  {uploading
                    ? "Uploading..."
                    : scene.startingFrame
                      ? "Upload Replacement"
                      : "Upload Frame"}

                  <input
                    type='file'
                    accept='image/png,image/jpeg,image/webp'
                    onChange={uploadStartingFrame}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
            {scene.startingFrame ? (
              <div className='starting-frame-preview'>
                <img
                  src={`http://localhost:3001` + scene.startingFrame.url}
                  alt={`${scene.title} starting frame`}
                />

                <small>{scene.startingFrame.originalName}</small>
              </div>
            ) : (
              <div className='reference-empty'>
                <div>🎞️</div>

                <strong>No starting frame yet</strong>

                <p>
                  Upload an image now. Later, StoryForge will also be able to
                  generate this frame from the scene and character references.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function SceneField({ title, value }) {
  return (
    <div className='character-field'>
      <h4>{title}</h4>

      <p>{value || "Not defined yet."}</p>
    </div>
  );
}

function buildGenerationBrief(project, scene) {
  const characters =
    project.characters?.filter((character) =>
      scene.characterIds?.includes(character.id),
    ) || [];

  const sections = [];

  sections.push(
    [
      "SCENE",
      `Title: ${scene.title || "Untitled"}`,
      `Location: ${scene.location || "Not specified"}`,
      `Duration: ${scene.duration || 5} seconds`,
      `Aspect Ratio: ${scene.aspectRatio || "16:9"}`,
    ].join("\n"),
  );

  if (scene.action) {
    sections.push(["ACTION", scene.action].join("\n"));
  }

  if (scene.camera) {
    sections.push(["CAMERA", scene.camera].join("\n"));
  }

  if (scene.audioDirection) {
    sections.push(["AUDIO DIRECTION", scene.audioDirection].join("\n"));
  }

  if (characters.length > 0) {
    const characterText = characters
      .map((character) => {
        const primary =
          character.referenceImages?.find((image) => image.isPrimary) ||
          character.referenceImages?.[0];

        const references =
          character.referenceImages
            ?.map((image) => {
              const label = image.label || "Unlabeled";

              const note = image.note ? `: ${image.note}` : "";

              return `- ${label}${note}`;
            })
            .join("\n") || "- No reference images";

        return [
          character.name.toUpperCase(),
          `Type: ${character.species || "Not specified"}`,
          "",
          "Visual Identity:",
          character.visualDescription || "Not defined",
          "",
          "Movement:",
          character.movement || "Not defined",
          "",
          "Continuity Rules:",
          character.continuityRules || "Not defined",
          "",
          "Reference Guidance:",
          references,
          "",
          `Primary Reference: ${primary ? primary.originalName : "None"}`,
        ].join("\n");
      })
      .join("\n\n");

    sections.push(["CHARACTERS", characterText].join("\n\n"));
  }

  if (scene.negativeInstructions) {
    sections.push(
      ["NEGATIVE INSTRUCTIONS", scene.negativeInstructions].join("\n"),
    );
  }

  sections.push(
    [
      "STARTING FRAME",
      scene.startingFrame
        ? `Present: ${scene.startingFrame.originalName}`
        : "No starting frame supplied.",
    ].join("\n"),
  );

  return sections.join("\n\n");
}

export default App;
