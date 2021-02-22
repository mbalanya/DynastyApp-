import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import DynastyAppApi from '../../api/DynastyAppApi';
import jwt_decode from 'jwt-decode';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../components/context';

export function DrawerContent(props) {
    const [profile, setProfile] = useState([]);
    const [userToken, setUserToken] = useState({});
    const isDrawerOpen = useIsDrawerOpen()


    const fetchData = async () => {
        try {
          let tokenResponse = await AsyncStorage.getItem('userToken');
  
          try {
            const response = await DynastyAppApi.get('/api/v1/memberProfile', {
              headers: {'Authorization': tokenResponse}
          })
            setProfile(response.data.data.member[0]);
            //setLoading(false);
          } catch (err) {
              console.log(err)
          }
        } catch (err) {
          console.log(err);
        }
      }
  
    useEffect(() => {
      let unmounted = false;
        fetchData();
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
    }, [profile.length]);
  

    const paperTheme = useTheme();
    {isDrawerOpen ? fetchData() : null }

    const { signOut, toggleTheme } = React.useContext(AuthContext);

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <TouchableRipple 
                            onPress={() => {props.navigation.navigate('Profile')}} 
                            >
                            <View
                                style={{ 
                                    flexDirection: 'column', 
                                    marginTop: 15, 
                                    alignItems: 'center' 
                                }}
                            >
                                <Avatar.Image 
                                    source={{
                                        uri: profile.image_url
                                    }}
                                    size={100}
                                />
                                <View style={{ flexDirection: 'column', marginTop: 15, alignItems: 'center'}}>
                                    <Title style={styles.title}>{profile.username}</Title>
                                    <Caption style={styles.caption}>{profile.phone_number}</Caption>
                                </View>
                            </View>
                        </TouchableRipple>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="cash-multiple"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="My Contributions"
                            labelStyle={{fontWeight: 'bold', fontSize: 16}}
                            onPress={() => {props.navigation.navigate('Details')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="magnify"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Search"
                            labelStyle={{fontWeight: 'bold', fontSize: 16}}
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Profile"
                            labelStyle={{fontWeight: 'bold', fontSize: 16}}
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-check-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Support"
                            labelStyle={{fontWeight: 'bold', fontSize: 16}}
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        { userToken.role === "admin" || userToken.role === "superadmin"
                        ?
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name="account-lock-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Admin Panel"
                            labelStyle={{fontWeight: 'bold', fontSize: 16}}
                            onPress={() => {props.navigation.navigate('Admin')}}
                        />
                        : null }
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text style={{fontSize: 16}}>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    title: {
        fontSize: 18,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 16,
        lineHeight: 20
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    },
});