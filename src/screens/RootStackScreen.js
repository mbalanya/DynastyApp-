import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name='Splash' component={SplashScreen} />
        <RootStack.Screen name='SignIn' component={SignInScreen} />
    </RootStack.Navigator>
);

export default RootStackScreen;