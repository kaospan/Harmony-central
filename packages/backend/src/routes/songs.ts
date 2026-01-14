import { Router, Request, Response } from "express";
import { SongRepository } from "../services/songRepository";
import { HarmonicAnalysisService } from "../services/harmonicAnalysis";
import {
  NotFoundError,
  ValidationError,
} from "../middleware/errorHandler";
import {
  createRateLimiter,
  rateLimitConfigs,
} from "../middleware/rateLimiter";

/**
 * Create song routes
 */
export function createSongRoutes(
  songRepo: SongRepository,
  harmonicService: HarmonicAnalysisService
): Router {
  const router = Router();

  /**
   * GET /songs/search - Search songs
   */
  router.get(
    "/search",
    createRateLimiter(rateLimitConfigs.general),
    (req: Request, res: Response) => {
      const query = req.query.q as string;
      if (!query) {
        throw new ValidationError("Search query parameter 'q' is required");
      }

      const songs = songRepo.searchSongs(query);
      res.json({
        query,
        count: songs.length,
        songs,
      });
    }
  );

  /**
   * GET /songs - Get all songs
   */
  router.get(
    "/",
    createRateLimiter(rateLimitConfigs.general),
    (req: Request, res: Response) => {
      const songs = songRepo.getAllSongs();
      res.json({
        count: songs.length,
        songs,
      });
    }
  );

  /**
   * GET /songs/:id - Get song by ID
   */
  router.get(
    "/:id",
    createRateLimiter(rateLimitConfigs.general),
    (req: Request, res: Response) => {
      const song = songRepo.getSongById(req.params.id);
      if (!song) {
        throw new NotFoundError(`Song with id ${req.params.id} not found`);
      }
      res.json(song);
    }
  );

  /**
   * POST /songs - Create a new song
   */
  router.post(
    "/",
    createRateLimiter(rateLimitConfigs.creation),
    (req: Request, res: Response) => {
      const { title, artist, progression } = req.body;

      // Validate required fields
      if (!title || !artist || !progression) {
        throw new ValidationError(
          "Missing required fields: title, artist, progression"
        );
      }

      const song = songRepo.addSong({
        id: `song-${Date.now()}`,
        title,
        artist,
        progression: {
          ...progression,
          cadences:
            progression.cadences ||
            harmonicService.detectCadences(progression),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json(song);
    }
  );

  return router;
}
