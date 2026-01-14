# Development Guide

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/kaospan/Harmony-central.git
cd Harmony-central

# Install dependencies
npm install

# Build all packages
npm run build
```

## Project Structure

```
harmony-central/
├── packages/
│   ├── types/           # Shared TypeScript type definitions
│   │   ├── src/
│   │   │   └── index.ts # All type exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/         # Express.js API server
│   │   ├── src/
│   │   │   ├── index.ts              # Server entry point
│   │   │   ├── middleware/           # Express middleware
│   │   │   ├── routes/               # API route handlers
│   │   │   ├── services/             # Business logic
│   │   │   └── utils/                # Utility functions
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/          # React Native mobile app
│       ├── src/
│       │   ├── components/           # UI components
│       │   ├── screens/              # App screens
│       │   ├── services/             # API client
│       │   └── types/                # Mobile-specific types
│       ├── package.json
│       └── tsconfig.json
│
├── API.md               # API documentation
├── ARCHITECTURE.md      # Architecture overview
├── DEVELOPMENT.md       # This file
├── README.md            # Project overview
├── package.json         # Workspace configuration
└── tsconfig.json        # Base TypeScript config
```

## Development Workflow

### Backend Development

```bash
# Start the development server (auto-reload on changes)
npm run dev:backend

# The API will be available at http://localhost:3000
```

### Building Packages

```bash
# Build all packages
npm run build

# Build specific package
npm run build -w @harmony-central/types
npm run build -w @harmony-central/backend
npm run build -w @harmony-central/mobile
```

### Testing Packages

```bash
# Run tests for all packages
npm run test

# Run tests for specific package
npm run test -w @harmony-central/backend
```

### Linting

```bash
# Lint all packages
npm run lint

# Lint specific package
npm run lint -w @harmony-central/backend
```

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Get all songs
curl http://localhost:3000/api/songs

# Get specific song
curl http://localhost:3000/api/songs/song-1

# Search songs
curl "http://localhost:3000/api/songs/search?q=beatles"

# Compare songs
curl "http://localhost:3000/api/compare/song-1?limit=5&minSimilarity=0.5"

# Create new song
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
      "key": "C major",
      "timeSignature": "4/4",
      "tempo": 120
    }
  }'
```

### Using HTTPie

```bash
# Get all songs
http localhost:3000/api/songs

# Compare songs
http localhost:3000/api/compare/song-1 limit==5 minSimilarity==0.5

# Create song
http POST localhost:3000/api/songs \
  title="Test Song" \
  artist="Test Artist" \
  progression:='{"chords":[{"romanNumeral":"I","quality":"major"}],"key":"C major"}'
```

## Common Tasks

### Adding a New Type

1. Edit `packages/types/src/index.ts`
2. Add your type definition
3. Export it
4. Rebuild: `npm run build -w @harmony-central/types`

### Adding a New API Endpoint

1. Create or edit route file in `packages/backend/src/routes/`
2. Add route handler function
3. Register route in `packages/backend/src/index.ts`
4. Rebuild: `npm run build -w @harmony-central/backend`
5. Test the endpoint

### Adding a New Service

1. Create service file in `packages/backend/src/services/`
2. Implement service class with methods
3. Import and use in routes or other services
4. Rebuild and test

## Environment Variables

### Backend

Create a `.env` file in `packages/backend/`:

```bash
PORT=3000
NODE_ENV=development
```

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clean all build artifacts
npm run clean --workspaces

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Find the process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev:backend
```

### Type Errors

If you get TypeScript errors about missing types:

```bash
# Rebuild the types package first
npm run build -w @harmony-central/types

# Then rebuild other packages
npm run build -w @harmony-central/backend
```

## Code Style

### TypeScript

- Use strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use enums for fixed sets of values
- Document public APIs with JSDoc comments

### Naming Conventions

- **Files**: camelCase for TypeScript files (e.g., `harmonicAnalysis.ts`)
- **Classes**: PascalCase (e.g., `HarmonicAnalysisService`)
- **Functions**: camelCase (e.g., `detectCadences`)
- **Constants**: UPPER_CASE (e.g., `MAX_REQUESTS`)
- **Interfaces**: PascalCase (e.g., `ChordProgression`)
- **Types**: PascalCase (e.g., `RomanNumeral`)

### Project Organization

- Keep files small and focused
- One class per file
- Group related functionality in services
- Use barrel exports (index.ts) for public APIs

## Production Deployment

### Backend Deployment

```bash
# Build for production
npm run build

# Start production server
cd packages/backend
NODE_ENV=production node dist/index.js
```

### Recommended Production Setup

1. **Database**: Replace in-memory storage with PostgreSQL or MongoDB
2. **Authentication**: Add JWT or OAuth2
3. **Logging**: Implement structured logging (Winston, Pino)
4. **Monitoring**: Add application performance monitoring
5. **Caching**: Implement Redis for frequently accessed data
6. **Rate Limiting**: Configure based on tier/user
7. **HTTPS**: Use reverse proxy (nginx) with SSL certificates

### Environment-Specific Configuration

```bash
# Development
NODE_ENV=development
PORT=3000

# Production
NODE_ENV=production
PORT=80
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
```

## Mobile App Development

The mobile package currently contains structure and API client code. To complete the mobile app:

### Using React Native CLI

```bash
cd packages/mobile
npx react-native init HarmonyCentralApp
# Move src/ files into the new project
```

### Using Expo

```bash
cd packages/mobile
npx create-expo-app HarmonyCentralApp
# Move src/ files into the new project
```

### Key Mobile Features to Implement

1. **Song List Screen**: Browse all songs
2. **Song Detail Screen**: View chord progression and similar songs
3. **Comparison View**: Side-by-side chord progressions
4. **Search**: Find songs by title/artist
5. **Chord Visualization**: Display Roman numeral progressions

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Run linter
6. Submit pull request

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Music Theory for Developers](https://github.com/danigb/music-theory)

## Support

For issues or questions:
- Check existing documentation
- Search GitHub issues
- Create a new issue with detailed description
