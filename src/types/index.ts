import type { WithSpringConfig, SharedValue } from 'react-native-reanimated';
import React from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

// ─── Spotlight Customization Types ───────────────────────────────────────────

/**
 * Shape variants for the spotlight cutout.
 */
export type SpotlightShape = 'rounded-rect' | 'circle' | 'pill';

/**
 * Customization options for the spotlight appearance.
 * Can be set globally via TourConfig or per-step via TourStep/TourZone.
 */
export interface SpotlightStyle {
  /**
   * Uniform padding around the highlighted element.
   * @default 8
   */
  padding?: number;
  /**
   * Top padding (overrides `padding` for top side).
   */
  paddingTop?: number;
  /**
   * Right padding (overrides `padding` for right side).
   */
  paddingRight?: number;
  /**
   * Bottom padding (overrides `padding` for bottom side).
   */
  paddingBottom?: number;
  /**
   * Left padding (overrides `padding` for left side).
   */
  paddingLeft?: number;
  /**
   * Border radius of the spotlight (for 'rounded-rect' shape).
   * @default 10
   */
  borderRadius?: number;
  /**
   * Shape of the spotlight cutout.
   * - 'rounded-rect': Standard rounded rectangle (default)
   * - 'circle': Circular spotlight that encompasses the element
   * - 'pill': Pill/capsule shape with fully rounded ends
   * @default 'rounded-rect'
   */
  shape?: SpotlightShape;
  /**
   * Width of the border/glow ring around the spotlight.
   * Set to 0 to disable.
   * @default 2
   */
  borderWidth?: number;
  /**
   * Color of the border/glow ring.
   * @default '#007AFF'
   */
  borderColor?: string;
  /**
   * Color of the outer glow effect.
   * @default '#007AFF'
   */
  glowColor?: string;
  /**
   * Opacity of the glow effect (0-1).
   * @default 0.4
   */
  glowOpacity?: number;
  /**
   * Blur radius for the glow effect.
   * @default 8
   */
  glowRadius?: number;
  /**
   * Spring damping for spotlight animations (per-step override).
   */
  springDamping?: number;
  /**
   * Spring stiffness for spotlight animations (per-step override).
   */
  springStiffness?: number;
}

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
  /**
   * Per-step spotlight style overrides.
   * Merged with global spotlightStyle from TourConfig.
   */
  spotlightStyle?: SpotlightStyle;
  /**
   * Custom render function for this step's tooltip/card.
   * Overrides the global renderCard from TourConfig.
   */
  renderCustomCard?: (props: CardProps) => React.ReactNode;
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

export interface TooltipStyles {
  /**
   * Background color of the tooltip
   */
  backgroundColor?: string;
  /**
   * Border radius of the tooltip (for shape customization)
   */
  borderRadius?: number;
  /**
   * Text color for the title
   */
  titleColor?: string;
  /**
   * Text color for the description
   */
  descriptionColor?: string;
  /**
   * Background color for the primary button
   */
  primaryButtonColor?: string;
  /**
   * Text color for the primary button
   */
  primaryButtonTextColor?: string;
  /**
   * Border radius for the primary button
   */
  primaryButtonBorderRadius?: number;
  /**
   * Text color for the skip button
   */
  skipButtonTextColor?: string;
  /**
   * Custom style for the tooltip container
   */
  containerStyle?: ViewStyle;
  /**
   * Custom style for the title text
   */
  titleStyle?: TextStyle;
  /**
   * Custom style for the description text
   */
  descriptionStyle?: TextStyle;
  /**
   * Custom style for the primary button
   */
  primaryButtonStyle?: ViewStyle;
  /**
   * Custom style for the primary button text
   */
  primaryButtonTextStyle?: TextStyle;
  /**
   * Custom style for the skip button
   */
  skipButtonStyle?: ViewStyle;
  /**
   * Custom style for the skip button text
   */
  skipButtonTextStyle?: TextStyle;
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
  /**
   * Custom styles for the tooltip appearance
   */
  tooltipStyles?: TooltipStyles;
  /**
   * Global spotlight style settings.
   * Can be overridden per-step via TourStep.spotlightStyle or TourZone props.
   */
  spotlightStyle?: SpotlightStyle;
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
  /** Border width for the spotlight glow ring */
  spotlightBorderWidth: SharedValue<number>;
  containerRef: React.RefObject<any>;
  scrollViewRef: React.RefObject<any>;
  setScrollViewRef: (ref: any) => void;
  /** Resolved spotlight style for the current step */
  currentSpotlightStyle: SpotlightStyle | null;
}
