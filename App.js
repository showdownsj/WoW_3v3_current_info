import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/SecondScreen';
import Leaderboards from './Screens/LeaderboardsScreen';

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Profile: ProfileScreen,
    Leaderboards: Leaderboards,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}



