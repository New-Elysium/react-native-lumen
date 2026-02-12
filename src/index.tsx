export * from './types';
export * from './components/TourProvider';
export * from './components/TourZone';
export * from './hooks/useTour';
export { TourOverlay } from './components/TourOverlay';
export { TourTooltip } from './components/TourTooltip';
export * from './constants/defaults';
export * from './constants/animations';

// Storage utilities for advanced use cases
export {
  detectStorage,
  clearStorageCache,
  type StorageType,
} from './utils/storage';

// Re-export specific types for convenience
export type {
  SpotlightStyle,
  SpotlightShape,
  TourStep,
  CardProps,
  TourConfig,
  TourLabels,
  TooltipStyles,
  TourPersistenceConfig,
  StorageAdapter,
} from './types';
