import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Picker, StatusBar, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native'
import { color } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import DynastyAppApi from '../../api/DynastyAppApi';
import RadioButtonRN from 'radio-buttons-react-native';
import { format } from "date-fns";
import {
    useFonts,
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';
import { COLORS, FONTS, SIZES, icons } from '../../constants';

const AssignRolesScreen = (props) => {
    const currentUser = props.route.params.item
    const [members, setMembers] = useState([]);
    const [checked, setChecked] = useState(currentUser.role);
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');

            try {
                const response = await DynastyAppApi.get('/api/v1/members/', {
                    headers: {'Authorization': userToken}
                })
                //console.log(response.data.data.members);
                setMembers(response.data.data.members);
                setLoading(false);
              } catch (err) {
                  console.log(err)
              }
          } catch (err) {
            console.log(err);
          }
    }

    const saveRole = async (role, userId) => {
        setLoading(true)
        let userToken = await AsyncStorage.getItem('userToken');
      
      try {
        const config = {
            headers: { 'Authorization': userToken }
        };
        
        const bodyParameters = {
          role: role
        };
        
        try {
          const response = await DynastyAppApi.put(
            `/api/v1/members/${userId}/role`,
            bodyParameters,
            config
          )
          console.log(response.data.data.role[0])
          setChecked(response.data.data.role[0])
            //DrawerContent
            props.navigation.goBack()
            setLoading(false);
          
        } catch (err) {
          setLoading(false);
            console.log(err)
            alert('Error setting role, retry!');

        }
      } catch (err) {
        setLoading(false);
        console.log(err);
        alert('Error doing this opertaion, retry!');

      }
    }

    useEffect(() => {
        let unmounted = false;
          const unsubscribe = props.navigation.addListener('focus', () => {
              fetchData();
  
            });
          return unsubscribe;
      }, [members.length, props.navigation]);

    const { colors } = useTheme();

    const theme = useTheme();

    let [fontsLoaded, error] = useFonts({
        Roboto_100Thin,
        Roboto_100Thin_Italic,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_700Bold_Italic,
        Roboto_900Black,
        Roboto_900Black_Italic,
    })

    if (!fontsLoaded) {
        return (
            <Text>Loading...</Text>
        )
    }

    const radioColors = [
        {
            label: 'User',
            accessibilityLabel: 'user'
        },
        {
            label: 'Admin',
            accessibilityLabel: 'admin'
        },
        {
            label: 'Super Admin',
            accessibilityLabel: 'superadmin'
        }
    ];

    const initialVal = (val) => {
        if (val === 'user') {
            return 1
        } else if (val === 'admin') {
            return 2
        } else if (val === 'superadmin') {
            return 3
        } else {
            return -1
        }
    }

    console.log(`check ${checked.accessibilityLabel}`)
    console.log(`checkInit ${initialVal(currentUser.role)}`)

    return (
        <View contentContainerStyle={{ flex: 3, paddingBottom: 0 }}>
            <View>
            <View 
                style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.padding,
                    paddingVertical: SIZES.padding,
                    backgroundColor: colors.background,
                    ...styles.shadow
            }}>
                <View>
                    <Text style={{ color: colors.text, ...FONTS.h2 }}>{currentUser.username}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: colors.caption, ...FONTS.h3 }} >{currentUser.role}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginVertical: 20 }}>
            <RadioButtonRN
                data={radioColors}
                initial={initialVal(currentUser.role)}
                selectedBtn={(e) => setChecked(e)}
                circleSize={18}
                textColor={'black'}
                icon={
                    <Icon
                        name="check-circle"
                        size={25}
                        color="#2c9dd1"
                    />
                }
                
            />
            </View>
            <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => saveRole(checked.accessibilityLabel, currentUser.member_id)} 
                    underlayColor='#fff'>
                    { isLoading 
                    ? <ActivityIndicator size="small" color="#00ff00" />
                    : <Text style={styles.saveText}>Save</Text>
                    }
            </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        elevation: 2,
    },
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3,
        margin: 3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    saveButton:{
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#1E6738',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 18,
    },
    saveText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    },
    });

  export default AssignRolesScreen;