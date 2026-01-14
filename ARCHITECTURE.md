# Architecture Documentation

## Overview

Harmony Central is a cross-platform music discovery application that connects songs by their harmonic structure rather than genre. The system analyzes Roman-numeral chord progressions, cadences, and harmonic patterns to find musically related songs.

## System Architecture

### High-Level Design

```
┌─────────────────┐
│   Mobile Apps   │
│  (iOS/Android)  │
│  React Native   │
└────────┬────────┘
         │
         │ REST API
         │
┌────────▼────────┐
│   Backend API   │
│   Express.js    │
│   TypeScript    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───────┐
│ Song │  │ Harmonic │
│ Repo │  │ Analysis │
└──────┘  └──────────┘
```

## Project Structure

```
harmony-central/
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── backend/         # Express.js API server
│   └── mobile/          # React Native app (iOS/Android)
├── package.json         # Workspace configuration
└── tsconfig.json        # Base TypeScript config
```

## Core Principles

### 1. Cost-Aware Design

- **Rate Limiting**: All API endpoints have rate limits to prevent abuse
  - General endpoints: 100 requests / 15 minutes
  - Comparison endpoint: 30 requests / 15 minutes
  - Creation endpoint: 20 requests / 15 minutes

- **No Audio Storage**: Only chord progression metadata is stored
  - No audio files
  - No streaming infrastructure
  - Minimal storage footprint

- **Efficient Algorithms**: O(n²) worst-case for progression comparison
  - Dynamic programming for chord similarity
  - In-memory caching for frequently accessed data

### 2. Minimal Dependencies

The project uses only essential dependencies:

**Backend:**
- `express` - Web framework
- `express-rate-limit` - Rate limiting middleware

**Shared:**
- `typescript` - Type safety
- `@types/node` - Node.js type definitions

**Mobile:**
- React Native (to be initialized) - Cross-platform framework

### 3. Modular Architecture

Each package has a clear responsibility:

- **types**: Shared type definitions, no runtime code
- **backend**: API server, business logic, harmonic analysis
- **mobile**: UI, user interactions, API client

## Core Concepts

### Harmonic Analysis

The system analyzes three main aspects:

1. **Chord Progressions**: Sequences of Roman numeral chords
   - Example: I-V-vi-IV (very common pop progression)

2. **Cadences**: Musical phrases that create resolution
   - Authentic (V-I): Strong resolution
   - Plagal (IV-I): "Amen" cadence
   - Deceptive (V-vi): Unexpected resolution
   - Half (ends on V): Leaves tension

3. **Harmonic Similarity**: Multi-factor comparison
   - Progression similarity (50% weight)
   - Cadence similarity (30% weight)
   - Structural similarity (20% weight)

### Similarity Algorithm

The comparison algorithm uses:

1. **Dynamic Programming**: Levenshtein-like distance for chord sequences
2. **Functional Analysis**: Groups chords by tonic/subdominant/dominant function
3. **Pattern Matching**: Finds common subsequences of 2-4 chords
4. **Weighted Scoring**: Combines multiple similarity metrics

## API Endpoints

### Songs

- `GET /api/songs` - List all songs
- `GET /api/songs/:id` - Get specific song
- `POST /api/songs` - Create new song
- `GET /api/songs/search?q=query` - Search songs

### Comparison

- `GET /api/compare/:songId` - Find similar songs
- `POST /api/compare` - Compare with custom parameters

### System

- `GET /health` - Health check
- `GET /` - API documentation

## Data Model

### Song
```typescript
{
  id: string
  title: string
  artist: string
  progression: ChordProgression
  sections?: Section[]
  createdAt: Date
  updatedAt: Date
}
```

### ChordProgression
```typescript
{
  id: string
  chords: Chord[]
  key: string
  timeSignature?: string
  tempo?: number
  cadences: Cadence[]
}
```

### Chord
```typescript
{
  romanNumeral: string  // "I", "ii", "V7", "vi"
  quality: ChordQuality // major, minor, etc.
  duration?: number
  inversion?: number
}
```

## Deployment Considerations

### Backend
- Can be deployed to any Node.js hosting platform
- No database required (uses in-memory storage)
- For production: Add persistent storage (PostgreSQL, MongoDB)
- Environment variables: PORT, NODE_ENV

### Mobile
- iOS: Requires Xcode and Apple Developer account
- Android: Requires Android Studio
- Can use Expo for easier development and deployment

## Security

- Rate limiting prevents API abuse
- No authentication required for MVP (add OAuth/JWT for production)
- Input validation on all endpoints
- Error messages don't expose internal details

## Future Enhancements

1. **Database Integration**: Replace in-memory storage
2. **User Accounts**: Track favorites, create playlists
3. **Audio Preview**: 30-second clips (requires licensing)
4. **Advanced Analysis**: Melody, rhythm patterns
5. **Social Features**: Share discoveries, collaborative playlists
6. **ML Integration**: Improve similarity scoring with user feedback
