# Harmony Central

A modern music discovery platform that connects songs by their harmonic structure and emotional logic—not just genre or trends. By analyzing chord progressions, cadences, and musical patterns, we reveal why songs feel related and help listeners discover music more intuitively.

## 🎵 Features

- **Harmonic Analysis**: Analyzes chord progressions using Roman numeral notation
- **Cadence Detection**: Identifies authentic, plagal, deceptive, and half cadences
- **Similarity Scoring**: Multi-factor algorithm comparing progression, cadence, and structure
- **Cross-Platform**: iOS and Android support through React Native
- **Cost-Aware**: No audio storage, efficient algorithms, rate-limited API
- **Modular Architecture**: TypeScript monorepo with shared types

## 🏗️ Architecture

```
harmony-central/
├── packages/
│   ├── types/          # Shared TypeScript type definitions
│   ├── backend/        # Express.js API server
│   └── mobile/         # React Native mobile app
├── ARCHITECTURE.md     # Detailed architecture documentation
├── API.md             # API endpoint documentation
└── package.json       # Monorepo workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies for all packages
npm install

# Build all packages
npm run build
```

### Running the Backend

```bash
# Start the development server
npm run dev:backend

# The API will be available at http://localhost:3000
```

### API Examples

```bash
# Get all songs
curl http://localhost:3000/api/songs

# Compare songs to find similar ones
curl http://localhost:3000/api/compare/song-1

# Search for songs
curl "http://localhost:3000/api/songs/search?q=beatles"
```

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md) - System design and principles
- [API Documentation](API.md) - Complete API reference
- [Types Package](packages/types/src/index.ts) - TypeScript type definitions

## 🎼 How It Works

### Harmonic Analysis

The system analyzes three key aspects of music:

1. **Chord Progressions**: Sequences of chords represented in Roman numerals
   - Example: I-V-vi-IV (common in pop music)

2. **Cadences**: Musical phrases that create resolution or tension
   - Authentic (V-I): Strong resolution
   - Plagal (IV-I): "Amen" cadence
   - Deceptive (V-vi): Unexpected resolution
   - Half: Ends on V, creates tension

3. **Similarity Metrics**: Multi-factor comparison
   - Progression similarity (50% weight)
   - Cadence patterns (30% weight)
   - Structural elements (20% weight)

### Example: Finding Similar Songs

Songs with the same progression (I-V-vi-IV):
- "Let It Be" - The Beatles
- "Don't Stop Believin'" - Journey
- "Someone Like You" - Adele

These songs share:
- Identical chord progressions
- Similar cadence patterns
- Comparable structural elements

## 🔒 Security & Rate Limiting

- General API endpoints: 100 requests / 15 minutes
- Comparison endpoints: 30 requests / 15 minutes  
- Creation endpoints: 20 requests / 15 minutes

## 🎯 Design Principles

1. **Cost-Aware**: No audio storage, minimal dependencies, efficient algorithms
2. **Modular**: Clear separation of concerns across packages
3. **Type-Safe**: Full TypeScript coverage with strict mode
4. **API-First**: Well-documented REST API for easy integration
5. **Cross-Platform**: Single codebase for iOS and Android

## 🛠️ Development

### Project Structure

- **types**: Shared TypeScript interfaces and enums
- **backend**: Express.js server with harmonic analysis logic
- **mobile**: React Native app (structure placeholder)

### Scripts

```bash
# Build all packages
npm run build

# Run tests (when available)
npm run test

# Lint code (when configured)
npm run lint

# Start backend dev server
npm run dev:backend
```

## 📝 Sample Data

The backend includes sample songs for testing:
- "Let It Be" - The Beatles (C major, I-V-vi-IV)
- "Don't Stop Believin'" - Journey (E major, I-V-vi-IV)
- "Someone Like You" - Adele (A major, I-V-vi-IV)
- "Hotel California" - Eagles (B minor, vi-IV-I-V)

## 🔜 Future Enhancements

- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] User authentication and accounts
- [ ] Audio preview snippets (30 seconds)
- [ ] Advanced pattern recognition
- [ ] Social features (sharing, playlists)
- [ ] Machine learning for improved similarity scoring

## 📄 License

ISC License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive tests
- Implementing persistent storage
- Setting up CI/CD pipelines
- Adding user authentication
- Configuring production deployment
