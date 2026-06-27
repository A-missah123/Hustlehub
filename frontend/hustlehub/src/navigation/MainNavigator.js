import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigator';
import {
  CreateTaskScreen,
  TaskDetailsScreen,
  NotificationsScreen,
  MessagesScreen,
  WalletScreen,
  RentalsScreen,
} from '../screens/main';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="CreateTask" 
        component={CreateTaskScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Rentals" component={RentalsScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
