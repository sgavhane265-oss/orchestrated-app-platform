const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5000;

app.use(express.json());

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || "mernapp";

let tasks;

async function startServer() {
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is missing");
  }

  const client = new MongoClient(mongoUri);

  await client.connect();

  const database = client.db(dbName);
  tasks = database.collection("tasks");

  console.log("Connected to MongoDB");

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "mern-backend"
    });
  });

  app.get("/api/tasks", async (req, res, next) => {
    try {
      const result = await tasks
        .find({})
        .sort({ _id: -1 })
        .toArray();

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/tasks", async (req, res, next) => {
    try {
      const title = String(req.body.title || "").trim();

      if (!title) {
        return res.status(400).json({
          error: "Task title is required"
        });
      }

      const task = {
        title,
        completed: false,
        createdAt: new Date()
      };

      const result = await tasks.insertOne(task);

      res.status(201).json({
        ...task,
        _id: result.insertedId
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Backend startup failed:", error);
  process.exit(1);
});
