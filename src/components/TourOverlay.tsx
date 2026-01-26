import { memo, type ComponentType } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTour } from '../hooks/useTour';
import type { InternalTourContextType } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.View as unknown as ComponentType<any>;

// Helper to create rounded rect path
// x,y are top-left coordinates
const createRoundedRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  'worklet';
  // Ensure radius doesn't exceed dimensions
  const radius = Math.min(r, w / 2, h / 2);

  // Standard SVG Path command for rounded rect
  return `
    M ${x + radius}, ${y}
    H ${x + w - radius}
    A ${radius} ${radius} 0 0 1 ${x + w}, ${y + radius}
    V ${y + h - radius}
    A ${radius} ${radius} 0 0 1 ${x + w - radius}, ${y + h}
    H ${x + radius}
    A ${radius} ${radius} 0 0 1 ${x}, ${y + h - radius}
    V ${y + radius}
    A ${radius} ${radius} 0 0 1 ${x + radius}, ${y}
    Z
  `;
};

export const TourOverlay = memo(() => {
  const {
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    targetRadius,
    opacity,
    config,
    currentStep,
    steps,
  } = useTour() as InternalTourContextType;

  // Create the d string for the mask
  // Outer rectangle covers the whole screen
  // Inner shape is the "hole"
  // fillRule="evenodd" makes the intersection transparent
  const animatedProps = useAnimatedProps(() => {
    const holePath = createRoundedRectPath(
      targetX.value,
      targetY.value,
      targetWidth.value,
      targetHeight.value,
      targetRadius.value
    );

    const path = `
      M 0,0 
      H ${SCREEN_WIDTH} 
      V ${SCREEN_HEIGHT} 
      H 0 
      Z 
      ${holePath}
    `;

    return {
      d: path,
      fillOpacity: opacity.value,
    };
  });

  const step = currentStep ? steps[currentStep] : null;
  const isClickable = step?.clickable ?? false;

  // Interaction Logic:
  // 1. preventInteraction = true:
  //    - Wrapper pointerEvents = 'box-none' (pass through) BUT SVG is auto?
  //    - Actually, if we want to block OUTSIDE but allow INSIDE:
  //      - SVG path normally blocks where it draws (the dark part).
  //      - The 'hole' is empty, so touches pass through the hole to the app?
  //      - YES, with fillRule="evenodd", the hole effectively has no fill.
  //      - So if SVG is 'auto', touching the dark mask is blocked (if we consume touch).
  //      - Touching the hole goes through to the app (GOOD for clickable).
  //    - IF we want to BLOCK the hole (clickable=false):
  //      - We need a transparent view covering the hole that consumes touches.
  //
  // 2. preventInteraction = false (default):
  //    - Overlay shouldn't block anything?
  //    - pointerEvents='none' on the whole container.

  const shouldBlockOutside = config?.preventInteraction ?? false;

  // If we don't want to block outside, we just let everything pass.
  // But wait, if we let everything pass, we can't implement 'clickable=false' strictness?
  // Usually preventInteraction=false means "just show the highlighter, let user do whatever".

  const containerPointerEvents =
    shouldBlockOutside && currentStep ? 'box-none' : 'none';

  // If blocking outside, the SVG (which is absolute fill) needs to catch touches on the dark part.

  // Blocker style for the hole (only if NOT clickable)
  const blockerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: targetX.value,
      top: targetY.value,
      width: targetWidth.value,
      height: targetHeight.value,
      // We can match radius too if needed, but rect is fine for touch area usually
      borderRadius: targetRadius.value,
    };
  });

  return (
    <AnimatedView
      pointerEvents={containerPointerEvents}
      style={StyleSheet.absoluteFill}
    >
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <AnimatedPath
          animatedProps={animatedProps as any}
          fill="black" // The backdrop color
          fillRule="evenodd"
          onPress={() => {
            // Consume touch on the backdrop?
          }}
        />
      </Svg>
      {/* If strictly blocking interaction AND current step is NOT clickable, we cover the hole */}
      {shouldBlockOutside && !isClickable && currentStep && (
        <AnimatedView
          style={blockerStyle}
          pointerEvents="auto" // Catch touches
          // backgroundColor="transparent" // Default
        />
      )}
    </AnimatedView>
  );
});
