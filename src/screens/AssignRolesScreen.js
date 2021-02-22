import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Picker, StatusBar, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native'
import { color } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import DynastyAppApi from '../../api/DynastyAppApi';
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
    const [members, setMembers] = useState([]);
    const [isLoading, setLoading] = useState(true);
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

    return (
        <View contentContainerStyle={{ flex: 1, paddingBottom: 0 }}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column',alignItems: 'center', padding: 10, paddingTop: 60 }}>
                <ActivityIndicator size="large" color="#00ff00" />
                <Text style={{ color: colors.caption, ...FONTS.h2, marginVertical: 20 }}>Loading Member Roles...</Text>
                </View>
            ) : (
            <View>
                <View style={{ paddingHorizontal: 0, marginTop: 0, marginBottom: 20, backgroundColor: colors.background }}>
                    <FlatList
                        data={members}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(member) => member.member_id}
                        onRefresh={() => fetchData()}
                        refreshing={isLoading}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={{
                                    flex: 1/2,
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    margin: 5,
                                    paddingVertical: SIZES.radius,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: 5,
                                    backgroundColor: colors.background,
                                    ...styles.shadow
                                }}
                                onPress={() => props.navigation.navigate('RoleSelector', {item})}
                            >
                                
                                <View style={{ marginLeft: 0, flexDirection: 'column', flex: 1, alignItems: 'center' }}>
                                    <View>
                                        <Image 
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 25,
                                                marginRight: SIZES.base,
                                                marginLeft: 0
                                            }}
                                            source={{uri: item.image_url}}
                                        /> 
                                    </View>
                                    <View style={{ marginLeft: 0, flexDirection: 'column', justifyContent: 'space-between', flex: 1 , backgroundColor: colors.background }}>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 3 }}>
                                            <View>
                                                <Text style={{ marginLeft: SIZES.base, color: colors.text, ...FONTS.h3, flexDirection: 'row' }}>{item.username}
                                                { item.role === 'admin'
                                                ? <Icon name={'check-decagram'} size={16} color={'lightblue'} style={{marginRight:30}}/>
                                                : item.role === 'superadmin'
                                                ? <Icon name={'shield-check'} size={16} color={'blue'} style={{marginRight:30}}/>
                                                : null }
                                                </Text>
                                            </View>
                                            <Icon 
                                            name="chevron-right"
                                            color= {colors.caption}
                                            size={25}
                                        />
                                            {/* <View>
                                                <Text style={{ color: colors.text, ...FONTS.body3 }} >{item.role}</Text>
                                            </View> */}
                                            {/* <View>
                                                <Text style={{ color: COLORS.primary, ...FONTS.body4 }} >{format(new Date(item.time_date), "MMM dd, yyyy")}</Text>
                                            </View> */}
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                                            <Text style={{ marginLeft: SIZES.base, color: colors.caption, ...FONTS.body3 }}>{item.phone_number}</Text>
                                        </View>
                                        
                                    </View>
                                    
                                </View>
                                
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
            )}
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
    }
    });

  export default AssignRolesScreen;