import { Song, ChordProgression } from "@harmony-central/types";

/**
 * In-memory song repository
 * In production, this would be replaced with a database
 */
export class SongRepository {
  private songs: Map<string, Song> = new Map();

  /**
   * Get all songs
   */
  getAllSongs(): Song[] {
    return Array.from(this.songs.values());
  }

  /**
   * Get song by ID
   */
  getSongById(id: string): Song | undefined {
    return this.songs.get(id);
  }

  /**
   * Add a new song
   */
  addSong(song: Song): Song {
    this.songs.set(song.id, song);
    return song;
  }

  /**
   * Update an existing song
   */
  updateSong(id: string, updates: Partial<Song>): Song | undefined {
    const song = this.songs.get(id);
    if (!song) return undefined;

    const updatedSong = { ...song, ...updates, updatedAt: new Date() };
    this.songs.set(id, updatedSong);
    return updatedSong;
  }

  /**
   * Delete a song
   */
  deleteSong(id: string): boolean {
    return this.songs.delete(id);
  }

  /**
   * Search songs by artist or title
   */
  searchSongs(query: string): Song[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.songs.values()).filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Initialize with sample data for testing
   */
  initializeSampleData(): void {
    // Sample song 1: "Let It Be" - The Beatles
    this.addSong({
      id: "song-1",
      title: "Let It Be",
      artist: "The Beatles",
      progression: {
        id: "prog-1",
        chords: [
          { romanNumeral: "I", quality: "major" as any },
          { romanNumeral: "V", quality: "major" as any },
          { romanNumeral: "vi", quality: "minor" as any },
          { romanNumeral: "IV", quality: "major" as any },
        ],
        key: "C major",
        timeSignature: "4/4",
        tempo: 73,
        cadences: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample song 2: "Don't Stop Believin'" - Journey
    this.addSong({
      id: "song-2",
      title: "Don't Stop Believin'",
      artist: "Journey",
      progression: {
        id: "prog-2",
        chords: [
          { romanNumeral: "I", quality: "major" as any },
          { romanNumeral: "V", quality: "major" as any },
          { romanNumeral: "vi", quality: "minor" as any },
          { romanNumeral: "IV", quality: "major" as any },
        ],
        key: "E major",
        timeSignature: "4/4",
        tempo: 119,
        cadences: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample song 3: "Someone Like You" - Adele
    this.addSong({
      id: "song-3",
      title: "Someone Like You",
      artist: "Adele",
      progression: {
        id: "prog-3",
        chords: [
          { romanNumeral: "I", quality: "major" as any },
          { romanNumeral: "V", quality: "major" as any },
          { romanNumeral: "vi", quality: "minor" as any },
          { romanNumeral: "IV", quality: "major" as any },
        ],
        key: "A major",
        timeSignature: "4/4",
        tempo: 67,
        cadences: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample song 4: "Hotel California" - Eagles
    this.addSong({
      id: "song-4",
      title: "Hotel California",
      artist: "Eagles",
      progression: {
        id: "prog-4",
        chords: [
          { romanNumeral: "vi", quality: "minor" as any },
          { romanNumeral: "IV", quality: "major" as any },
          { romanNumeral: "I", quality: "major" as any },
          { romanNumeral: "V", quality: "major" as any },
        ],
        key: "B minor",
        timeSignature: "4/4",
        tempo: 74,
        cadences: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
