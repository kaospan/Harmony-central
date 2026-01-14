import express, { Application } from "express";
import { SongRepository } from "./services/songRepository";
import { HarmonicAnalysisService } from "./services/harmonicAnalysis";
import { createSongRoutes } from "./routes/songs";
import { createComparisonRoutes } from "./routes/comparison";
import { errorHandler } from "./middleware/errorHandler";

/**
 * Create and configure the Express application
 */
export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize services
  const songRepo = new SongRepository();
  const harmonicService = new HarmonicAnalysisService();

  // Initialize with sample data
  songRepo.initializeSampleData();

  // Detect cadences for all sample songs
  const allSongs = songRepo.getAllSongs();
  allSongs.forEach((song) => {
    if (song.progression.cadences.length === 0) {
      song.progression.cadences =
        harmonicService.detectCadences(song.progression);
    }
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API info endpoint
  app.get("/", (req, res) => {
    res.json({
      name: "Harmony Central API",
      version: "0.1.0",
      description:
        "Music discovery platform that connects songs by harmonic structure",
      endpoints: {
        health: "GET /health",
        songs: {
          list: "GET /api/songs",
          get: "GET /api/songs/:id",
          create: "POST /api/songs",
          search: "GET /api/songs/search?q=query",
        },
        comparison: {
          compare: "POST /api/compare",
          get: "GET /api/compare/:songId",
        },
      },
    });
  });

  // API routes
  app.use("/api/songs", createSongRoutes(songRepo, harmonicService));
  app.use("/api/compare", createComparisonRoutes(songRepo, harmonicService));

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 */
export function startServer(port: number = 3000): void {
  const app = createApp();

  app.listen(port, () => {
    console.log(`🎵 Harmony Central API server listening on port ${port}`);
    console.log(`📖 API documentation: http://localhost:${port}/`);
    console.log(`💚 Health check: http://localhost:${port}/health`);
  });
}

// Start server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || "3000", 10);
  startServer(port);
}
