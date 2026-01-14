/**
 * Placeholder for React Native components
 * 
 * To complete the mobile app setup, run:
 * npx react-native init HarmonyCentral
 * or
 * npx create-expo-app HarmonyCentral
 * 
 * This file provides a conceptual overview of key components
 */

/**
 * ChordProgressionView - Displays chord progression visually
 * Shows Roman numerals in a card-based layout
 */
export interface ChordProgressionViewProps {
  chords: Array<{
    romanNumeral: string;
    quality: string;
  }>;
  key: string;
}

/**
 * SongCard - Displays song information in a list
 * Shows title, artist, and key information
 */
export interface SongCardProps {
  song: {
    id: string;
    title: string;
    artist: string;
    progression: {
      key: string;
      chords: Array<any>;
    };
  };
  onPress: (songId: string) => void;
}

/**
 * SimilarityIndicator - Visual indicator of song similarity
 * Shows similarity score with color coding
 * Green (0.7-1.0), Yellow (0.5-0.7), Orange (0.3-0.5)
 */
export interface SimilarityIndicatorProps {
  score: number;
  size?: "small" | "medium" | "large";
}

/**
 * SearchBar - Search input for finding songs
 * Debounced search functionality
 */
export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * CadenceTag - Badge showing cadence types in a progression
 * Color-coded by cadence type
 */
export interface CadenceTagProps {
  type: "authentic" | "plagal" | "deceptive" | "half";
  strength: number;
}

// Component implementations would go in separate files:
// - components/ChordProgressionView.tsx
// - components/SongCard.tsx
// - components/SimilarityIndicator.tsx
// - components/SearchBar.tsx
// - components/CadenceTag.tsx

// Screen implementations:
// - screens/HomeScreen.tsx - Browse all songs
// - screens/SongDetailScreen.tsx - View song details and similar songs
// - screens/ComparisonScreen.tsx - Compare songs side-by-side
// - screens/SearchScreen.tsx - Search functionality
