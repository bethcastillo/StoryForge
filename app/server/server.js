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

const sceneImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { projectId, sceneId } = req.params;

      const directory = path.join(
        ASSETS_DIR,
        "projects",
        projectId,
        "scenes",
        sceneId,
      );

      await fs.mkdir(directory, { recursive: true });

      cb(null, directory);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${crypto.randomUUID()}${extension}`);
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

const sceneImageUpload = multer({
  storage: sceneImageStorage,

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

      const isFirstImage =
        !character.referenceImages || character.referenceImages.length === 0;

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

        label: isFirstImage ? "Primary" : "Unlabeled",
        note: "",
        isPrimary: isFirstImage,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

app.patch(
  "/api/projects/:projectId/characters/:characterId/reference-images/:imageId",
  async (req, res) => {
    try {
      const { projectId, characterId, imageId } = req.params;

      const { label, note, isPrimary } = req.body;

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

      const image = character.referenceImages?.find(
        (item) => item.id === imageId,
      );

      if (!image) {
        return res.status(404).json({
          error: "Reference image not found.",
        });
      }

      if (typeof label === "string") {
        image.label = label.trim() || "Unlabeled";
      }

      if (typeof note === "string") {
        image.note = note.trim();
      }

      if (isPrimary === true) {
        character.referenceImages.forEach((item) => {
          item.isPrimary = false;
        });

        image.isPrimary = true;

        if (!image.label || image.label === "Unlabeled") {
          image.label = "Primary";
        }
      }

      image.updatedAt = new Date().toISOString();

      character.updatedAt = new Date().toISOString();

      project.updatedAt = new Date().toISOString();

      await fs.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

      res.json({
        image,
        project,
      });
    } catch (error) {
      console.error("Could not update reference image:", error);

      res.status(500).json({
        error: "Could not update reference image.",
      });
    }
  },
);

app.delete(
  "/api/projects/:projectId/characters/:characterId/reference-images/:imageId",
  async (req, res) => {
    try {
      const { projectId, characterId, imageId } = req.params;

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

      const imageIndex = character.referenceImages?.findIndex(
        (item) => item.id === imageId,
      );

      if (imageIndex === undefined || imageIndex < 0) {
        return res.status(404).json({
          error: "Reference image not found.",
        });
      }

      const [removedImage] = character.referenceImages.splice(imageIndex, 1);

      const imagePath = path.join(
        ASSETS_DIR,
        "projects",
        projectId,
        "characters",
        characterId,
        removedImage.filename,
      );

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }

      if (removedImage.isPrimary && character.referenceImages.length > 0) {
        character.referenceImages[0].isPrimary = true;

        if (
          !character.referenceImages[0].label ||
          character.referenceImages[0].label === "Unlabeled"
        ) {
          character.referenceImages[0].label = "Primary";
        }
      }

      character.updatedAt = new Date().toISOString();

      project.updatedAt = new Date().toISOString();

      await fs.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

      res.json({
        project,
      });
    } catch (error) {
      console.error("Could not delete reference image:", error);

      res.status(500).json({
        error: "Could not delete reference image.",
      });
    }
  },
);

app.post("/api/projects/:projectId/scenes", async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      location,
      action,
      camera,
      duration,
      aspectRatio,
      characterIds,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "Scene title is required.",
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

    const scene = {
      id: crypto.randomUUID(),
      title: title.trim(),
      location: location?.trim() || "",
      action: action?.trim() || "",
      camera: camera?.trim() || "",
      duration: Number(duration) || 5,
      aspectRatio: aspectRatio || "16:9",
      characterIds: Array.isArray(characterIds) ? characterIds : [],
      startingFrame: null,
      renders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    project.scenes = project.scenes || [];
    project.scenes.push(scene);
    project.updatedAt = new Date().toISOString();

    await fs.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

    res.status(201).json({
      scene,
      project,
    });
  } catch (error) {
    console.error("Could not create scene:", error);

    res.status(500).json({
      error: "Could not create scene.",
    });
  }
});

app.patch("/api/projects/:projectId/scenes/:sceneId", async (req, res) => {
  try {
    const { projectId, sceneId } = req.params;

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

    const scene = project.scenes?.find((item) => item.id === sceneId);

    if (!scene) {
      return res.status(404).json({
        error: "Scene not found.",
      });
    }

    const {
      title,
      location,
      action,
      camera,
      duration,
      aspectRatio,
      characterIds,
    } = req.body;

    if (typeof title === "string") {
      if (!title.trim()) {
        return res.status(400).json({
          error: "Scene title is required.",
        });
      }

      scene.title = title.trim();
    }

    if (typeof location === "string") {
      scene.location = location.trim();
    }

    if (typeof action === "string") {
      scene.action = action.trim();
    }

    if (typeof camera === "string") {
      scene.camera = camera.trim();
    }

    if (duration !== undefined) {
      scene.duration = Number(duration) || 5;
    }

    if (typeof aspectRatio === "string") {
      scene.aspectRatio = aspectRatio;
    }

    if (Array.isArray(characterIds)) {
      scene.characterIds = characterIds;
    }

    scene.updatedAt = new Date().toISOString();
    project.updatedAt = new Date().toISOString();

    await fs.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

    res.json({
      scene,
      project,
    });
  } catch (error) {
    console.error("Could not update scene:", error);

    res.status(500).json({
      error: "Could not update scene.",
    });
  }
});

app.post(
  "/api/projects/:projectId/scenes/:sceneId/starting-frame",
  sceneImageUpload.single("image"),
  async (req, res) => {
    try {
      const { projectId, sceneId } = req.params;

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

      const scene = project.scenes?.find((item) => item.id === sceneId);

      if (!scene) {
        return res.status(404).json({
          error: "Scene not found.",
        });
      }

      // Remove the previous starting frame file if one exists.
      if (scene.startingFrame?.filename) {
        const oldPath = path.join(
          ASSETS_DIR,
          "projects",
          projectId,
          "scenes",
          sceneId,
          scene.startingFrame.filename,
        );

        try {
          await fs.unlink(oldPath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            throw error;
          }
        }
      }

      scene.startingFrame = {
        id: crypto.randomUUID(),
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,

        url:
          `/assets/projects/${projectId}` +
          `/scenes/${sceneId}` +
          `/${req.file.filename}`,

        createdAt: new Date().toISOString(),
      };

      scene.updatedAt = new Date().toISOString();
      project.updatedAt = new Date().toISOString();

      await fs.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

      res.status(201).json({
        scene,
        project,
      });
    } catch (error) {
      console.error("Could not upload starting frame:", error);

      res.status(500).json({
        error: error.message || "Could not upload starting frame.",
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
