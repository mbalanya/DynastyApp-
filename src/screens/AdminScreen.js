import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, CheckBox, StatusBar, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
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
import { useTheme } from '@react-navigation/native'
import DynastyAppApi from '../../api/DynastyAppApi';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import { color } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const AdminScreen = (props) => {
    const [eventName, setEventName] = useState("");
    const [contributionReason, setContributionReason] = useState("");
    const [checkActive, setCheckActive] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isActive, setiSActive] = useState(false);
    const [userToken, setUserToken] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

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

    const newEvent = async () => {
        setLoading(true)
        let userToken = await AsyncStorage.getItem('userToken');

        try {
            const config = {
                headers: { 'Authorization': userToken }
            };

            const bodyParametersActive = {
            };
            
            const bodyParameters = {
                event_name: eventName,
                contribution_reason: contributionReason,
                active: isActive
            };
            try {
                const response = await DynastyAppApi.get('/api/v1/activeevents/', {
                    headers: {'Authorization': userToken}
                })
                    console.log(response.data.data.events)
                if(response.data.data.events.length !== 0) {
                    setLoading(false)
                    alert('You already have an active Event, Deactivate it and retry!')
                    return;
                }
                
              } catch (err) {
                  console.log(err)
                  alert('error here')
              }
            try{
                await DynastyAppApi.post(
                    '/api/v1/events/new/', 
                    bodyParameters,
                config
                ).then((function () {
                    props.navigation.popToTop()}))
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.log(err)
                alert("Something went wrong or Event already exists! Retry")
            }
          } catch (err) {
              console.log(err)
              alert("Something went wrong or Event already exists! Retry")
          }
    };
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

    return (
        <View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column',alignItems: 'center', padding: 10 }}>
                <ActivityIndicator size="large" color="#00ff00" />
                <Text style={{ color: colors.caption, ...FONTS.h2 }}>Loading Admin Panel...</Text>
                </View>
            ) : (
            <View>
            <View style={{ alignItems: 'center', marginTop: SIZES.base, flexDirection: 'row', marginHorizontal: SIZES.base }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        margin: 15,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding,
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        ...styles.shadow
                    }}
                    onPress={() => props.navigation.navigate('AllMembers')}
                >
                    <Text style={{ color: colors.text, ...FONTS.h3 }}>Members</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        margin: 15,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding,
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        ...styles.shadow
                    }}
                    onPress={() => props.navigation.navigate('AllTransactions')}
                >
                    <Text style={{ color: colors.text, ...FONTS.h3 }}>Transactions</Text>
                </TouchableOpacity>
            </View>

            { userToken.role === "superadmin"
            ? <View style={{ alignItems: 'center', marginTop: SIZES.base, flexDirection: 'row', marginHorizontal: SIZES.base }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        margin: 15,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding,
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        ...styles.shadow
                    }}
                    onPress={() => props.navigation.navigate('Logs')}
                >
                    <Text style={{ color: colors.text, ...FONTS.h3 }}>Users Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        margin: 15,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding,
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        ...styles.shadow
                    }}
                    onPress={() => props.navigation.navigate('AssignRoles')}
                >
                    <Text style={{ color: colors.text, ...FONTS.h3 }}>Member Roles</Text>
                </TouchableOpacity>
            </View>
            : null }

            <View style={{ paddingHorizontal:SIZES.padding, paddingVertical: SIZES.padding, marginTop: SIZES.padding, backgroundColor: colors.background }}>
                <View 
                    style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: SIZES.padding,
                        backgroundColor: colors.background,
                        ...styles.shadow
                }}>
                    <View>
                        <Text style={{ color: colors.text, ...FONTS.h2 }}>Add a new Event</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 50, width: 50, backgroundColor: colors.background, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <Image 
                                source={icons.calendar}
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: colors.caption
                                }}
                            />
                        </View>
                        <View>
                            <Text style={{ color: colors.caption, ...FONTS.h3 }} >Today...</Text>
                        </View>
                    </View>
                </View>

                <TextInput 
                    style={{
                        flexWrap: 'wrap',
                        margin: 5,
                        borderBottomColor: COLORS.black,
                        borderBottomWidth: 1,
                        paddingVertical: SIZES.radius,
                        paddingHorizontal: SIZES.padding,
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        color: colors.text,
                        fontSize: 18,
                        ...styles.shadow
                    }}
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    placeholder="Event Name..."
                    placeholderTextColor= {colors.caption}
                    onChangeText={(eventName) => setEventName(eventName)}
                />

                <TextInput 
                    style={{
                        flexWrap: 'wrap',
                        margin: 5,
                        borderBottomColor: COLORS.black,
                        borderBottomWidth: 1,
                        paddingVertical: SIZES.radius,
                        paddingHorizontal: SIZES.padding,
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        color: colors.text,
                        fontSize: 18,
                        ...styles.shadow
                    }}
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    placeholder="Event Description..."
                    placeholderTextColor= {colors.caption}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(contributionReason) => setContributionReason(contributionReason)}
                />
                
                <View style={styles.containerCheckBox}>
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                        value={isActive}
                        onValueChange={setiSActive}
                        style={[styles.checkbox, { color: colors.text }]}
                        />
                        <Text style={[styles.label, { color: colors.text }]}> {isActive ? "Event is Active👍" : "Event is NOT Active 👎"}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => newEvent()} 
                    underlayColor='#fff'>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>
            </View>
            )}
            </ScrollView>
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
        shadowRadius: 3.84,
        elevation: 3,
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
        height: 100,
        width: 100,
        paddingRight: SIZES.padding,
        paddingLeft: SIZES.padding,
        marginRight: SIZES.padding,
        marginLeft: SIZES.padding,
        marginTop: SIZES.radius,
        borderRadius: SIZES.radius,
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
    containerCheckBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
      },
      checkbox: {
        alignSelf: "center",
      },
      label: {
        margin: 8,
        fontSize: 16,
      },
})

export default AdminScreen;
