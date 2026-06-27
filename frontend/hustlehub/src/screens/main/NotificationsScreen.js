import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const FILTERS = ['All', 'Applications', 'Tasks', 'Payments'];

// Mock activity data
const mockActivity = [
  {
    id: '1',
    type: 'application',
    title: 'New Application',
    message: 'Alex M. applied to help with your task "Grocery Pickup"',
    time: '2 min ago',
    read: false,
    icon: 'person-add',
    iconColor: '#4ECDC4',
    avatar: 'A',
  },
  {
    id: '2',
    type: 'application',
    title: 'Application Accepted!',
    message: 'John K. accepted your application for "Food Delivery"',
    time: '10 min ago',
    read: false,
    icon: 'checkmark-circle',
    iconColor: colors.success,
    avatar: 'J',
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Sarah K. sent you a message about "Math Tutoring"',
    time: '15 min ago',
    read: false,
    icon: 'chatbubble',
    iconColor: colors.primary,
    avatar: 'S',
  },
  {
    id: '4',
    type: 'task',
    title: 'Task Completed',
    message: 'You marked "Moving Help" as completed. Awaiting confirmation.',
    time: '1 hour ago',
    read: true,
    icon: 'checkmark-done-circle',
    iconColor: colors.success,
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received GH₵ 25 for completing "Moving Help"',
    time: '3 hours ago',
    read: true,
    icon: 'wallet',
    iconColor: '#45B7D1',
  },
  {
    id: '6',
    type: 'rating',
    title: 'New Review',
    message: 'Emma R. left you a 5-star review! ⭐️',
    time: '5 hours ago',
    read: true,
    icon: 'star',
    iconColor: '#FFB800',
    avatar: 'E',
  },
  {
    id: '7',
    type: 'task',
    title: 'Task Reminder',
    message: '"Laptop Repair" is due in 2 hours. Don\'t forget!',
    time: '6 hours ago',
    read: true,
    icon: 'alarm',
    iconColor: '#FF9800',
  },
  {
    id: '8',
    type: 'application',
    title: '3 New Applications',
    message: 'Your task "Help with Calculus" has 3 new applications',
    time: '1 day ago',
    read: true,
    icon: 'people',
    iconColor: '#4ECDC4',
  },
];

const NotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activity, setActivity] = useState(mockActivity);
  const [activeFilter, setActiveFilter] = useState('All');

  const markAllAsRead = () => {
    setActivity(activity.map(n => ({ ...n, read: true })));
  };

  const unreadCount = activity.filter(n => !n.read).length;

  const filteredActivity = activity.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Applications') return item.type === 'application';
    if (activeFilter === 'Tasks') return item.type === 'task' || item.type === 'rating';
    if (activeFilter === 'Payments') return item.type === 'payment';
    return true;
  });

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.activityCard, !item.read && styles.activityUnread]}
      onPress={() => {
        setActivity(activity.map(n => 
          n.id === item.id ? { ...n, read: true } : n
        ));
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}15` }]}>
        {item.avatar ? (
          <Text style={[styles.avatarText, { color: item.iconColor }]}>{item.avatar}</Text>
        ) : (
          <Ionicons name={item.icon} size={22} color={item.iconColor} />
        )}
      </View>
      
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.activityMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        {unreadCount > 0 && (
          <TouchableOpacity 
            onPress={markAllAsRead}
            style={styles.markReadButton}
          >
            <Text style={styles.markAllRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text 
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
            {filter === 'Applications' && unreadCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activity List */}
      <FlatList
        data={filteredActivity}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="flash-outline" size={48} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyStateTitle}>No activity yet</Text>
            <Text style={styles.emptyStateText}>
              Your recent activities will appear here
            </Text>
          </View>
        }
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  markReadButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  markAllRead: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityUnread: {
    backgroundColor: `${colors.primary}05`,
    borderColor: `${colors.primary}25`,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  activityMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyStateText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
