const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const app = express();
const PORT = 3001;

const PROJECTS_DIR = path.resolve(__dirname, "../../projects");
const ASSETS_DIR = path.resolve(__dirname, "../../assets");

const referenceImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { projectId, characterId } = req.params;

      const directory = path.join(
        ASSETS_DIR,
        "projects",
        projectId,
        "characters",
        characterId,
      );

      await fs.mkdir(directory, { recursive: true });

      cb(null, directory);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage: referenceImageStorage,

  limits: {
    fileSize: 15 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }

    cb(null, true);
  },
});
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(ASSETS_DIR));

// Make sure the projects directory exists.
async function ensureProjectsDirectory() {
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
}

// Return all saved projects.
async function getProjects() {
  await ensureProjectsDirectory();

  const files = await fs.readdir(PROJECTS_DIR);

  const projectFiles = files.filter((file) =>
    file.toLowerCase().endsWith(".json"),
  );

  const projects = await Promise.all(
    projectFiles.map(async (file) => {
      const fullPath = path.join(PROJECTS_DIR, file);
      const contents = await fs.readFile(fullPath, "utf8");

      return JSON.parse(contents);
    }),
  );

  return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

async function ensureAssetsDirectory() {
  await fs.mkdir(ASSETS_DIR, { recursive: true });
}

// Server status
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "StoryForge server is running",
  });
});

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    console.error("Could not load projects:", error);

    res.status(500).json({
      error: "Could not load projects.",
    });
  }
});

// Create a project
app.post("/api/projects", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || "";

    if (!name) {
      return res.status(400).json({
        error: "Project name is required.",
      });
    }

    await ensureProjectsDirectory();

    const now = new Date().toISOString();

    const project = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
      characters: [],
      scenes: [],
      renders: [],
    };

    const filename = `${project.id}.json`;
    const fullPath = path.join(PROJECTS_DIR, filename);

    await fs.writeFile(fullPath, JSON.stringify(project, null, 2), "utf8");

    res.status(201).json(project);
  } catch (error) {
    console.error("Could not create project:", error);

    res.status(500).json({
      error: "Could not create project.",
    });
  }
});

app.post("/api/projects/:projectId/characters", async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      name,
      species,
      visualDescription,
      personality,
      movement,
      continuityRules,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "Character name is required.",
      });
    }

    const filename = `${projectId}.json`;
    const fullPath = path.join(PROJECTS_DIR, filename);

    let contents;

    try {
      contents = await fs.readFile(fullPath, "utf8");
    } catch {
      return res.status(404).json({
        error: "Project not found.",
      });
    }

    const project = JSON.parse(contents);

    const character = {
      id: crypto.randomUUID(),
      name: name.trim(),
      species: species?.trim() || "",
      visualDescription: visualDescription?.trim() || "",
      personality: personality?.trim() || "",
      movement: movement?.trim() || "",
      continuityRules: continuityRules?.trim() || "",
      referenceImages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    project.characters = project.characters || [];
    project.characters.push(character);
    project.updatedAt = new Date().toISOString();

    await fs.writeFile(fullPath, JSON.stringify(project, null, 2), "utf8");

    res.status(201).json({
      character,
      project,
    });
  } catch (error) {
    console.error("Could not create character:", error);

    res.status(500).json({
      error: "Could not create character.",
    });
  }
});

app.post(
  "/api/projects/:projectId/characters/:characterId/reference-images",
  upload.single("image"),
  async (req, res) => {
    try {
      const { projectId, characterId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          error: "Image file is required.",
        });
      }

      const projectPath = path.join(PROJECTS_DIR, `${projectId}.json`);

      let contents;

      try {
        contents = await fs.readFile(projectPath, "utf8");
      } catch {
        return res.status(404).json({
          error: "Project not found.",
        });
      }

      const project = JSON.parse(contents);

      const character = project.characters?.find(
        (item) => item.id === characterId,
      );

      if (!character) {
        return res.status(404).json({
          error: "Character not found.",
        });
      }

      const image = {
        id: crypto.randomUUID(),
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url:
          `/assets/projects/${projectId}` +
          `/characters/${characterId}` +
          `/${req.file.filename}`,
        createdAt: new Date().toISOString(),
      };

      character.referenceImages = character.referenceImages || [];

      character.referenceImages.push(image);

      character.updatedAt = new Date().toISOString();

      project.updatedAt = new Date().toISOString();

      await fs.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

      res.status(201).json({
        image,
        project,
      });
    } catch (error) {
      console.error("Could not upload reference image:", error);

      res.status(500).json({
        error: error.message || "Could not upload reference image.",
      });
    }
  },
);

Promise.all([ensureProjectsDirectory(), ensureAssetsDirectory()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`StoryForge server running on http://localhost:${PORT}`);
      console.log(`Projects stored in ${PROJECTS_DIR}`);
      console.log(`Assets stored in ${ASSETS_DIR}`);
    });
  })
  .catch((error) => {
    console.error("Could not start StoryForge:", error);
    process.exit(1);
  });
