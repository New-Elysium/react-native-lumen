import type { WithSpringConfig } from 'react-native-reanimated';

/**
 * Default spring configuration matching Reanimated 3 defaults.
 */
export const Reanimated3DefaultSpringConfig: WithSpringConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
};

/**
 * Spring configuration with duration.
 */
export const Reanimated3DefaultSpringConfigWithDuration: WithSpringConfig = {
  duration: 1333,
  dampingRatio: 0.5,
};

/**
 * A bouncy and energetic spring configuration.
 */
export const WigglySpringConfig: WithSpringConfig = {
  damping: 90,
  mass: 4,
  stiffness: 900,
};

/**
 * A bouncy spring configuration with fixed duration.
 */
export const WigglySpringConfigWithDuration: WithSpringConfig = {
  duration: 550,
  dampingRatio: 0.75,
};

/**
 * A gentle and smooth spring configuration.
 */
export const GentleSpringConfig: WithSpringConfig = {
  damping: 120,
  mass: 4,
  stiffness: 900,
};

/**
 * A gentle spring configuration with fixed duration.
 */
export const GentleSpringConfigWithDuration: WithSpringConfig = {
  duration: 550,
  dampingRatio: 1,
};

/**
 * A snappy and responsive spring configuration.
 */
export const SnappySpringConfig: WithSpringConfig = {
  damping: 110,
  mass: 4,
  stiffness: 900,
  overshootClamping: true,
};

/**
 * A snappy spring configuration with fixed duration.
 */
export const SnappySpringConfigWithDuration: WithSpringConfig = {
  duration: 550,
  dampingRatio: 0.92,
  overshootClamping: true,
};
