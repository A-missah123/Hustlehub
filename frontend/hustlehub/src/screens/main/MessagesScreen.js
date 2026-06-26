import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Mock conversations
const mockConversations = [
  {
    id: '1',
    name: 'Alex M.',
    lastMessage: 'Great, I\'ll pick it up by 3pm!',
    time: '2m ago',
    unread: 2,
    avatar: 'A',
    taskTitle: 'Grocery Pickup',
  },
  {
    id: '2',
    name: 'Sarah K.',
    lastMessage: 'Is the location still the same?',
    time: '15m ago',
    unread: 0,
    avatar: 'S',
    taskTitle: 'Math Tutoring',
  },
  {
    id: '3',
    name: 'John D.',
    lastMessage: 'Task completed! Please confirm.',
    time: '1h ago',
    unread: 1,
    avatar: 'J',
    taskTitle: 'Food Delivery',
  },
  {
    id: '4',
    name: 'Emma R.',
    lastMessage: 'Thank you for the quick service!',
    time: '3h ago',
    unread: 0,
    avatar: 'E',
    taskTitle: 'Laptop Repair',
  },
];

// Mock chat messages
const mockMessages = [
  { id: '1', text: 'Hi! I saw your task for grocery pickup.', sender: 'other', time: '10:30 AM' },
  { id: '2', text: 'Yes, are you available today?', sender: 'me', time: '10:32 AM' },
  { id: '3', text: 'Absolutely! I can do it this afternoon.', sender: 'other', time: '10:33 AM' },
  { id: '4', text: 'Great! The list is attached. Need items from Fresh Mart.', sender: 'me', time: '10:35 AM' },
  { id: '5', text: 'Got it. I\'ll pick it up by 3pm!', sender: 'other', time: '10:36 AM' },
];

const MessagesScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: String(messages.length + 1),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => setActiveChat(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <Text style={styles.taskTitle}>{item.taskTitle}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.messageContainerMe : styles.messageContainerOther
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.messageBubbleMe : styles.messageBubbleOther
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.messageTextMe : styles.messageTextOther
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  // Chat View
  if (activeChat) {
    return (
      <KeyboardAvoidingView 
        style={[styles.container, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveChat(null)}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>{activeChat.avatar}</Text>
            </View>
            <View>
              <Text style={styles.chatName}>{activeChat.name}</Text>
              <Text style={styles.chatTask}>{activeChat.taskTitle}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input Area */}
        <View style={[styles.inputArea, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholder}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Conversations List View
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationsList: {
    paddingHorizontal: spacing.lg,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  conversationName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  conversationTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  taskTitle: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadText: {
    fontSize: typography.fontSize.xs,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  // Chat View Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: spacing.md,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  chatAvatarText: {
    fontSize: typography.fontSize.base,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  chatName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  chatTask: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  messageContainerMe: {
    alignItems: 'flex-end',
  },
  messageContainerOther: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  messageBubbleMe: {
    backgroundColor: colors.chatBubbleSender,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: colors.chatBubbleReceiver,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * 1.4,
  },
  messageTextMe: {
    color: colors.textInverse,
  },
  messageTextOther: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginHorizontal: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.disabled,
  },
});

export default MessagesScreen;
