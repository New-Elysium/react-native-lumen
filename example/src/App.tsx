import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TourProvider, WigglySpringConfig } from 'react-native-lumen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Home } from './Home';
import { tourSteps } from './data/tourSteps';

export default function App() {
  // Extract keys for order
  const stepsOrder = Object.values(tourSteps)
    .sort((a, b) => a.order - b.order)
    .map((step) => step.key);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <TourProvider
            stepsOrder={stepsOrder}
            backdropOpacity={0.6}
            config={{
              // preventInteraction: true,
              springConfig: WigglySpringConfig,
              labels: {
                next: 'Go Next',
                finish: 'Complete!',
                skip: 'Skip Tour',
              },
            }}
          >
            <Home />
          </TourProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
