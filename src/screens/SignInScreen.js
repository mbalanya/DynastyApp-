import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, Platform, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';

import { AuthContext } from '../components/context';

import Users from '../model/users';

const SignInScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [adminIsLoading, setAdminIsLoading] = useState(false);
  const [superAdminIsLoading, setSuperAdminIsLoading] = useState(false);

  const { colors } = useTheme();

  const { signIn } = React.useContext(AuthContext);
  const { adminSignIn } = React.useContext(AuthContext);
  const { superAdminSignIn } = React.useContext(AuthContext);

  const check_textInputChange = (val) => {
    setIsLoading(false);
    setAdminIsLoading(false);
    setSuperAdminIsLoading(false)
    if( val.length >= 10 ) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false
      })
    }
  }

  const handlePasswordChange = (val) => {
    setIsLoading(false);
    setAdminIsLoading(false);
    setSuperAdminIsLoading(false)
    if( val.length >= 4 ) {
      setData({
        ...data,
        password: val,
        isValidPassword: true
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false
      });
    }
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

  const handleValidUser = (val) => {
    if( val.trim().length >= 10 ) {
      setData({
        ...data,
        isValidUser: true
      })
    } else {
      setData({
        ...data,
        isValidUser: false
      })
    }
  }

  const loginHandle = (userName, password) => {
    setIsLoading(true);
    const foundUser = {}
    foundUser["phone_number"] = userName.replace(/\s/g, '');
    foundUser["password"] = password;

    if( data.username.length == 0 || data.password.length == 0 ){
      setIsLoading(false);
      Alert.alert('Invalid Input', 'Username or Password cannot be empty!', [
        {text: 'Okay'}
      ]);
      return;
    }
    signIn(foundUser);
  }

  const adminLoginHandle = (userName, password) => {
    setAdminIsLoading(true);
    const foundUser = {}
    foundUser["phone_number"] = userName;
    foundUser["password"] = password;

    if( data.username.length == 0 || data.password.length == 0 ){
      setAdminIsLoading(false);
      Alert.alert('Invalid Input', 'Username or Password cannot be empty!', [
        {text: 'Okay'}
      ]);
      return;
    }
    adminSignIn(foundUser);
  }

  const superAdminLoginHandle = (userName, password) => {
    setSuperAdminIsLoading(true);
    const foundUser = {}
    foundUser["phone_number"] = userName;
    foundUser["password"] = password;

    if( data.username.length == 0 || data.password.length == 0 ){
      setSuperAdminIsLoading(false);
      Alert.alert('Invalid Input', 'Username or Password cannot be empty!', [
        {text: 'Okay'}
      ]);
      return;
    }
    superAdminSignIn(foundUser);
  }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#009387' barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
          animation="fadeInUpBig"
          style={[styles.footer, {
            backgroundColor: colors.background
          }]}
        >
          <Text style={[styles.text_footer, {
            color: colors.text
          }]}>Phone Number</Text>
          <View style={styles.action}>
            <Icon 
                name="account-outline"
                color={colors.text}
                size={20}
            />
            <TextInput 
              placeholder="Your Phone Number (07********)"
              style={[styles.textInput, {
                color: colors.text
              }]}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='number-pad'
              onChangeText={(val) => check_textInputChange(val)}
              onEndEditing={(el) => handleValidUser(el.nativeEvent.text)}
            />
            {data.check_textInputChange ? 
            <Animatable.View
              animation="bounceIn"
            >
              <Icon 
                name="checkbox-marked-circle-outline"
                color='green'
                size={20}
              />
            </Animatable.View>
            : null}
          </View>
        
          { data.isValidUser ? null :
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={{ color: 'darkred', fontWeight: 'bold' }}>Phone Number must be 10 characters long</Text>
          </Animatable.View>
          }

          <Text style={[styles.text_footer, {
            color: colors.text,
            marginTop: 35
          }]}>Password</Text>
          <View style={styles.action}>
            <Icon 
                name="lock-outline"
                color={colors.text}
                size={20}
            />
            <TextInput 
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={[styles.textInput, {
                color: colors.text
              }]}
              autoCapitalize="none"
              keyboardType='number-pad'
              autoCorrect={false}
              onChangeText={(val) => handlePasswordChange(val)}

            />
            <TouchableOpacity
              onPress={updateSecureTextEntry}
            >
              {data.secureTextEntry ?
              <Icon 
                  name="eye-off-outline"
                  color='green'
                  size={20}
              />
              :
              <Icon 
                  name="eye-outline"
                  color='green'
                  size={20}
              />
              }
            </TouchableOpacity>
          </View>

          { data.isValidPassword ? null :
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={{ color: 'darkred', fontWeight: 'bold' }}>Password must be 4 characters long</Text>
          </Animatable.View>
          }

          <TouchableOpacity>
            <Text style={{color: '#009387', marginTop: 15}}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.button}>
            <TouchableOpacity
                style={styles.signIn}
                onPress={() => {loginHandle( data.username, data.password )}}
            >
              <LinearGradient
                colors={['#08d4c4', '#01ab9d']}
                style={styles.signIn}
              >
                {isLoading
                ? <ActivityIndicator size="large" color="#00ff00" />
                : 
                <Text style={[styles.textSign, {
                  color:'#fff'
                }]}>Sign In</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {adminLoginHandle( data.username, data.password )}}
                  style={[styles.adminSignIn, {
                    borderColor: '#009387',
                    borderWidth: 1,
                    marginTop: 40
                  }]}
                >
                  {adminIsLoading
                  ? <ActivityIndicator size="large" color="#00ff00" />
                  : 
                    <Text style={[styles.textSign, {
                      color: '#009387'
                    }]}>Admin</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {superAdminLoginHandle( data.username, data.password )}}
                  style={[styles.adminSignIn, {
                    borderColor: '#009387',
                    borderWidth: 1,
                    marginTop: 40
                  }]}
                >
                  {superAdminIsLoading
                  ? <ActivityIndicator size="large" color="#00ff00" />
                  : 
                    <Text style={[styles.textSign, {
                      color: '#009387'
                    }]}>Super Admin</Text>
                  }
              </TouchableOpacity>
              </View>
              
          </View>
        </Animatable.View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#009387',
    },
    header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50,
    },
    footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
    },
    text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
    },
    text_footer: {
      color: '#05375a',
      fontSize: 18,
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
    },
    button: {
      alignItems: 'center',
      marginTop: 50,
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    adminSignIn: {
      width: '45%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginHorizontal: 15,
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  });

  export default SignInScreen;