import { Song, ComparisonResponse } from "@harmony-central/types";

/**
 * API Service for communicating with the Harmony Central backend
 */
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all songs
   */
  async getSongs(): Promise<Song[]> {
    const response = await fetch(`${this.baseUrl}/songs`);
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }
    const data = await response.json();
    return data.songs;
  }

  /**
   * Get song by ID
   */
  async getSongById(id: string): Promise<Song> {
    const response = await fetch(`${this.baseUrl}/songs/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch song ${id}`);
    }
    return response.json();
  }

  /**
   * Search songs
   */
  async searchSongs(query: string): Promise<Song[]> {
    const response = await fetch(
      `${this.baseUrl}/songs/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search songs");
    }
    const data = await response.json();
    return data.songs;
  }

  /**
   * Compare a song with others
   */
  async compareSongs(
    songId: string,
    limit?: number,
    minSimilarity?: number
  ): Promise<ComparisonResponse> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (minSimilarity) params.append("minSimilarity", minSimilarity.toString());

    const response = await fetch(
      `${this.baseUrl}/compare/${songId}?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to compare songs");
    }
    return response.json();
  }

  /**
   * Create a new song
   */
  async createSong(song: {
    title: string;
    artist: string;
    progression: any;
  }): Promise<Song> {
    const response = await fetch(`${this.baseUrl}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(song),
    });
    if (!response.ok) {
      throw new Error("Failed to create song");
    }
    return response.json();
  }
}
