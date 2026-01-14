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
import { ComparisonResponse } from "@harmony-central/types";

/**
 * Create comparison routes for harmonic analysis
 */
export function createComparisonRoutes(
  songRepo: SongRepository,
  harmonicService: HarmonicAnalysisService
): Router {
  const router = Router();

  /**
   * POST /compare - Compare a song with others in the database
   */
  router.post(
    "/",
    createRateLimiter(rateLimitConfigs.comparison),
    (req: Request, res: Response) => {
      const { songId, limit = 10, minSimilarity = 0.3 } = req.body;

      if (!songId) {
        throw new ValidationError("songId is required");
      }

      const targetSong = songRepo.getSongById(songId);
      if (!targetSong) {
        throw new NotFoundError(`Song with id ${songId} not found`);
      }

      // Compare with all other songs
      const allSongs = songRepo.getAllSongs();
      const similarities = allSongs
        .filter((song) => song.id !== songId)
        .map((song) => {
          const similarity = harmonicService.compareProgressions(
            targetSong.progression,
            song.progression,
            targetSong.id,
            song.id
          );
          return { song, similarity };
        })
        .filter((result) => result.similarity.overallScore >= minSimilarity)
        .sort((a, b) => b.similarity.overallScore - a.similarity.overallScore)
        .slice(0, limit);

      const response: ComparisonResponse = {
        requestedSongId: songId,
        similarSongs: similarities,
      };

      res.json(response);
    }
  );

  /**
   * GET /compare/:songId - Compare a song with others (GET endpoint)
   */
  router.get(
    "/:songId",
    createRateLimiter(rateLimitConfigs.comparison),
    (req: Request, res: Response) => {
      const songId = req.params.songId;
      const limit = parseInt(req.query.limit as string) || 10;
      const minSimilarity =
        parseFloat(req.query.minSimilarity as string) || 0.3;

      const targetSong = songRepo.getSongById(songId);
      if (!targetSong) {
        throw new NotFoundError(`Song with id ${songId} not found`);
      }

      // Compare with all other songs
      const allSongs = songRepo.getAllSongs();
      const similarities = allSongs
        .filter((song) => song.id !== songId)
        .map((song) => {
          const similarity = harmonicService.compareProgressions(
            targetSong.progression,
            song.progression,
            targetSong.id,
            song.id
          );
          return { song, similarity };
        })
        .filter((result) => result.similarity.overallScore >= minSimilarity)
        .sort((a, b) => b.similarity.overallScore - a.similarity.overallScore)
        .slice(0, limit);

      const response: ComparisonResponse = {
        requestedSongId: songId,
        similarSongs: similarities,
      };

      res.json(response);
    }
  );

  return router;
}
