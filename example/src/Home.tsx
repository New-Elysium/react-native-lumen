import { StyleSheet, Text, View, Pressable } from 'react-native';
import { TourZone, useTour } from 'react-native-lumen';
import { User, BarChart2, Plus, Info, Users, Tag } from 'lucide-react-native';
import { tourSteps } from './data/tourSteps';
import { useEffect } from 'react';
import Animated from 'react-native-reanimated';

const Card = ({
  title,
  icon: Icon,
  color,
}: {
  title: string;
  icon: any;
  color: string;
}) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Icon color="white" size={32} />
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

export const Home = () => {
  const { start, scrollViewRef } = useTour();

  useEffect(() => {
    start(tourSteps.welcome.key);
  }, []);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <TourZone
          stepKey={tourSteps.welcome.key}
          description={tourSteps.welcome.description}
          borderRadius={12}
        >
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeText}>Hello, User! 👋</Text>
            <Text style={styles.subtitle}>Welcome to the example app.</Text>
          </View>
        </TourZone>
      </View>

      <View style={styles.grid}>
        <TourZone
          stepKey={tourSteps.profile.key}
          description={tourSteps.profile.description}
          borderRadius={16}
          style={{ flex: 1 }}
        >
          <Card title="Profile" icon={User} color="#FF6B6B" />
        </TourZone>

        <TourZone
          stepKey={tourSteps.stats.key}
          description={tourSteps.stats.description}
          borderRadius={16}
          style={{ flex: 1 }}
        >
          <Card title="Stats" icon={BarChart2} color="#4ECDC4" />
        </TourZone>
      </View>

      <View style={styles.actionContainer}>
        <TourZone
          stepKey={tourSteps.action.key}
          description={tourSteps.action.description}
          borderRadius={30}
        >
          <Pressable style={styles.fab} onPress={() => console.log('Action')}>
            <Plus color="white" size={28} />
          </Pressable>
        </TourZone>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        <TourZone
          stepKey={tourSteps.users.key}
          name={tourSteps.users.name}
          order={tourSteps.users.order}
          description={tourSteps.users.description}
          shape="rect"
          borderRadius={24}
        >
          <View style={styles.avatarRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <View
                key={i}
                style={[
                  styles.avatar,
                  {
                    backgroundColor: `rgba(108, 92, 231, ${0.4 + i * 0.15})`,
                    marginLeft: i === 1 ? 0 : -10,
                  },
                ]}
              >
                <Users color="white" size={20} />
              </View>
            ))}
          </View>
        </TourZone>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TourZone
          stepKey={tourSteps.tags.key}
          name={tourSteps.tags.name}
          order={tourSteps.tags.order}
          description={tourSteps.tags.description}
          borderRadius={20}
        >
          <View style={styles.tagContainer}>
            {['Design', 'Product', 'Marketing'].map((tag, i) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: i % 2 === 0 ? '#0984e3' : '#00b894' },
                ]}
              >
                <Tag color="white" size={14} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </TourZone>
      </View>

      <View style={styles.grid}>
        <TourZone
          stepKey={tourSteps.wallet.key}
          description={tourSteps.wallet.description}
          order={tourSteps.wallet.order}
          borderRadius={16}
          style={{ flex: 1 }}
        >
          <Card title="Wallet" icon={User} color="#6b95ff" />
        </TourZone>

        <TourZone
          stepKey={tourSteps.products.key}
          description={tourSteps.products.description}
          order={tourSteps.products.order}
          borderRadius={16}
          style={{ flex: 1 }}
        >
          <Card title="Products" icon={BarChart2} color="#c24ecd" />
        </TourZone>
      </View>

      <View style={styles.infoContainer}>
        <Info color="#888" size={20} />
        <Text style={styles.infoText}>
          Tap "Start Tour" to begin the tutorial.
        </Text>
      </View>

      <Pressable
        style={styles.startButton}
        onPress={() => start(tourSteps.welcome.key)}
      >
        <Text style={styles.startButtonText}>Start Tour</Text>
      </Pressable>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  welcomeBanner: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  actionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    width: '100%',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#888',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#2D3436',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
