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
  },
  stats: {
    key: 'stats',
    order: 3,
    name: 'View Statistics',
    description: 'Check your daily progress and analytics in real-time.',
  },
  action: {
    key: 'action',
    order: 4,
    name: 'Quick Action',
    description:
      'Perform quick tasks like adding a new item or maximizing productivity.',
  },
  users: {
    key: 'users',
    order: 5,
    name: 'Team Members',
    description: 'See who is online (Circular shapes example).',
  },
  tags: {
    key: 'tags',
    order: 6,
    name: 'Categories',
    description: 'Filter content by category (Pill shapes example).',
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
} as const;
