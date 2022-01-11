import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Profile from '../screens/Profile';
import AssignmentList from "../screens/AssignmentList"
import AssignmentDetails from "../screens/AssignmentDetail"

export const HomeStackNavigator = createStackNavigator(
  {
    Home: {
      screen: AssignmentList,
      navigationOptions: { headerShown: false },
    },
    AssignmentDetails: {
      screen: AssignmentDetails,
      navigationOptions: { headerShown: false },
    },
    Profile: {
      screen: Profile,
      navigationOptions: { headerShown: false },
    },
   
  },
  {
    initialRouteName: 'Home',
  }
);
