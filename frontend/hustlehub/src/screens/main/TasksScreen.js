import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'tutoring', label: 'Tutoring' },
  { id: 'errands', label: 'Errands' },
  { id: 'tech', label: 'Tech Help' },
];

const mockTasks = [
  {
    id: '1',
    title: 'Grocery Pickup',
    description: 'Need someone to pick up groceries from Shoprite near campus',
    location: 'Campus Area',
    distance: '0.5 km',
    budget: 'GH₵ 25',
    postedBy: 'John K.',
    avatar: 'J',
    rating: 4.8,
    bidsCount: 3,
    timePosted: '2h ago',
    category: 'delivery',
  },
  {
    id: '2',
    title: 'Laptop Repair Help',
    description: 'Need tech-savvy person to help fix laptop screen issues',
    location: 'Tech Hub',
    distance: '1.2 km',
    budget: 'GH₵ 50',
    postedBy: 'Emma R.',
    avatar: 'E',
    rating: 4.9,
    bidsCount: 5,
    timePosted: '3h ago',
    category: 'tech',
  },
  {
    id: '3',
    title: 'Moving Boxes',
    description: 'Help needed to move boxes to new dorm room building B',
    location: 'Dorm A',
    distance: '0.3 km',
    budget: 'GH₵ 30',
    postedBy: 'Mike L.',
    avatar: 'M',
    rating: 4.5,
    bidsCount: 2,
    timePosted: '5h ago',
    category: 'errands',
  },
  {
    id: '4',
    title: 'Math Tutoring',
    description: 'Need help with calculus preparation for finals exam',
    location: 'Library',
    distance: '0.8 km',
    budget: 'GH₵ 40',
    postedBy: 'Lisa W.',
    avatar: 'L',
    rating: 4.7,
    bidsCount: 4,
    timePosted: '1h ago',
    category: 'tutoring',
  },
  {
    id: '5',
    title: 'Food Delivery',
    description: 'Pick up food order from the cafeteria, deliver to hostel',
    location: 'Student Center',
    distance: '0.4 km',
    budget: 'GH₵ 15',
    postedBy: 'Tom B.',
    avatar: 'T',
    rating: 4.6,
    bidsCount: 6,
    timePosted: '30m ago',
    category: 'delivery',
  },
];

const TasksScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = mockTasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.category === activeFilter;
  });

  const renderTaskCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
      activeOpacity={0.7}
    >
      <View style={styles.taskCardTop}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.budgetContainer}>
          <Text style={styles.taskBudget}>{item.budget}</Text>
        </View>
      </View>
      
      <View style={styles.taskLocation}>
        <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
        <Text style={styles.locationText}>{item.location}</Text>
        <View style={styles.dot} />
        <Text style={styles.distanceText}>{item.distance}</Text>
      </View>
      
      <View style={styles.taskCardBottom}>
        <View style={styles.posterInfo}>
          <View style={styles.posterAvatar}>
            <Text style={styles.posterAvatarText}>{item.avatar}</Text>
          </View>
          <View>
            <Text style={styles.posterName}>{item.postedBy}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardActions}>
          <Text style={styles.timeText}>{item.timePosted}</Text>
          <View style={styles.bidsBadge}>
            <Text style={styles.bidsText}>{item.bidsCount} bids</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {}}
        >
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Pills */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterPill,
                activeFilter === filter.id && styles.filterPillActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredTasks.length} tasks found</Text>
      </View>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.tasksList, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filtersList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  tasksList: {
    paddingHorizontal: spacing.lg,
  },
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
    marginBottom: spacing.sm,
  },
  taskInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  taskTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  budgetContainer: {
    alignItems: 'flex-end',
  },
  taskBudget: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  taskLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  taskCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  posterAvatarText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  posterName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  bidsBadge: {
    backgroundColor: `${colors.primary}12`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bidsText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default TasksScreen;
