import React, { useState, useEffect } from 'react';
import { StyleSheet, Linking, Text, View, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import DynastyAppApi from '../../api/DynastyAppApi';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as WebBrowser from 'expo-web-browser';
import * as ImagePicker from 'expo-image-picker';

import { DrawerContent } from './DrawerContent';



const ProfileScreen = () => {
    const [profile, setProfile] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [capturedImage, setCapturedImage] = React.useState('');

    const fetchData = async () => {
      try {
        let userToken = await AsyncStorage.getItem('userToken');

        try {
          const response = await DynastyAppApi.get('/api/v1/memberProfile', {
            headers: {'Authorization': userToken}
        })
          setProfile(response.data.data.member[0]);
          setLoading(false);
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
        return () => { unmounted = true };
    }, [profile.length]);

    const { colors } = useTheme();

    const openBrowser = () => {
      WebBrowser.openBrowserAsync('https://mbalanya.com');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted') {
          alert('Camera Roll does not have permissions');
        }
        let photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
    
        if(!photo.cancelled) {
            setCapturedImage(photo.uri);
            //console.log(photo)
            let newFile = { 
              uri:photo.uri,
              type:`test/${photo.uri.split(".")[3]}`,
              name:`test/${photo.uri.split(".")[2]}`}

            uploadImage(newFile);
        }
    }

    const uploadImage = async (image) => {
      setErrorMessage('');

        setLoading(true);
        console.log(image)
        try {
          const data = new FormData()
          data.append('file', image)
          data.append('upload_preset', 'dynastyApp')
          data.append("cloud_name", "dap0b3537")
        
          await fetch("https://api.cloudinary.com/v1_1/dap0b3537/image/upload",{
              method:"post",
              body:data
          }).then(res=>res.json())
          .then(data=>{
              savePostData(data.secure_url)
              console.log(`data: ${data}`)
          })
        } catch(err) {
            setLoading(false);
            console.log(err)
            alert('Error uploading, retry!');
        }
    };

    const savePostData = async (downloadURL) => {
      let userToken = await AsyncStorage.getItem('userToken');
      
      try {
        const config = {
            headers: { 'Authorization': userToken }
        };
        
        const bodyParameters = {
          image_url: downloadURL
        };
        
        try {
          const response = await DynastyAppApi.put(
            '/api/v1/image_url',
            bodyParameters,
            config
          )
          console.log(response.data.data.image[0])
          setProfile(response.data.data.image[0])
            //DrawerContent
            setLoading(false);
          
        } catch (err) {
          setLoading(false);
            console.log(err)
            alert('Error saving, retry!');

        }
      } catch (err) {
        setLoading(false);
        console.log(err);
        alert('Error doing this opertaion, retry!');

      }
    }

    return (
      <View style={[styles.container, {
        backgroundColor: colors.background
      }]}>
        <StatusBar backgroundColor= "#009387" barStyle= "light-content" />
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column',alignItems: 'center', padding: 10, backgroundColor: colors.background }}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={{ color: colors.text, ...FONTS.h3 }}>Loading Your Profile...</Text>
          </View>
        ) : (
        <View style={styles.container}>
          <View style={[styles.header,{
            backgroundColor: colors.background
          }]}>
              <View
                  style={{ 
                      borderBottomColor: '#009387',
                      borderBottomWidth: 1,
                      backgroundColor: colors.background
                  }}
              >
                  <View
                      style={{ 
                          marginTop: 50,
                          marginBottom: 20,
                          alignItems: 'center',
                      }}
                  >
                      <Image 
                          style={{
                              width: 200,
                              height: 200,
                              borderRadius: 100,
                              marginVertical: 15,
                              marginLeft: 0
                          }}
                          source={{
                              uri: profile.image_url
                          }}
                      />
                      <TouchableOpacity
                          onPress={() => pickImage()}
                          style={{ alignItems: 'center'}}
                      >
                          <MaterialCommunityIcons name="image-edit-outline" size={28} color={colors.text} />
                          <Text style={[styles.caption, {color: colors.caption, marginTop: 5}]}>change photo</Text>
                      </TouchableOpacity>
                  </View>
                  
              </View>
              <View style={{ flexDirection: 'column', margin:20, backgroundColor: colors.background, alignItems: 'center' }}>
                  
                  <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <Text style={[styles.title, {color: colors.text}]}>Profile Details:</Text>
                      {/* <TouchableOpacity
                          onPress={() => {}}
                      >
                          <View style={{margin: 0, paddingHorizontal: 10, alignSelf: 'center'}}>
                              <MaterialCommunityIcons name="account-edit-outline" size={24} color={colors.text} />
                          </View>
                      </TouchableOpacity> */}
                  </View>
                  <View style={{ margin: 0, paddingHorizontal: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons name="account-outline" size={24} color={colors.text} />
                      <Text style={[styles.caption, {color: colors.caption, marginLeft: 10}]}>{profile.username}</Text>
                  </View>
                  <View style={{ margin: 0, paddingHorizontal: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons name="phone-outline" size={24} color={colors.text} />
                      <Text style={[styles.caption, {color: colors.caption, marginLeft: 10}]}>{profile.phone_number}</Text>
                  </View>
              </View>
          </View>
          <Animatable.View 
              style={[styles.footer, {
              }]}
              animation="fadeInUpBig"
            >
              <Text style={styles.title}>Support Mbalanya Dynasty Developers!</Text>
              <Text style={styles.text}>We accept donations!</Text>
              <Text style={styles.caption}>M-Pesa: 0725267275</Text>
              <View style={styles.button}>
                <TouchableOpacity onPress={openBrowser}>
                  <LinearGradient
                    colors={['#08d4c4', '#01ab9d']}
                    style={styles.signIn}
                  >
                    <Text style={styles.textSign}>mbalanya.com</Text>
                    <Icon 
                        name="chevron-right"
                        color='#fff'
                        size={20}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flex: 3,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center'
    },
    footer: {
      flex: 1,
      backgroundColor: '#009387',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30,
    },
    title: {
        color: 'white',
        fontSize: 20,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        color: 'white',
        fontSize: 18,
        lineHeight: 20,
        marginVertical: 15
    },
    text: {
      color: 'white',
      fontSize:15,
      marginTop: 5,
    },
    button: {
      alignItems: 'flex-end',
      marginTop: 30,
    },
    signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row',
    },
    textSign: {
      color: 'white',
      fontWeight: 'bold',
      fontSize:16,
    }
  });

  export default ProfileScreen;