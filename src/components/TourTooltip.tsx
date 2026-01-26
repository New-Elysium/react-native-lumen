import { useMemo, memo, useState, type ComponentType } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTour } from '../hooks/useTour';
import type { CardProps, InternalTourContextType } from '../types';
import { DEFAULT_LABELS } from '../constants/defaults';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const TourTooltip = memo(() => {
  const {
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    currentStep,
    steps,
    next,
    prev,
    stop,
    opacity,
    config,
  } = useTour() as InternalTourContextType;

  const currentStepData = currentStep ? steps[currentStep] : null;

  const tooltipHeight = useSharedValue(150);
  const [tooltipWidth] = useState(280);

  const orderedSteps = useMemo(() => {
    const keys = Object.keys(steps);
    if (keys.length > 0) {
      return keys.sort(
        (a, b) => (steps[a]?.order ?? 0) - (steps[b]?.order ?? 0)
      );
    }
    return keys;
  }, [steps]);

  const currentIndex = currentStep ? orderedSteps.indexOf(currentStep) : -1;
  const totalSteps = orderedSteps.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  const tooltipStyle = useAnimatedStyle(() => {
    'worklet';

    const safeTargetX = targetX.value || 0;
    const safeTargetY = targetY.value || 0;
    const safeTargetWidth = Math.max(targetWidth.value || 0, 1);
    const safeTargetHeight = Math.max(targetHeight.value || 0, 1);
    const safeTooltipHeight = tooltipHeight.value || 150;

    // FIX: Aggressive Interpolation
    // Map the input value [0 -> 0.6] to output [0 -> 1].
    // This ensures that even if 'opacity.value' stops at 0.7 (backdrop level),
    // the tooltip is already fully opaque (1.0).
    const activeOpacity = interpolate(
      opacity.value,
      [0, 0.6],
      [0, 1],
      Extrapolation.CLAMP
    );

    const spaceAbove = safeTargetY;
    const spaceBelow = SCREEN_HEIGHT - (safeTargetY + safeTargetHeight);

    const shouldPlaceAbove =
      (spaceAbove > spaceBelow && spaceAbove > safeTooltipHeight + 30) ||
      (safeTargetY > SCREEN_HEIGHT / 2 && spaceAbove > safeTooltipHeight + 20);

    const horizontalCenter = safeTargetX + safeTargetWidth / 2;
    const left = horizontalCenter - tooltipWidth / 2;

    const clampedLeft = Math.max(
      12,
      Math.min(SCREEN_WIDTH - tooltipWidth - 12, left)
    );

    const style: any = {
      position: 'absolute',
      width: tooltipWidth,
      left: clampedLeft,
      opacity: activeOpacity,
      // Add explicit background here for Reanimated to treat it as a solid block layer
      backgroundColor: 'white',
      transform: [{ translateY: interpolate(activeOpacity, [0, 1], [10, 0]) }],
    };

    if (shouldPlaceAbove) {
      style.top = Math.max(10, safeTargetY - safeTooltipHeight - 20);
      style.bottom = undefined;
    } else {
      style.top = safeTargetY + safeTargetHeight + 20;
      style.bottom = undefined;
    }

    return style;
  });

  if (!currentStepData) return null;

  const AnimatedView = Animated.View as unknown as ComponentType<any>;

  const handleTooltipLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      tooltipHeight.value = height;
    }
  };

  // Custom Render
  if (config?.renderCard) {
    const cardProps: CardProps = {
      step: currentStepData,
      currentStepIndex: currentIndex,
      totalSteps,
      next,
      prev,
      stop,
      isFirst,
      isLast,
      labels: config.labels,
    };
    return (
      <AnimatedView
        style={[
          styles.container,
          tooltipStyle,
          // Reset styles for custom render so the user has full control
          {
            backgroundColor: 'transparent',
            shadowOpacity: 0,
            elevation: 0,
            padding: 0,
            borderRadius: 0,
          },
        ]}
        onLayout={handleTooltipLayout}
      >
        {config.renderCard(cardProps)}
      </AnimatedView>
    );
  }

  // Default Render
  const labels = { ...DEFAULT_LABELS, ...config?.labels };
  const labelNext = isLast ? labels.finish : labels.next;
  const labelSkip = labels.skip;

  return (
    <AnimatedView
      // Combined styles: Container (Shadows) + CardStyle (White BG) + TooltipStyle (Position/Opacity)
      style={[styles.container, styles.cardStyle, tooltipStyle]}
      onLayout={handleTooltipLayout}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{currentStepData.name || 'Step'}</Text>
        <Text style={styles.stepIndicator}>
          {currentIndex + 1} / {totalSteps}
        </Text>
      </View>
      <Text style={styles.description}>{currentStepData.description}</Text>

      <View style={styles.footer}>
        {!isLast && (
          <TouchableOpacity onPress={stop} style={styles.buttonText}>
            <Text style={styles.skipText}>{labelSkip}</Text>
          </TouchableOpacity>
        )}
        {isLast && <View style={{ width: 10 }} />}

        <TouchableOpacity onPress={next} style={styles.buttonPrimary}>
          <Text style={styles.primaryButtonText}>{labelNext}</Text>
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    // Shadow Props
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 999,
  },
  cardStyle: {
    backgroundColor: 'white', // Ensure this is solid white
    borderRadius: 12,
    padding: 20,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    padding: 8,
  },
  skipText: {
    color: '#666',
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
