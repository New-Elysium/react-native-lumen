import type { WithSpringConfig } from 'react-native-reanimated';

export const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 90,
};

export const DEFAULT_BACKDROP_OPACITY = 0.5;

export const DEFAULT_LABELS = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  skip: 'Skip',
};
