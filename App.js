import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/splashScreen'

import { HomeStackNavigator} from './components/HomeStackNavigator.js';

export default function App() {
  return <AppContainer />;
} 
 
const switchNavigator = createSwitchNavigator({
  SplashScreen:{screen: SplashScreen},
  Login: { screen: LoginScreen },
  HomeStack: { screen: HomeStackNavigator },
}); 

const AppContainer = createAppContainer(switchNavigator);
