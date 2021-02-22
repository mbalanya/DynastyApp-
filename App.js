import 'react-native-gesture-handler';
import React, {useEffect, useState, useMemo} from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createDrawerNavigator, useIsDrawerOpen } from '@react-navigation/drawer';
import { AuthContext } from './src/components/context';
import AsyncStorage from '@react-native-community/async-storage';
import { 
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme, 
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';
import DynastyAppApi from './api/DynastyAppApi';

import MainTabScreen from './src/screens/MainTabScreen';
import { DrawerContent } from './src/screens/DrawerContent';
import RootStackScreen from './src/screens/RootStackScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  // const [userToken, setUserToken] = useState(null);
  

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
      caption: 'gray',
      title: 'black',
      danger: 'darkred'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
      caption: 'lightgray',
      title: 'white',
      danger: 'lightred'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    signIn: async (foundUser) => {
      // setUserToken('asdf');
      try {
        const response = await DynastyAppApi.post('/api/v1/users/login-user/', {
          ...foundUser
        })
        const responseData = response.data.data;
        let userToken = String(responseData.token);
        const userName = responseData.username;
        
        try {
          userToken = responseData.token; //to be gotten from api call
          await AsyncStorage.setItem('userToken', userToken)
        } catch (err) {
          console.log(err);
        }
        
        dispatch({ type: 'LOGIN', id: userName, token: userToken });
        setIsLoading(false);
        
      } catch (err) {
          console.log(err)
          setIsLoading(false);
          Alert.alert('Invalid User', 'Username or Password is incorrect!', [
            {text: 'Okay'}
          ]);
      }
    },
    adminSignIn: async (foundUser) => {
      // setUserToken('asdf');
      try {
        const response = await DynastyAppApi.post('/api/v1/users/login-admin/', {
          ...foundUser
        })
        const responseData = response.data.data;
        let userToken = String(responseData.token);
        const userName = responseData.username;
        
        try {
          userToken = responseData.token; //to be gotten from api call
          await AsyncStorage.setItem('userToken', userToken)
        } catch (err) {
          console.log(err);
        }
        
        dispatch({ type: 'LOGIN', id: userName, token: userToken });
        setIsLoading(false);
        
      } catch (err) {
          console.log(err)
          setIsLoading(false);
          Alert.alert('Invalid User', 'Username or Password is incorrect!', [
            {text: 'Okay'}
          ]);
      }
    },
    superAdminSignIn: async (foundUser) => {
      // setUserToken('asdf');
      try {
        const response = await DynastyAppApi.post('/api/v1/users/login-super-admin/', {
          ...foundUser
        })
        const responseData = response.data.data;
        let userToken = String(responseData.token);
        const userName = responseData.username;
        
        try {
          userToken = responseData.token; //to be gotten from api call
          await AsyncStorage.setItem('userToken', userToken)
        } catch (err) {
          console.log(err);
        }
        
        dispatch({ type: 'LOGIN', id: userName, token: userToken });
        setIsLoading(false);
        
      } catch (err) {
          console.log(err)
          setIsLoading(false);
          Alert.alert('Invalid User', 'Username or Password is incorrect!', [
            {text: 'Okay'}
          ]);
      }
    },
    signOut: async () => {
      // setUserToken(null);
      setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (err) {
        console.log(err);
      }
      dispatch({ type: 'LOGOUT' })
    },
    signUp: async (username, phoneNumber, password, confirm_password) => {
      if( username.length === 0 || password.length === 0 || phoneNumber.length === 0 ){
        setIsLoading(false);
        alert('Invalid Input', 'Username or Password cannot be empty!', [
          {text: 'Okay'}
        ]);
        return;
      }

      if( password != confirm_password ) {
        setIsLoading(false);
        alert('Pin does not match! Retry', [
          {text: 'Okay'}
        ]);
        return;
      }
      // setUserToken('asdf');
      let userToken = await AsyncStorage.getItem('userToken');
      try{
        const config = {
                headers: { 'Authorization': userToken }
            };

            const bodyParametersActive = {
            };
            
            const bodyParameters = {
                username: username,
                phone_number: phoneNumber,
                image_url: "https://res.cloudinary.com/dap0b3537/image/upload/v1613873683/jcqssre99dkfaaumqtpt.jpg",
                password: password
            };
          await DynastyAppApi.post(
              '/api/v1/users/register-user/', 
              bodyParameters,
          config
          ).then((function () {
            console.log('done')}))
          
          setIsLoading(false)
      } catch (err) {
          setIsLoading(false)
          console.log(err)
          alert("Something went wrong or User already exists! Retry")
      }
      setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    }
  }), []);

  useEffect(() => {
    setTimeout( async () => {
      setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (err) {
        console.log(err);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#009387" />
      </View>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          { loginState.userToken !== null ? (
            <Drawer.Navigator initialRouteName="Home" theme={theme} drawerContent={props => <DrawerContent {...props} />}>
            
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
            </Drawer.Navigator>
          ) :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}
export default App;