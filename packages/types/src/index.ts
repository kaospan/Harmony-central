/**
 * Roman numeral representation of a chord within a key
 * Examples: "I", "ii", "V7", "vi"
 */
export type RomanNumeral = string;

/**
 * Chord quality/type
 */
export enum ChordQuality {
  Major = "major",
  Minor = "minor",
  Diminished = "diminished",
  Augmented = "augmented",
  Dominant7 = "dominant7",
  Major7 = "major7",
  Minor7 = "minor7",
  HalfDiminished7 = "halfdiminished7",
  Diminished7 = "diminished7",
}

/**
 * A single chord in a progression
 */
export interface Chord {
  romanNumeral: RomanNumeral;
  quality: ChordQuality;
  duration?: number; // Optional: beats or measures
  inversion?: number; // 0 = root position, 1 = first inversion, etc.
}

/**
 * Types of musical cadences
 */
export enum CadenceType {
  Authentic = "authentic", // V-I or V7-I
  Plagal = "plagal", // IV-I
  Deceptive = "deceptive", // V-vi
  HalfCadence = "half", // ends on V
}

/**
 * A cadence within a progression
 */
export interface Cadence {
  type: CadenceType;
  chords: Chord[];
  position: number; // Index in the progression
  strength: number; // 0-1, how strong/resolved the cadence feels
}

/**
 * Complete chord progression for a song or section
 */
export interface ChordProgression {
  id: string;
  chords: Chord[];
  key: string; // e.g., "C major", "A minor"
  timeSignature?: string; // e.g., "4/4", "3/4"
  tempo?: number; // BPM
  cadences: Cadence[];
}

/**
 * Metadata about a song (minimal, no audio data)
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  progression: ChordProgression;
  sections?: {
    name: string; // "verse", "chorus", "bridge"
    progression: ChordProgression;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comparison result between two songs
 */
export interface SimilarityScore {
  songId1: string;
  songId2: string;
  overallScore: number; // 0-1, where 1 is most similar
  progressionSimilarity: number; // 0-1
  cadenceSimilarity: number; // 0-1
  structuralSimilarity: number; // 0-1
  matchingPatterns: string[]; // Descriptions of matching patterns
}

/**
 * Request to compare songs
 */
export interface ComparisonRequest {
  songId: string;
  limit?: number; // Max number of similar songs to return
  minSimilarity?: number; // Minimum similarity threshold (0-1)
}

/**
 * Response with similar songs
 */
export interface ComparisonResponse {
  requestedSongId: string;
  similarSongs: Array<{
    song: Song;
    similarity: SimilarityScore;
  }>;
}

/**
 * API rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
