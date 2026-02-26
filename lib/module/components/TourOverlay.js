"use strict";

import { memo, useMemo } from 'react';
import { StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { useTour } from "../hooks/useTour.js";
import { DEFAULT_SPOTLIGHT_STYLE } from "../constants/defaults.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.View;

// Helper to create rounded rect path
// x,y are top-left coordinates
const createRoundedRectPath = (x, y, w, h, r) => {
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
export const TourOverlay = /*#__PURE__*/memo(() => {
  const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  } = useWindowDimensions();
  const {
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    targetRadius,
    opacity,
    spotlightBorderWidth,
    config,
    currentStep,
    steps,
    currentSpotlightStyle
  } = useTour();

  // Get resolved spotlight style for styling the glow/border
  const spotlightStyle = useMemo(() => {
    return {
      ...DEFAULT_SPOTLIGHT_STYLE,
      ...config?.spotlightStyle,
      ...currentSpotlightStyle
    };
  }, [config?.spotlightStyle, currentSpotlightStyle]);

  // Create the d string for the mask
  // Outer rectangle covers the whole screen
  // Inner shape is the "hole"
  // fillRule="evenodd" makes the intersection transparent
  const animatedProps = useAnimatedProps(() => {
    const holePath = createRoundedRectPath(targetX.value, targetY.value, targetWidth.value, targetHeight.value, targetRadius.value);
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
      fillOpacity: opacity.value
    };
  });
  const step = currentStep ? steps[currentStep] : null;
  const isClickable = step?.clickable ?? false;

  // Check per-step preventInteraction first, then fall back to global config.
  // Defaults to true: the dark backdrop blocks touches by default.
  const shouldBlockOutside = step?.preventInteraction ?? config?.preventInteraction ?? true;

  // 'box-none': container doesn't capture touches itself, but children (SVG, blocker) can.
  // 'none': entire overlay is touch-transparent (backdrop is purely visual).
  const containerPointerEvents = shouldBlockOutside && currentStep ? 'box-none' : 'none';

  // SVG handles backdrop touch blocking at the native-view level via pointerEvents.
  // 'auto': filled pixels (dark mask) absorb touches; the evenodd hole has no fill so
  //         touches there pass through to the app — enabling clickable=true behaviour.
  // 'none': SVG is purely visual; all touches pass through (preventInteraction=false mode).
  const svgPointerEvents = shouldBlockOutside && currentStep ? 'auto' : 'none';

  // Blocker style for the hole (only if NOT clickable)
  const blockerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: targetX.value,
      top: targetY.value,
      width: targetWidth.value,
      height: targetHeight.value,
      // We can match radius too if needed, but rect is fine for touch area usually
      borderRadius: targetRadius.value
    };
  });

  // Animated style for the spotlight border/glow ring
  const spotlightBorderStyle = useAnimatedStyle(() => {
    const borderW = spotlightBorderWidth?.value ?? spotlightStyle.borderWidth;
    return {
      position: 'absolute',
      left: targetX.value,
      top: targetY.value,
      width: targetWidth.value,
      height: targetHeight.value,
      borderRadius: targetRadius.value,
      borderWidth: borderW,
      borderColor: spotlightStyle.borderColor,
      backgroundColor: 'transparent',
      // Glow effect using shadow
      shadowColor: spotlightStyle.glowColor,
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: spotlightStyle.glowOpacity,
      shadowRadius: spotlightStyle.glowRadius,
      elevation: Platform.OS === 'android' ? 8 : 0
    };
  });

  // Determine if we should show the border/glow
  const showBorder = spotlightStyle.borderWidth > 0 || spotlightStyle.glowOpacity > 0;
  return /*#__PURE__*/_jsxs(AnimatedView, {
    pointerEvents: containerPointerEvents,
    style: StyleSheet.absoluteFill,
    children: [/*#__PURE__*/_jsx(Svg, {
      height: "100%",
      width: "100%",
      style: StyleSheet.absoluteFill,
      pointerEvents: svgPointerEvents,
      children: /*#__PURE__*/_jsx(AnimatedPath, {
        animatedProps: animatedProps,
        fill: "black",
        fillRule: "evenodd"
      })
    }), !isClickable && currentStep && /*#__PURE__*/_jsx(AnimatedView, {
      style: blockerStyle,
      pointerEvents: "auto" // Catch touches
      // backgroundColor="transparent" // Default
    }), showBorder && currentStep && /*#__PURE__*/_jsx(AnimatedView, {
      style: spotlightBorderStyle,
      pointerEvents: "none"
    })]
  });
});
//# sourceMappingURL=TourOverlay.js.map