import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const taskTypes = [
  'Delivery / Pickup',
  'Academic Help',
  'Errands',
  'Tech Support',
  'Cleaning',
  'Moving Help',
  'Other',
];

const CreateTaskScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [taskType, setTaskType] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [allowBarter, setAllowBarter] = useState(false);
  const [barterOffer, setBarterOffer] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePost = () => {
    if (!taskType || !description || !budget) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Task Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.form}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Type */}
        <Text style={styles.label}>Task Type</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={[styles.dropdownText, !taskType && styles.placeholder]}>
            {taskType || 'Select task type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the task in detail..."
          placeholderTextColor={colors.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Due Date & Time */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.placeholder}
                value={dueDate}
                onChangeText={setDueDate}
              />
            </View>
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Due Time</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                placeholderTextColor={colors.placeholder}
                value={dueTime}
                onChangeText={setDueTime}
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor={colors.placeholder}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Budget */}
        <Text style={styles.label}>Budget (GH¢)</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencyPrefix}>GH¢</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.placeholder}
            value={budget}
            onChangeText={setBudget}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Barter Toggle */}
        <View style={styles.barterContainer}>
          <View style={styles.barterHeader}>
            <View>
              <Text style={styles.barterTitle}>Allow Barter Offers</Text>
              <Text style={styles.barterSubtitle}>Accept services/items instead of cash</Text>
            </View>
            <Switch
              value={allowBarter}
              onValueChange={setAllowBarter}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
          
          {allowBarter && (
            <View style={styles.barterInput}>
              <Text style={styles.label}>What would you accept?</Text>
              <TextInput
                style={styles.textArea}
                placeholder="E.g., tutoring, food, printing services..."
                placeholderTextColor={colors.placeholder}
                value={barterOffer}
                onChangeText={setBarterOffer}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>

        {/* Post Button */}
        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>
            {loading ? 'Posting...' : 'Post Task'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Task Type Modal */}
      <Modal
        visible={showTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Task Type</Text>
            {taskTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  setTaskType(type);
                  setShowTypeModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  taskType === type && styles.modalOptionTextSelected
                ]}>
                  {type}
                </Text>
                {taskType === type && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  dropdownText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.placeholder,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  currencyPrefix: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  barterContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  barterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barterTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  barterSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  barterInput: {
    marginTop: spacing.md,
  },
  postButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
  postButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnPrimary,
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
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  modalOptionTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
});

export default CreateTaskScreen;
