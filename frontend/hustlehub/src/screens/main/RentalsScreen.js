import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Mock barter/rental items
const mockItems = [
  {
    id: '1',
    type: 'barter',
    title: 'Math Tutoring for Web Dev Help',
    offering: '2 hours of Calculus tutoring',
    seeking: 'Help with HTML/CSS website',
    postedBy: 'Alex M.',
    rating: 4.8,
    timePosted: '1h ago',
  },
  {
    id: '2',
    type: 'rental',
    title: 'Scientific Calculator',
    description: 'TI-84 Plus, perfect condition',
    rate: 'GH¢5/day',
    postedBy: 'Sarah K.',
    rating: 4.9,
    timePosted: '3h ago',
  },
  {
    id: '3',
    type: 'barter',
    title: 'Cooking for Cleaning',
    offering: 'Home-cooked meals (3 days)',
    seeking: 'Dorm room cleaning service',
    postedBy: 'John D.',
    rating: 4.5,
    timePosted: '5h ago',
  },
  {
    id: '4',
    type: 'rental',
    title: 'Camera for Rent',
    description: 'Canon DSLR with kit lens',
    rate: 'GH¢30/day',
    postedBy: 'Emma R.',
    rating: 4.7,
    timePosted: '6h ago',
  },
  {
    id: '5',
    type: 'barter',
    title: 'Graphic Design for Writing',
    offering: 'Logo design services',
    seeking: 'Essay proofreading help',
    postedBy: 'Mike L.',
    rating: 4.6,
    timePosted: '8h ago',
  },
];

const RentalsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [offerText, setOfferText] = useState('');

  const handleOffer = (item) => {
    setSelectedItem(item);
    setShowOfferModal(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.typeBadge, 
          { backgroundColor: item.type === 'barter' ? `${colors.accent}20` : `${colors.primary}20` }
        ]}>
          <Text style={[
            styles.typeBadgeText,
            { color: item.type === 'barter' ? colors.accent : colors.primary }
          ]}>
            {item.type === 'barter' ? 'Barter' : 'Rental'}
          </Text>
        </View>
        <Text style={styles.timePosted}>{item.timePosted}</Text>
      </View>
      
      <Text style={styles.cardTitle}>{item.title}</Text>
      
      {item.type === 'barter' ? (
        <View style={styles.barterDetails}>
          <View style={styles.barterItem}>
            <Text style={styles.barterLabel}>Offering:</Text>
            <Text style={styles.barterValue}>{item.offering}</Text>
          </View>
          <View style={styles.barterExchange}>
            <Ionicons name="swap-horizontal" size={20} color={colors.accent} />
          </View>
          <View style={styles.barterItem}>
            <Text style={styles.barterLabel}>Seeking:</Text>
            <Text style={styles.barterValue}>{item.seeking}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.rentalDetails}>
          <Text style={styles.rentalDescription}>{item.description}</Text>
          <Text style={styles.rentalRate}>{item.rate}</Text>
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <View style={styles.posterInfo}>
          <View style={styles.posterAvatar}>
            <Text style={styles.posterAvatarText}>{item.postedBy.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.posterName}>{item.postedBy}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={colors.accent} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.offerButton}
          onPress={() => handleOffer(item)}
        >
          <Text style={styles.offerButtonText}>
            {item.type === 'barter' ? 'Offer' : 'Rent'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredItems = activeFilter === 'all' 
    ? mockItems 
    : mockItems.filter(item => item.type === activeFilter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Barter & Rentals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {}}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'barter' && styles.filterTabActive]}
          onPress={() => setActiveFilter('barter')}
        >
          <Ionicons 
            name="swap-horizontal" 
            size={16} 
            color={activeFilter === 'barter' ? colors.textInverse : colors.textSecondary} 
            style={{ marginRight: spacing.xs }}
          />
          <Text style={[styles.filterText, activeFilter === 'barter' && styles.filterTextActive]}>
            Barter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'rental' && styles.filterTabActive]}
          onPress={() => setActiveFilter('rental')}
        >
          <Ionicons 
            name="cube-outline" 
            size={16} 
            color={activeFilter === 'rental' ? colors.textInverse : colors.textSecondary} 
            style={{ marginRight: spacing.xs }}
          />
          <Text style={[styles.filterText, activeFilter === 'rental' && styles.filterTextActive]}>
            Rentals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Offer Modal */}
      <Modal
        visible={showOfferModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOfferModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOfferModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem?.type === 'barter' ? 'Make a Barter Offer' : 'Rental Request'}
            </Text>
            
            {selectedItem?.type === 'barter' ? (
              <>
                <Text style={styles.modalLabel}>What can you offer in exchange?</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Describe your offer..."
                  placeholderTextColor={colors.placeholder}
                  value={offerText}
                  onChangeText={setOfferText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </>
            ) : (
              <>
                <Text style={styles.modalLabel}>Rental Duration</Text>
                <View style={styles.durationOptions}>
                  {['1 Day', '3 Days', '1 Week'].map((duration) => (
                    <TouchableOpacity 
                      key={duration}
                      style={styles.durationButton}
                    >
                      <Text style={styles.durationButtonText}>{duration}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.modalLabel}>Message (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Add a note..."
                  placeholderTextColor={colors.placeholder}
                  value={offerText}
                  onChangeText={setOfferText}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </>
            )}
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => {
                setShowOfferModal(false);
                setOfferText('');
              }}
            >
              <Text style={styles.submitButtonText}>Send {selectedItem?.type === 'barter' ? 'Offer' : 'Request'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  filterTextActive: {
    color: colors.textInverse,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  timePosted: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  barterDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  barterItem: {
    flex: 1,
  },
  barterLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  barterValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  barterExchange: {
    paddingHorizontal: spacing.sm,
  },
  rentalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rentalDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  rentalRate: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  posterAvatarText: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  posterName: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
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
  offerButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  offerButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textInverse,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    minHeight: 100,
  },
  durationOptions: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  durationButton: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  durationButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.base,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textInverse,
  },
});

export default RentalsScreen;
