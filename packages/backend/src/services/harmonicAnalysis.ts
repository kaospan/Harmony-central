import {
  Chord,
  ChordProgression,
  Cadence,
  CadenceType,
  ChordQuality,
  SimilarityScore,
} from "@harmony-central/types";

/**
 * Harmonic Analysis Service
 * Provides methods for analyzing chord progressions, detecting cadences,
 * and comparing harmonic structures between songs.
 */
export class HarmonicAnalysisService {
  /**
   * Detect cadences in a chord progression
   */
  detectCadences(progression: ChordProgression): Cadence[] {
    const cadences: Cadence[] = [];
    const chords = progression.chords;

    for (let i = 0; i < chords.length - 1; i++) {
      const current = chords[i];
      const next = chords[i + 1];
      const cadence = this.identifyCadence(current, next);

      if (cadence) {
        cadences.push({
          type: cadence.type,
          chords: [current, next],
          position: i,
          strength: cadence.strength,
        });
      }
    }

    return cadences;
  }

  /**
   * Identify a cadence between two chords
   */
  private identifyCadence(
    chord1: Chord,
    chord2: Chord
  ): { type: CadenceType; strength: number } | null {
    const rn1 = chord1.romanNumeral.toUpperCase();
    const rn2 = chord2.romanNumeral.toUpperCase();

    // Authentic cadence: V-I or V7-I
    if (
      (rn1.startsWith("V") || rn1.startsWith("V7")) &&
      rn2.startsWith("I") &&
      !rn2.includes("I")
    ) {
      return { type: CadenceType.Authentic, strength: 0.9 };
    }

    // Plagal cadence: IV-I
    if (rn1.startsWith("IV") && rn2.startsWith("I")) {
      return { type: CadenceType.Plagal, strength: 0.7 };
    }

    // Deceptive cadence: V-vi
    if (rn1.startsWith("V") && rn2.toLowerCase().startsWith("vi")) {
      return { type: CadenceType.Deceptive, strength: 0.6 };
    }

    // Half cadence: ends on V
    if (rn2.startsWith("V") && !rn2.includes("I")) {
      return { type: CadenceType.HalfCadence, strength: 0.5 };
    }

    return null;
  }

  /**
   * Compare two chord progressions and return similarity score
   */
  compareProgressions(
    prog1: ChordProgression,
    prog2: ChordProgression,
    songId1: string,
    songId2: string
  ): SimilarityScore {
    const progressionSim = this.calculateProgressionSimilarity(
      prog1.chords,
      prog2.chords
    );
    const cadenceSim = this.calculateCadenceSimilarity(
      prog1.cadences,
      prog2.cadences
    );
    const structuralSim = this.calculateStructuralSimilarity(prog1, prog2);

    // Weighted average of different similarity metrics
    const overallScore =
      progressionSim * 0.5 + cadenceSim * 0.3 + structuralSim * 0.2;

    const matchingPatterns = this.findMatchingPatterns(
      prog1.chords,
      prog2.chords
    );

    return {
      songId1,
      songId2,
      overallScore,
      progressionSimilarity: progressionSim,
      cadenceSimilarity: cadenceSim,
      structuralSimilarity: structuralSim,
      matchingPatterns,
    };
  }

