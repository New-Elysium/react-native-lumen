import type { WithSpringConfig, SharedValue } from 'react-native-reanimated';
import React from 'react';

export interface TourStep {
  /**
   * Unique key for this step.
   */
  key: string;
  /**
   * Optional display name/label for this step.
   */
  name?: string;
  /**
   * Description text to show in the tooltip.
   */
  description: string;
  /**
   * Optional order index. If not provided, registration order is used (or explicit ordering in context).
   */
  order?: number;
  /**
   * Optional data for custom tooltip rendering
   */
  meta?: any;
  /**
   * If true, allows user interaction with the target element.
   * If false, interactions are blocked (default behavior depends on global config).
   */
  clickable?: boolean;
}

export interface MeasureResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type StepMap = Record<string, TourStep>;

export interface TourLabels {
  next?: string;
  previous?: string;
  finish?: string;
  skip?: string;
}

export interface CardProps {
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  next: () => void;
  prev: () => void;
  stop: () => void;
  isFirst: boolean;
  isLast: boolean;
  labels?: TourLabels;
}

export interface TourConfig {
  /**
   * Animation configuration for the spotlight movement.
   */
  springConfig?: WithSpringConfig;
  /**
   * If true, prevents interaction with the underlying app while tour is active.
   * Default: false (interactions allowed outside the tooltip, but overlay might block them depending on implementation).
   */
  preventInteraction?: boolean;
  /**
   * Custom labels for buttons.
   */
  labels?: TourLabels;
  /**
   * Custom renderer for the card/tooltip.
   */
  renderCard?: (props: CardProps) => React.ReactNode;
  /**
   * Backdrop opacity. Default 0.5
   */
  backdropOpacity?: number;
}

export interface TourContextType {
  /**
   * Starts the tour at the first step or a specific step (by key).
   */
  start: (stepKey?: string) => void;
  /**
   * Stops the tour and hides the overlay.
   */
  stop: () => void;
  /**
   * Advances to the next step.
   */
  next: () => void;
  /**
   * Goes back to the previous step.
   */
  prev: () => void;
  /**
   * Registers a zone/step.
   */
  registerStep: (step: TourStep) => void;
  /**
   * Unregisters a zone/step.
   */
  unregisterStep: (key: string) => void;
  /**
   * Updates the layout of a specific step.
   * This is called by TourZone on layout/mount.
   */
  updateStepLayout: (key: string, measure: MeasureResult) => void;
  /**
   * The current active step key, or null if tour is inactive.
   */
  currentStep: string | null;
  /**
   * Map of registered steps.
   */
  steps: StepMap;
  /**
   * Global tour configuration
   */
  config?: TourConfig;
  /**
   * Registers the main ScrollView ref for auto-scrolling
   */
  setScrollViewRef: (ref: any) => void;
}

export interface InternalTourContextType extends TourContextType {
  targetX: SharedValue<number>;
  targetY: SharedValue<number>;
  targetWidth: SharedValue<number>;
  targetHeight: SharedValue<number>;
  targetRadius: SharedValue<number>;
  opacity: SharedValue<number>;
  containerRef: React.RefObject<any>;
  scrollViewRef: React.RefObject<any>;
  setScrollViewRef: (ref: any) => void;
}
