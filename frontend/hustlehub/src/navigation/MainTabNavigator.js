import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

import {
  HomeScreen,
  TasksScreen,
  ProfileScreen,
  NotificationsScreen,
} from '../screens/main';

const Tab = createBottomTabNavigator();

// Empty component for the Post tab
const EmptyScreen = () => null;

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'HomeTab', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'SearchTab', label: 'Explore', icon: 'compass', iconOutline: 'compass-outline' },
    { name: 'PostTab', label: 'Post', icon: 'add', isCenter: true },
    { name: 'ActivityTab', label: 'Activity', icon: 'pulse', iconOutline: 'pulse-outline' },
    { name: 'ProfileTab', label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
  ];

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom || 8 }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const route = state.routes.find(r => r.name === tab.name);
          const isFocused = route ? state.index === state.routes.indexOf(route) : false;

          const onPress = () => {
            if (tab.name === 'PostTab') {
              navigation.navigate('CreateTask');
              return;
            }
            
            if (route) {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            }
          };

          // Center Post Button
          if (tab.isCenter) {
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={onPress}
                style={styles.centerButtonWrapper}
                activeOpacity={0.85}
              >
                <View style={styles.centerButton}>
                  <Ionicons name="add" size={30} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            );
          }

          const iconName = isFocused ? tab.icon : tab.iconOutline;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? colors.primary : colors.textTertiary}
              />
              <Text style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="SearchTab" component={TasksScreen} />
      <Tab.Screen name="PostTab" component={EmptyScreen} />
      <Tab.Screen name="ActivityTab" component={NotificationsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default MainTabNavigator;
