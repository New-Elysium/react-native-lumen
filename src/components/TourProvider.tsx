import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  type ComponentType,
} from 'react';
import {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedRef,
  default as Animated,
  type WithSpringConfig,
} from 'react-native-reanimated';
import { StyleSheet, Dimensions } from 'react-native';
import type {
  TourStep,
  MeasureResult,
  TourConfig,
  InternalTourContextType,
  SpotlightStyle,
} from '../types';
import { TourContext } from '../context/TourContext';
import { TourOverlay } from './TourOverlay';
import { TourTooltip } from './TourTooltip';
import {
  DEFAULT_BACKDROP_OPACITY,
  DEFAULT_SPRING_CONFIG,
  DEFAULT_SPOTLIGHT_STYLE,
  resolveSpotlightStyle,
} from '../constants/defaults';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Computes the spotlight geometry based on element bounds and spotlight style.
 * Handles different shapes: rounded-rect, circle, pill.
 */
function computeSpotlightGeometry(
  element: MeasureResult,
  style: Required<SpotlightStyle>
): {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
} {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    shape,
    borderRadius,
  } = style;

  let sx: number, sy: number, sw: number, sh: number, sr: number;

  switch (shape) {
    case 'circle': {
      // Create a circular spotlight that encompasses the element
      const cx = element.x + element.width / 2;
      const cy = element.y + element.height / 2;
      const radius =
        Math.sqrt(element.width ** 2 + element.height ** 2) / 2 + style.padding;
      sx = cx - radius;
      sy = cy - radius;
      sw = radius * 2;
      sh = radius * 2;
      sr = radius;
      break;
    }
    case 'pill': {
      // Pill shape with fully rounded ends
      sx = element.x - paddingLeft;
      sy = element.y - paddingTop;
      sw = element.width + paddingLeft + paddingRight;
      sh = element.height + paddingTop + paddingBottom;
      sr = sh / 2; // Fully rounded based on height
      break;
    }
    case 'rounded-rect':
    default: {
      sx = element.x - paddingLeft;
      sy = element.y - paddingTop;
      sw = element.width + paddingLeft + paddingRight;
      sh = element.height + paddingTop + paddingBottom;
      sr = borderRadius;
      break;
    }
  }

  // Clamp to screen bounds
  sx = Math.max(0, Math.min(sx, SCREEN_WIDTH - sw));
  sy = Math.max(0, Math.min(sy, SCREEN_HEIGHT - sh));
  sw = Math.min(sw, SCREEN_WIDTH - sx);
  sh = Math.min(sh, SCREEN_HEIGHT - sy);

  // Ensure minimum size
  const minSize = 40;
  sw = Math.max(sw, minSize);
  sh = Math.max(sh, minSize);

  return { x: sx, y: sy, width: sw, height: sh, borderRadius: sr };
}

interface TourProviderProps {
  children: React.ReactNode;
  /**
   * Optional custom steps order. If provided, the tour will follow this array of keys.
   */
  stepsOrder?: string[];
  /**
   * Initial overlay opacity. Default 0.5
   */
  backdropOpacity?: number;
  /**
   * Global configuration for the tour.
   */
  config?: TourConfig;
}

const AnimatedView = Animated.View as unknown as ComponentType<any>;

