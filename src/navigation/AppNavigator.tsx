import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants';
import HomeScreen from '../screens/Home/HomeScreen';
import PhishingDetectorScreen from '../screens/PhishingDetector/PhishingDetectorScreen';
import MessageAnalyzerScreen from '../screens/MessageAnalyzer/MessageAnalyzerScreen';
import DataLeakMonitorScreen from '../screens/DataLeakMonitor/DataLeakMonitorScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { BottomTabParamList } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  PhishingDetector: '🎣',
  MessageAnalyzer: '🔍',
  DataLeakMonitor: '🛡️',
  Settings: '⚙️',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>
          ),
          tabBarActiveTintColor: COLORS.highlight,
          tabBarInactiveTintColor: COLORS.text.muted,
          tabBarStyle: {
            backgroundColor: COLORS.background.card,
            borderTopColor: COLORS.border,
            paddingBottom: 4,
          },
          tabBarLabelStyle: { fontSize: 10 },
          headerStyle: { backgroundColor: COLORS.background.dark },
          headerTintColor: COLORS.text.primary,
          headerTitleStyle: { fontWeight: '700' },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Główna' }} />
        <Tab.Screen name="PhishingDetector" component={PhishingDetectorScreen} options={{ title: 'Phishing' }} />
        <Tab.Screen name="MessageAnalyzer" component={MessageAnalyzerScreen} options={{ title: 'Wiadomości' }} />
        <Tab.Screen name="DataLeakMonitor" component={DataLeakMonitorScreen} options={{ title: 'Wycieki' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ustawienia' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
