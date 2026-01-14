# Harmony Central API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required. For production deployment, implement JWT or OAuth2.

## Rate Limits

- **General endpoints**: 100 requests per 15 minutes
- **Comparison endpoints**: 30 requests per 15 minutes
- **Creation endpoints**: 20 requests per 15 minutes

Rate limit headers:
- `RateLimit-Limit`: Total requests allowed in window
- `RateLimit-Remaining`: Requests remaining in window
- `RateLimit-Reset`: Time when rate limit resets

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T21:00:00.000Z"
}
```

---

### Songs

#### GET /api/songs

Get all songs in the database.

**Response**
```json
{
  "count": 4,
  "songs": [
    {
      "id": "song-1",
      "title": "Let It Be",
      "artist": "The Beatles",
      "progression": {
        "id": "prog-1",
        "chords": [
          { "romanNumeral": "I", "quality": "major" },
          { "romanNumeral": "V", "quality": "major" },
          { "romanNumeral": "vi", "quality": "minor" },
          { "romanNumeral": "IV", "quality": "major" }
        ],
        "key": "C major",
        "timeSignature": "4/4",
        "tempo": 73,
        "cadences": [...]
      },
      "createdAt": "2026-01-14T21:00:00.000Z",
      "updatedAt": "2026-01-14T21:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/songs/:id

Get a specific song by ID.

**Parameters**
- `id` (path): Song ID

**Response**
```json
{
  "id": "song-1",
  "title": "Let It Be",
  "artist": "The Beatles",
  "progression": { ... }
}
```

**Error Responses**
- `404 Not Found`: Song not found
```json
{
  "code": "NOT_FOUND",
  "message": "Song with id song-999 not found"
}
```

---

#### POST /api/songs

Create a new song.

**Request Body**
```json
{
  "title": "My Song",
  "artist": "Artist Name",
  "progression": {
    "chords": [
      { "romanNumeral": "I", "quality": "major" },
      { "romanNumeral": "V", "quality": "major" },
      { "romanNumeral": "vi", "quality": "minor" },
      { "romanNumeral": "IV", "quality": "major" }
    ],
    "key": "G major",
    "timeSignature": "4/4",
    "tempo": 120
  }
}
```

**Response**
```json
{
  "id": "song-1234567890",
  "title": "My Song",
  "artist": "Artist Name",
  "progression": {
    "id": "prog-1234567890",
    "chords": [...],
    "key": "G major",
    "cadences": [
      {
        "type": "authentic",
        "chords": [
          { "romanNumeral": "V", "quality": "major" },
          { "romanNumeral": "I", "quality": "major" }
        ],
        "position": 1,
        "strength": 0.9
      }
    ]
  },
  "createdAt": "2026-01-14T21:00:00.000Z",
  "updatedAt": "2026-01-14T21:00:00.000Z"
}
```

**Error Responses**
- `400 Bad Request`: Missing required fields
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Missing required fields: title, artist, progression"
}
```

---

#### GET /api/songs/search?q=query

Search songs by title or artist.

**Query Parameters**
- `q` (required): Search query string

**Example**
```
GET /api/songs/search?q=beatles
```

**Response**
```json
{
  "query": "beatles",
  "count": 1,
  "songs": [
    {
      "id": "song-1",
      "title": "Let It Be",
      "artist": "The Beatles",
      "progression": { ... }
    }
  ]
}
```

---

### Comparison

#### GET /api/compare/:songId

Find songs similar to a given song.

**Parameters**
- `songId` (path): ID of the song to compare

**Query Parameters**
- `limit` (optional, default: 10): Maximum number of similar songs to return
- `minSimilarity` (optional, default: 0.3): Minimum similarity score (0.0-1.0)

**Example**
```
GET /api/compare/song-1?limit=5&minSimilarity=0.5
```

**Response**
```json
{
  "requestedSongId": "song-1",
  "similarSongs": [
    {
      "song": {
        "id": "song-2",
        "title": "Don't Stop Believin'",
        "artist": "Journey",
        "progression": { ... }
      },
      "similarity": {
        "songId1": "song-1",
        "songId2": "song-2",
        "overallScore": 0.95,
        "progressionSimilarity": 1.0,
        "cadenceSimilarity": 0.85,
        "structuralSimilarity": 0.8,
        "matchingPatterns": ["I-V-vi-IV"]
      }
    }
  ]
}
```

**Similarity Scores Explained**
- `overallScore`: Combined similarity (0.0-1.0)
  - 0.9-1.0: Very similar
  - 0.7-0.9: Similar
  - 0.5-0.7: Somewhat similar
  - 0.3-0.5: Loosely similar
  - 0.0-0.3: Different

- `progressionSimilarity`: How similar the chord progressions are
- `cadenceSimilarity`: How similar the cadence patterns are
- `structuralSimilarity`: How similar the key, tempo, and structure are
- `matchingPatterns`: Common chord sequences found in both songs

**Error Responses**
- `404 Not Found`: Song not found
```json
{
  "code": "NOT_FOUND",
  "message": "Song with id song-999 not found"
}
```

---

#### POST /api/compare

Compare a song with others using POST method.

**Request Body**
```json
{
  "songId": "song-1",
  "limit": 5,
  "minSimilarity": 0.5
}
```

**Response**
Same as GET endpoint above.

---

## Error Handling

All errors follow this format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": { ... }  // Optional additional information
}
```

**Common Error Codes**
- `VALIDATION_ERROR` (400): Invalid request data
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## Chord Quality Types

```typescript
enum ChordQuality {
  Major = "major",
  Minor = "minor",
  Diminished = "diminished",
  Augmented = "augmented",
  Dominant7 = "dominant7",
  Major7 = "major7",
  Minor7 = "minor7",
  HalfDiminished7 = "halfdiminished7",
  Diminished7 = "diminished7"
}
```

## Cadence Types

```typescript
enum CadenceType {
  Authentic = "authentic",    // V-I or V7-I (strong resolution)
  Plagal = "plagal",          // IV-I ("Amen" cadence)
  Deceptive = "deceptive",    // V-vi (unexpected)
  HalfCadence = "half"        // ends on V (leaves tension)
}
```

---

## Example Usage

### Find Similar Songs

```bash
# Get similar songs to "Let It Be"
curl http://localhost:3000/api/compare/song-1

# Get top 3 very similar songs (score > 0.7)
curl "http://localhost:3000/api/compare/song-1?limit=3&minSimilarity=0.7"
```

### Search and Compare

```bash
# Search for a song
curl "http://localhost:3000/api/songs/search?q=adele"

# Use the returned ID to find similar songs
curl http://localhost:3000/api/compare/song-3
```

### Create and Compare

```bash
# Create a new song
curl -X POST http://localhost:3000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Song",
    "artist": "Test Artist",
    "progression": {
      "chords": [
        {"romanNumeral": "I", "quality": "major"},
        {"romanNumeral": "V", "quality": "major"},
        {"romanNumeral": "vi", "quality": "minor"},
        {"romanNumeral": "IV", "quality": "major"}
      ],
      "key": "C major"
    }
  }'

# Compare the newly created song
curl http://localhost:3000/api/compare/song-1234567890
```
