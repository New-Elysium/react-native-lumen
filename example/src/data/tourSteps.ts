// Example tour step configurations demonstrating various spotlight styles
export const tourSteps = {
  welcome: {
    key: 'welcome',
    order: 1,
    name: 'Welcome to Lumen',
    description:
      'This is a high-performance app tour library for React Native.',
  },
  profile: {
    key: 'profile',
    order: 2,
    name: 'User Profile',
    description: 'Manage your account settings and personal information here.',
    // Example: Custom glow color for profile
    spotlightStyle: {
      glowColor: '#6C5CE7',
      borderColor: '#6C5CE7',
      padding: 12,
    },
  },
  bioInput: {
    key: 'bio-input',
    order: 2.5,
    name: 'Bio Input',
    description:
      'Edit your bio to tell others about yourself. This is an interactive input field!',
  },
  pollSection: {
    key: 'poll-section',
    order: 2.6,
    name: 'Poll Section',
    description:
      'Participate in polls and see what others think. Interactive poll example!',
  },
  promptSection: {
    key: 'prompt-section',
    order: 2.7,
    name: 'Daily Prompt',
    description:
      'Answer daily prompts to engage with the community. Interactive prompt example!',
    // Example: Red glow for prompts
    spotlightStyle: {
      glowColor: '#FF6B6B',
      borderColor: '#FF6B6B',
      glowOpacity: 0.5,
    },
  },
  stats: {
    key: 'stats',
    order: 3,
    name: 'View Statistics',
    description: 'Check your daily progress and analytics in real-time.',
    // Example: Teal accent
    spotlightStyle: {
      borderColor: '#4ECDC4',
      glowColor: '#4ECDC4',
    },
  },
  action: {
    key: 'action',
    order: 4,
    name: 'Quick Action',
    description:
      'Perform quick tasks like adding a new item or maximizing productivity.',
    // Example: Circle shape for FAB button
    spotlightStyle: {
      shape: 'circle' as const,
      glowColor: '#6C5CE7',
      borderColor: '#6C5CE7',
      glowOpacity: 0.6,
      glowRadius: 16,
    },
  },
  users: {
    key: 'users',
    order: 5,
    name: 'Team Members',
    description: 'See who is online (Pill shape example).',
    // Example: Pill shape for row of avatars
    spotlightStyle: {
      shape: 'pill' as const,
      padding: 8,
    },
  },
  tags: {
    key: 'tags',
    order: 6,
    name: 'Categories',
    description: 'Filter content by category (Pill shape example).',
    // Example: Pill shape
    spotlightStyle: {
      shape: 'pill' as const,
      borderColor: '#0984e3',
      glowColor: '#0984e3',
    },
  },
  wallet: {
    key: 'wallet',
    order: 7,
    name: 'Wallet',
    description: 'Manage your wallet and transactions here.',
  },
  products: {
    key: 'products',
    order: 8,
    name: 'Products',
    description: 'Manage your products and inventory here.',
  },
  // Advanced tour examples
  settings: {
    key: 'settings',
    order: 9,
    name: 'Settings',
    description:
      'Configure your app preferences and customize your experience.',
  },
  notifications: {
    key: 'notifications',
    order: 10,
    name: 'Notifications',
    description: 'Stay updated with real-time notifications and alerts.',
    // Example: Custom padding and red accent for notifications
    spotlightStyle: {
      borderColor: '#FF6B6B',
      glowColor: '#FF6B6B',
      borderWidth: 3,
    },
  },
  search: {
    key: 'search',
    order: 11,
    name: 'Search',
    description: 'Find anything quickly with our powerful search feature.',
  },
  help: {
    key: 'help',
    order: 12,
    name: 'Help & Support',
    description:
      'Get help when you need it with our comprehensive support center.',
    // Example: Slower animation for final step
    spotlightStyle: {
      springDamping: 30,
      springStiffness: 60,
    },
  },
} as const;