  /**
   * Calculate similarity between two chord sequences
   * Uses Levenshtein-like algorithm adapted for chord progressions
   */
  private calculateProgressionSimilarity(
    chords1: Chord[],
    chords2: Chord[]
  ): number {
    if (chords1.length === 0 && chords2.length === 0) return 1.0;
    if (chords1.length === 0 || chords2.length === 0) return 0.0;

    // Create similarity matrix using dynamic programming
    const m = chords1.length;
    const n = chords2.length;
    const matrix: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    // Initialize first row and column
    for (let i = 0; i <= m; i++) matrix[i][0] = i;
    for (let j = 0; j <= n; j++) matrix[0][j] = j;

    // Fill matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = this.chordSimilarity(chords1[i - 1], chords2[j - 1]);
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + (1 - cost) // substitution
        );
      }
    }

    const distance = matrix[m][n];
    const maxLen = Math.max(m, n);
    return 1 - distance / maxLen;
  }

  /**
   * Calculate similarity between two individual chords
   */
  private chordSimilarity(chord1: Chord, chord2: Chord): number {
    if (chord1.romanNumeral === chord2.romanNumeral) {
      return chord1.quality === chord2.quality ? 1.0 : 0.8;
    }

    // Check if they're functional equivalents (e.g., I and iii in relative keys)
    const rn1 = chord1.romanNumeral.toUpperCase();
    const rn2 = chord2.romanNumeral.toUpperCase();

    if (rn1 === rn2) return 0.6; // Same degree, different quality
    if (this.areFunctionallyRelated(rn1, rn2)) return 0.4;

    return 0.0;
  }

  /**
   * Check if two chord degrees are functionally related
   */
  private areFunctionallyRelated(rn1: string, rn2: string): boolean {
    const tonic = ["I", "III", "VI"];
    const subdominant = ["II", "IV"];
    const dominant = ["V", "VII"];

    const inGroup = (rn: string, group: string[]) =>
      group.some((g) => rn.startsWith(g));

    return (
      (inGroup(rn1, tonic) && inGroup(rn2, tonic)) ||
      (inGroup(rn1, subdominant) && inGroup(rn2, subdominant)) ||
      (inGroup(rn1, dominant) && inGroup(rn2, dominant))
    );
  }

  /**
   * Calculate similarity between cadence patterns
   */
  private calculateCadenceSimilarity(
    cadences1: Cadence[],
    cadences2: Cadence[]
  ): number {
    if (cadences1.length === 0 && cadences2.length === 0) return 1.0;
    if (cadences1.length === 0 || cadences2.length === 0) return 0.0;

    let matchCount = 0;
    const types1 = cadences1.map((c) => c.type);
    const types2 = cadences2.map((c) => c.type);

    // Count matching cadence types
    for (const type1 of types1) {
      if (types2.includes(type1)) {
        matchCount++;
      }
    }

    return matchCount / Math.max(types1.length, types2.length);
  }

  /**
   * Calculate structural similarity (key, time signature, length)
   */
  private calculateStructuralSimilarity(
    prog1: ChordProgression,
    prog2: ChordProgression
  ): number {
    let score = 0;
    let factors = 0;

    // Compare keys (same key = higher similarity)
    if (prog1.key && prog2.key) {
      factors++;
      if (prog1.key === prog2.key) {
        score += 1.0;
      } else if (this.areRelativeKeys(prog1.key, prog2.key)) {
        score += 0.6;
      }
    }

    // Compare time signatures
    if (prog1.timeSignature && prog2.timeSignature) {
      factors++;
      score += prog1.timeSignature === prog2.timeSignature ? 1.0 : 0.3;
    }

    // Compare progression lengths
    factors++;
    const lenDiff = Math.abs(prog1.chords.length - prog2.chords.length);
    const avgLen = (prog1.chords.length + prog2.chords.length) / 2;
    score += 1 - lenDiff / avgLen;

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Check if two keys are relative (e.g., C major and A minor)
   */
  private areRelativeKeys(key1: string, key2: string): boolean {
    // Simplified check - in production, use a proper music theory library
    const relatives: Record<string, string> = {
      "C major": "A minor",
      "A minor": "C major",
      "G major": "E minor",
      "E minor": "G major",
      "D major": "B minor",
      "B minor": "D major",
      "A major": "F# minor",
      "F# minor": "A major",
      "E major": "C# minor",
      "C# minor": "E major",
      "B major": "G# minor",
      "G# minor": "B major",
      "F major": "D minor",
      "D minor": "F major",
      "Bb major": "G minor",
      "G minor": "Bb major",
      "Eb major": "C minor",
      "C minor": "Eb major",
    };

    return relatives[key1] === key2;
  }

  /**
   * Find matching patterns between two progressions
   */
  private findMatchingPatterns(chords1: Chord[], chords2: Chord[]): string[] {
    const patterns: string[] = [];

    // Look for common chord sequences of length 2-4
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i <= chords1.length - len; i++) {
        const pattern1 = chords1
          .slice(i, i + len)
          .map((c) => c.romanNumeral)
          .join("-");

        for (let j = 0; j <= chords2.length - len; j++) {
          const pattern2 = chords2
            .slice(j, j + len)
            .map((c) => c.romanNumeral)
            .join("-");

          if (pattern1 === pattern2 && !patterns.includes(pattern1)) {
            patterns.push(pattern1);
          }
        }
      }
    }

    return patterns.slice(0, 5); // Return top 5 patterns
  }
}
