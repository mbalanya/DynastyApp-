import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ProfileScreen from './ProfileScreen';
import EventDetailsScreen from './EventDetailsScreen';
import AdminScreen from './AdminScreen';
import AllMembersScreen from './AllMembersScreen';
import AllTransactionsScreen from './AllTransactionsScreen';
import LogsScreen from './LogsScreen';
import AssignRolesScreen from './AssignRolesScreen';
import RoleSelectorScreen from './RoleSelectorScreen';
import SignUpScreen from './SignUpScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
    return (
      <Tab.Navigator
        initialRouteName="Details"
        activeColor="#fff"
        shifting={true}
        sceneAnimationEnabled={false}
        barStyle={{ backgroundColor: '#ffff' }}
      >
      <Tab.Screen
        name="Details"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'My Contributions',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>

    );
};

const HomeStackScreen = ({ navigation }) => {
    return(
      <HomeStack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#009387'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}>
        
      </HomeStack.Navigator>
  
    )
  }
  
  const DetailsStackScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState({});
    
    useEffect(() => {
      let unmounted = false;
      const fetchToken = async () => {
        try {
          let tokenResponse = await AsyncStorage.getItem('userToken');
          var token = tokenResponse.replace('Bearer ','');
          var decode = jwt_decode(token);
          setUserToken(decode);
        } catch (err) {
          console.log(err)
        }
      }
      fetchToken();
        return () => { unmounted = true };
    }, []);

    //console.log(userToken.role)
    return (
      <DetailsStack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#009387'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}>
        <DetailsStack.Screen name="My Contributions" component={DetailsScreen} options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} >
              <Icon name={'menu'} size={28} color={'white'} style={{marginLeft:15}}/>
            </TouchableOpacity> 
           ),
           headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              { userToken.role === "admin" || userToken.role === "superadmin"
              ?
              <View>
                <TouchableOpacity onPress={() => navigation.navigate('Admin')} >
                  <Icon name={'account-lock-outline'} size={28} color={'white'} style={{marginRight:30}}/>
                </TouchableOpacity> 
              </View>
              : null }
              <View>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} >
                  <Icon name={'magnify'} size={28} color={'white'} style={{marginRight:30}}/>
                </TouchableOpacity> 
              </View>
            </View>
           )
        }} />
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
          title: 'Search',
        }} />
        <HomeStack.Screen name="EventDetails" component={EventDetailsScreen} options={{
          title: 'Event Details'
        }} />
        { userToken.role === "admin" || userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="Admin" component={AdminScreen} options={{
          title: 'Admin Panel'
        }} />
        : null }
        { userToken.role === "admin" || userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="AllMembers" component={AllMembersScreen} options={{
          title: 'All Dynasty Members'
        }} />
        : null }
        { userToken.role === "admin" || userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="AllTransactions" component={AllTransactionsScreen} options={{
          title: 'All Dynasty Transactions'
        }} />
        : null }
        { userToken.role === "admin" || userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="SignUp" component={SignUpScreen} options={{
          title: 'Add New Member'
        }} />
        : null }
        { userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="Logs" component={LogsScreen} options={{
          title: 'Users Activity'
        }} />
        : null }
        { userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="AssignRoles" component={AssignRolesScreen} options={{
          title: 'Assign Roles'
        }} />
        : null }
        { userToken.role === "superadmin"
        ?
        <HomeStack.Screen name="RoleSelector" component={RoleSelectorScreen} options={{
          title: 'Assign Roles'
        }} />
        : null }
      </DetailsStack.Navigator>
  
    )
  }

  export default MainTabScreen;