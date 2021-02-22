import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

import { AuthContext } from '../components/context';


const SignUpScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = React.useState({
    username: '',
    phoneNumber: '',
    password: '',
    confirm_password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true
  });

  const { signUp } = React.useContext(AuthContext);


  const check_textInputChange = (val) => {
    if( val.length !== 0 ) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false
      })
    }
  }

  const check_phoneInputChange = (val) => {
    if( val.length !== 0 ) {
      setData({
        ...data,
        phoneNumber: val,
        check_textInputChange: true
      });
    } else {
      setData({
        ...data,
        phoneNumber: val,
        check_textInputChange: false
      })
    }
  }

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val
    });
  }

  const handleConfirmPasswordChange = (val) => {
    setData({
      ...data,
      confirm_password: val
    });
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry
    })
  }

  const signupHandle = (username, phoneNumber, password, confirm_password) => {
    setIsLoading(true);
    
    signUp(username, phoneNumber, password, confirm_password);
    props.navigation.navigate('AllMembers')
    setIsLoading(false);
  }

    return (
      <View style={styles.container}>
        
        <StatusBar backgroundColor='#009387' barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Register Member!</Text>
        </View>
        <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
        >
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <Icon 
                name="account-outline"
                color='#05375a'
                size={20}
            />
            <TextInput 
              placeholder="Your Username"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(val) => check_textInputChange(val)}
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

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Phone Number</Text>
          <View style={styles.action}>
            <Icon 
                name="phone-outline"
                color='#05375a'
                size={20}
            />
            <TextInput 
              placeholder="07********"
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType='number-pad'
              autoCorrect={false}
              onChangeText={(val) => check_phoneInputChange(val)}
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

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Pin</Text>
          <View style={styles.action}>
            <Icon 
                name="lock-outline"
                color='#05375a'
                size={20}
            />
            <TextInput 
              placeholder="Your Pin"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
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

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Confirm Pin</Text>
          <View style={styles.action}>
            <Icon 
                name="lock-outline"
                color='#05375a'
                size={20}
            />
            <TextInput 
              placeholder="Confirm Your Pin"
              secureTextEntry={data.confirm_secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType='number-pad'
              autoCorrect={false}
              onChangeText={(val) => handleConfirmPasswordChange(val)}

            />
            <TouchableOpacity
              onPress={updateConfirmSecureTextEntry}
            >
              {data.confirm_secureTextEntry ?
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

          {/* <TouchableOpacity>
            <Text style={{color: '#009387', marginTop: 15}}>
              <Text>By signing up you agree to our </Text>
              <Text style={{fontWeight: "bold"}}>Terms of service </Text>
              <Text>and </Text>
              <Text style={{fontWeight: "bold"}}>Privacy policy.</Text>
            </Text>
          </TouchableOpacity> */}

          <View style={styles.button}>
            <TouchableOpacity
                style={styles.signIn}
                onPress={() => {signupHandle( data.username, data.phoneNumber, data.password, data.confirm_password )}}
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
                }]}>Sign Up</Text>
              }
              </LinearGradient>
            </TouchableOpacity>
              
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={[styles.signIn, {
                  borderColor: '#009387',
                  borderWidth: 1,
                  marginTop: 15
                }]}
              >
                <Text style={[styles.textSign, {
                  color: '#009387'
                }]}>Sign In</Text>
              </TouchableOpacity> */}
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
    textSign: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  });

  export default SignUpScreen;