export const TourProvider: React.FC<TourProviderProps> = ({
  children,
  stepsOrder: initialStepsOrder,
  backdropOpacity = DEFAULT_BACKDROP_OPACITY,
  config,
}) => {
  const [steps, setSteps] = useState<Record<string, TourStep>>({});
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // ref to access latest measurements without causing re-renders
  const measurements = useRef<Record<string, MeasureResult>>({});
  const containerRef = useAnimatedRef<any>();

  // --- Shared Values for Animations (Zero Bridge Crossing) ---
  // Initialize off-screen or 0
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const targetWidth = useSharedValue(0);
  const targetHeight = useSharedValue(0);
  const targetRadius = useSharedValue(10); // Default border radius
  const opacity = useSharedValue(0); // 0 = hidden, 1 = visible
  const spotlightBorderWidth = useSharedValue(
    DEFAULT_SPOTLIGHT_STYLE.borderWidth
  );

  // Track current step's resolved spotlight style
  const currentSpotlightStyle = useMemo<SpotlightStyle | null>(() => {
    if (!currentStep) return null;
    const step = steps[currentStep];
    if (!step) return null;
    return resolveSpotlightStyle(config?.spotlightStyle, step.spotlightStyle);
  }, [currentStep, steps, config?.spotlightStyle]);

  // Helper to get spring config for a step (supports per-step overrides)
  const getSpringConfigForStep = useCallback(
    (stepKey: string): WithSpringConfig => {
      const step = steps[stepKey];
      const stepStyle = step?.spotlightStyle;
      const baseConfig = config?.springConfig ?? DEFAULT_SPRING_CONFIG;

      // Allow per-step spring overrides
      if (
        stepStyle?.springDamping !== undefined ||
        stepStyle?.springStiffness !== undefined
      ) {
        return {
          damping: stepStyle.springDamping ?? baseConfig.damping,
          stiffness: stepStyle.springStiffness ?? baseConfig.stiffness,
          mass: baseConfig.mass,
          overshootClamping: baseConfig.overshootClamping,
          restDisplacementThreshold: baseConfig.restDisplacementThreshold,
          restSpeedThreshold: baseConfig.restSpeedThreshold,
        };
      }
      return baseConfig;
    },
    [steps, config?.springConfig]
  );

  // Helper to animate to a specific step's layout
  const animateToStep = useCallback(
    (stepKey: string) => {
      const measure = measurements.current[stepKey];
      if (measure) {
        // Validate measurements before animating
        if (
          !measure.width ||
          !measure.height ||
          measure.width <= 0 ||
          measure.height <= 0 ||
          isNaN(measure.x) ||
          isNaN(measure.y) ||
          isNaN(measure.width) ||
          isNaN(measure.height)
        ) {
          console.warn(
            '[TourProvider] Invalid measurements for step:',
            stepKey,
            measure
          );
          return;
        }

        const step = steps[stepKey];
        const resolvedStyle = resolveSpotlightStyle(
          config?.spotlightStyle,
          step?.spotlightStyle
        );
        const springConfig = getSpringConfigForStep(stepKey);

        // Compute spotlight geometry based on style (handles shapes and padding)
        const geo = computeSpotlightGeometry(measure, resolvedStyle);

        targetX.value = withSpring(geo.x, springConfig);
        targetY.value = withSpring(geo.y, springConfig);
        targetWidth.value = withSpring(geo.width, springConfig);
        targetHeight.value = withSpring(geo.height, springConfig);
        targetRadius.value = withSpring(geo.borderRadius, springConfig);
        spotlightBorderWidth.value = withSpring(
          resolvedStyle.borderWidth,
          springConfig
        );

        // Ensure overlay is visible
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      } else {
        console.warn('[TourProvider] No measurements found for step:', stepKey);
      }
    },
    [
      backdropOpacity,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      targetRadius,
      spotlightBorderWidth,
      opacity,
      getSpringConfigForStep,
      steps,
      config?.spotlightStyle,
    ]
  );

  const registerStep = useCallback((step: TourStep) => {
    setSteps((prev) => ({ ...prev, [step.key]: step }));
  }, []);

  const unregisterStep = useCallback((key: string) => {
    setSteps((prev) => {
      const newSteps = { ...prev };
      delete newSteps[key];
      return newSteps;
    });
  }, []);

  const updateStepLayout = useCallback(
    (key: string, measure: MeasureResult) => {
      // Validate measurements before storing
      if (
        !measure.width ||
        !measure.height ||
        measure.width <= 0 ||
        measure.height <= 0 ||
        isNaN(measure.x) ||
        isNaN(measure.y) ||
        isNaN(measure.width) ||
        isNaN(measure.height) ||
        !isFinite(measure.x) ||
        !isFinite(measure.y) ||
        !isFinite(measure.width) ||
        !isFinite(measure.height)
      ) {
        console.warn(
          '[TourProvider] Invalid measurement update for step:',
          key,
          measure
        );
        return;
      }

      measurements.current[key] = measure;
      // If this step is currently active (e.g. scroll happened or resize), update shared values on the fly
      if (currentStep === key) {
        const step = steps[key];
        const resolvedStyle = resolveSpotlightStyle(
          config?.spotlightStyle,
          step?.spotlightStyle
        );
        const springConfig = getSpringConfigForStep(key);

        // Compute spotlight geometry based on style
        const geo = computeSpotlightGeometry(measure, resolvedStyle);

        targetX.value = withSpring(geo.x, springConfig);
        targetY.value = withSpring(geo.y, springConfig);
        targetWidth.value = withSpring(geo.width, springConfig);
        targetHeight.value = withSpring(geo.height, springConfig);
        targetRadius.value = withSpring(geo.borderRadius, springConfig);
        spotlightBorderWidth.value = withSpring(
          resolvedStyle.borderWidth,
          springConfig
        );

        // Ensure overlay is visible (fixes race condition where start() was called before measure)
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      }
    },
    [
      currentStep,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      targetRadius,
      spotlightBorderWidth,
      opacity,
      backdropOpacity,
      getSpringConfigForStep,
      config?.spotlightStyle,
      steps,
    ]
  );

  const getOrderedSteps = useCallback(() => {
    if (initialStepsOrder) return initialStepsOrder;
    // If order property exists on steps, sort by it.
    const stepKeys = Object.keys(steps);
    if (stepKeys.length > 0) {
      // Check if any step has order
      const hasOrder = stepKeys.some(
        (key) => typeof steps[key]?.order === 'number'
      );
      if (hasOrder) {
        return stepKeys.sort(
          (a, b) => (steps[a]?.order ?? 0) - (steps[b]?.order ?? 0)
        );
      }
    }
    return stepKeys;
  }, [initialStepsOrder, steps]);

  const start = useCallback(
    (stepKey?: string) => {
      const ordered = getOrderedSteps();
      const firstStep = stepKey || ordered[0];
      if (firstStep) {
        setCurrentStep(firstStep);
        // We need to wait for layout if it's not ready?
        // Assuming layout is ready since components are mounted.
        // But if we start immediately on mount, might be tricky.
        // For now assume standard flow.
        // requestAnimationFrame to ensure state update propagates if needed,
        // but simple call is usually fine.
        setTimeout(() => animateToStep(firstStep), 0);
      }
    },
    [getOrderedSteps, animateToStep]
  );

  const stop = useCallback(() => {
    setCurrentStep(null);
    opacity.value = withTiming(0, { duration: 300 });
  }, [opacity]);

  const next = useCallback(() => {
    if (!currentStep) return;
    const ordered = getOrderedSteps();
    const currentIndex = ordered.indexOf(currentStep);
    if (currentIndex < ordered.length - 1) {
      const nextStep = ordered[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
        // Don't call animateToStep here - it uses cached measurements that may be stale
        // after scroll. The useFrameCallback in TourZone will handle position tracking
        // using measure() with correct screen coordinates (pageX/pageY).
        // Just ensure the overlay is visible.
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      } else {
        stop();
      }
    } else {
      stop(); // End of tour
    }
  }, [currentStep, getOrderedSteps, stop, opacity, backdropOpacity]);

  const prev = useCallback(() => {
    if (!currentStep) return;
    const ordered = getOrderedSteps();
    const currentIndex = ordered.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = ordered[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep);
        // Don't call animateToStep - let useFrameCallback handle position tracking
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      }
    }
  }, [currentStep, getOrderedSteps, opacity, backdropOpacity]);

  const scrollViewRef = useAnimatedRef<any>();

  const setScrollViewRef = useCallback((_ref: any) => {
    // If user passes a ref, we might want to sync it?
    // Or we just provide this function for them to give us the ref.
    // With useAnimatedRef, we can assign it if it's a function or object?
    // Actually, safest is to let them assign our ref to their component.
    // But they might have their own ref.
    // Let's assume they call this with their ref.
    // BUT useAnimatedRef cannot easily accept an external ref object to "become".
    // Pattern: They should use the ref we give them, OR we wrap their component?
    // Simpler: We just expose 'scrollViewRef' from context, and they attach it.
    // So 'setScrollViewRef' might be redundant if we just say "here is the ref, use it".
    // But if they have their own, they can't usage two refs easily without merging.
    // Let's stick to exposing `scrollViewRef` from context that they MUST use.
    // But wait, the interface says `setScrollViewRef`.
    // Let's keep `setScrollViewRef` as a no-op or a way to manually set it if needed (not RecAnimated friendly).
    // Actually, let's just expose `scrollViewRef` and `registerScrollView` which essentially does nothing if we expect them to use the ref object.
    // Let's make `setScrollViewRef` actually do something if possible, or just document "Use exposed scrollViewRef".
    // For now, let's just return the `scrollViewRef` we created.
  }, []);

  const value = useMemo<InternalTourContextType>(
    () => ({
      start,
      stop,
      next,
      prev,
      registerStep,
      unregisterStep,
      updateStepLayout,
      currentStep,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      targetRadius,
      opacity,
      spotlightBorderWidth,
      steps,
      config,
      containerRef,
      scrollViewRef,
      setScrollViewRef,
      currentSpotlightStyle,
    }),
    [
      start,
      stop,
      next,
      prev,
      registerStep,
      unregisterStep,
      updateStepLayout,
      currentStep,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      targetRadius,
      opacity,
      spotlightBorderWidth,
      steps,
      config,
      containerRef,
      scrollViewRef,
      setScrollViewRef,
      currentSpotlightStyle,
    ]
  );

  return (
    <TourContext.Provider value={value}>
      <AnimatedView
        ref={containerRef}
        style={styles.container}
        collapsable={false}
      >
        {children}
        <TourOverlay />
        <TourTooltip />
      </AnimatedView>
    </TourContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
