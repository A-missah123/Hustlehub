import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const { width } = Dimensions.get('window');

// Mock data
const mockUser = {
  name: 'Jane',
  avatar: 'J',
};

const mockTasks = [
  {
    id: '1',
    title: 'Grocery Pickup from Shoprite',
    category: 'Delivery',
    categoryIcon: 'bag-handle',
    categoryColor: '#FF6B6B',
    location: 'Shoprite, Legon Mall',
    address: 'Near the Night Market, Legon',
    distance: '0.5 km',
    budget: 25,
    postedBy: 'John K.',
    avatar: 'J',
    rating: 4.8,
    tasksPosted: 12,
    postedAgo: '15 min ago',
    applicants: 3,
    isUrgent: true,
    isDelivery: true,
    destinationName: 'Akuafo Hall',
    destinationAddress: 'Room 205, Block C',
    description: 'I need someone to pick up my groceries from Shoprite at the mall. The list includes basic items like bread, milk, eggs, fruits, and some vegetables.',
    requirements: ['Must have a bag', 'Delivery within 2 hours'],
    origin: { latitude: 5.6520, longitude: -0.1870 },
    destination: { latitude: 5.6580, longitude: -0.1920 },
  },
  {
    id: '2',
    title: 'Help with Calculus Assignment',
    category: 'Tutoring',
    categoryIcon: 'school',
    categoryColor: '#4ECDC4',
    location: 'Balme Library',
    address: 'Ground Floor, Reading Area',
    distance: '0.8 km',
    budget: 40,
    postedBy: 'Sarah M.',
    avatar: 'S',
    rating: 4.9,
    tasksPosted: 8,
    postedAgo: '1 hr ago',
    applicants: 5,
    isUrgent: false,
    isDelivery: false,
    description: 'Need help understanding calculus concepts for my upcoming exam. Topics include integration and differentiation.',
    requirements: ['Strong math background', 'Patient teacher'],
    origin: { latitude: 5.6505, longitude: -0.1860 },
  },
  {
    id: '3',
    title: 'Move boxes to Akuafo Hall',
    category: 'Errands',
    categoryIcon: 'cube',
    categoryColor: '#45B7D1',
    location: 'Volta Hall',
    address: 'Room 112, Block A',
    distance: '1.2 km',
    budget: 35,
    postedBy: 'Mike T.',
    avatar: 'M',
    rating: 4.5,
    tasksPosted: 5,
    postedAgo: '2 hrs ago',
    applicants: 2,
    isUrgent: false,
    isDelivery: true,
    destinationName: 'Akuafo Hall',
    destinationAddress: 'Room 305, Block B',
    description: 'Need help moving 4 boxes from Volta Hall to Akuafo Hall. Boxes are not too heavy.',
    requirements: ['Physically fit', 'Available now'],
    origin: { latitude: 5.6490, longitude: -0.1850 },
    destination: { latitude: 5.6560, longitude: -0.1900 },
  },
  {
    id: '4',
    title: 'Fix laptop screen flickering',
    category: 'Tech Help',
    categoryIcon: 'laptop',
    categoryColor: '#96CEB4',
    location: 'Engineering Building',
    address: 'Room 204, Computer Lab',
    distance: '0.3 km',
    budget: 50,
    postedBy: 'Emma L.',
    avatar: 'E',
    rating: 4.7,
    tasksPosted: 3,
    postedAgo: '30 min ago',
    applicants: 1,
    isUrgent: true,
    isDelivery: false,
    description: 'My laptop screen keeps flickering. Need someone with tech experience to diagnose and fix the issue.',
    requirements: ['Tech experience', 'Own tools if needed'],
    origin: { latitude: 5.6535, longitude: -0.1885 },
  },
];

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const TaskCard = ({ task }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task })}
      activeOpacity={0.7}
    >
      {/* Top Row: Category + Urgent Badge */}
      <View style={styles.taskCardTop}>
        <View style={[styles.categoryBadge, { backgroundColor: `${task.categoryColor}15` }]}>
          <Ionicons name={task.categoryIcon} size={14} color={task.categoryColor} />
          <Text style={[styles.categoryText, { color: task.categoryColor }]}>{task.category}</Text>
        </View>
        {task.isUrgent && (
          <View style={styles.urgentBadge}>
            <Ionicons name="flash" size={12} color="#FF6B6B" />
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>

      {/* Location Row */}
      <View style={styles.locationRow}>
        <Ionicons name="location" size={16} color={colors.primary} />
        <Text style={styles.locationText}>{task.location}</Text>
        <View style={styles.distanceDot} />
        <Text style={styles.distanceText}>{task.distance} away</Text>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Bottom Row: Poster Info + Budget */}
      <View style={styles.taskCardBottom}>
        <View style={styles.posterRow}>
          <View style={styles.posterAvatar}>
            <Text style={styles.posterAvatarText}>{task.avatar}</Text>
          </View>
          <View style={styles.posterInfo}>
            <Text style={styles.posterName}>{task.postedBy}</Text>
            <View style={styles.posterMeta}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={styles.posterRating}>{task.rating}</Text>
              <Text style={styles.postedTime}> · {task.postedAgo}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetValue}>GH₵ {task.budget}</Text>
        </View>
      </View>

      {/* Applicants indicator */}
      {task.applicants > 0 && (
        <View style={styles.applicantsRow}>
          <View style={styles.applicantAvatars}>
            {[...Array(Math.min(task.applicants, 3))].map((_, i) => (
              <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 3-i }]}>
                <Text style={styles.miniAvatarText}>{String.fromCharCode(65 + i)}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.applicantsText}>
            {task.applicants} {task.applicants === 1 ? 'person' : 'people'} applied
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{mockUser.avatar}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hello, {mockUser.name} 👋</Text>
            <Text style={styles.subGreeting}>Find tasks nearby</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Messages')}
          >
            <Ionicons name="chatbubble-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => navigation.navigate('ActivityTab')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('SearchTab')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>Search for tasks, services...</Text>
          <View style={styles.searchFilter}>
            <Ionicons name="options-outline" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-done" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="wallet" size={20} color="#2196F3" />
            </View>
            <Text style={styles.statValue}>GH₵ 340</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="star" size={20} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {mockTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: spacing.lg,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: spacing.lg,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  searchFilter: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  // Task Card
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginLeft: 4,
    fontWeight: '500',
  },
  distanceDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  taskCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  posterAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  posterInfo: {},
  posterName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  posterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  posterRating: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  postedTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  budgetContainer: {
    alignItems: 'flex-end',
  },
  budgetLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  applicantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applicantAvatars: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  applicantsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
