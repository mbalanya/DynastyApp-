import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, StatusBar, TouchableOpacity, SafeAreaView, ActivityIndicator, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native'
import { color } from 'react-native-reanimated';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HomeScreen = (props) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            //console.log(`Token inside try: ${userToken}`);
            //return userToken = userToken;

            try {
                //console.log(`Token inside try1: ${userToken}`);
                const response = await DynastyAppApi.get('/api/v1/events/', {
                    headers: {'Authorization': userToken}
                })
                //console.log(response.data.data.events);
                setEvents(response.data.data.events);
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
        return unsubscribe
    }, [events.length, props.navigation]);

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

    // configure flatlist animation
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor= "#009387" barStyle= "light-content" />
            {isLoading ? (
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column',alignItems: 'center', padding: 10, backgroundColor: colors.background }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                            <Text style={{ color: colors.text, ...FONTS.h3 }}>Loading All Events...</Text>
                          </View>
                ) : (
            <View style={{ paddingHorizontal:SIZES.padding, paddingVertical: SIZES.base, backgroundColor: colors.background }}>
                <View 
                    style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 15,
                        paddingHorizontal: SIZES.padding,
                        backgroundColor: colors.background,
                        ...styles.shadow
                }}>
                    <View>
                        <Text style={{ color: colors.title, ...FONTS.h2 }}>All Events</Text>
                        <Text style={{ color: colors.caption, ...FONTS.h3 }} >All Members</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 50, width: 50, backgroundColor: colors.background, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <Image 
                                source={icons.calendar}
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.lightBlue
                                }}
                            />
                        </View>
                        <View>
                            <Text style={{ color: colors.text, ...FONTS.h3 }} >To Date...</Text>
                        </View>
                    </View>
                </View> 

                {errorMessage ? <Text>{errorMessage}</Text> : null}

                {isLoading ? <ActivityIndicator /> : 
                <SafeAreaView contentContainerStyle={{ paddingBottom: 0 }}>
                    {
                        <View>
                            <View style={{ paddingBottom: 150, marginTop: 0, marginBottom: 0, backgroundColor: colors.background }}>
                                <View>
                                <AnimatedFlatList
                                    numColumns={1}
                                    data={events}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(event) => event.event_id}
                                    onRefresh={() => fetchData()}
                                    refreshing={isLoading}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',
                                                marginVertical: 5,
                                                marginHorizontal: 1,
                                                paddingVertical: SIZES.base,
                                                paddingHorizontal: SIZES.radius,
                                                borderRadius: 5,
                                                backgroundColor: colors.background,
                                                ...styles.shadow
                                            }}
                                            onPress={() => props.navigation.navigate('EventDetails', {item})}
                                        >
                                            
                                            <View style={{ marginLeft: 0, flexDirection: 'row', flex: 1 }}>
                                                
                                                <Icon 
                                                    name={'cash-marker'}   
                                                    size={30} color={'gray'} 
                                                    style={{
                                                        marginRight:30,
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 25,
                                                        marginRight:0,
                                                        marginLeft: 0
                                                    }}
                                                />
                                                <View style={{ marginLeft: 0, flexDirection: 'column', justifyContent: 'space-between', flex: 1 , backgroundColor: colors.background }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                                        <View>
                                                            <Text style={{ marginLeft: SIZES.base, color: colors.text, ...FONTS.h3 }}>{item.event_name}</Text>
                                                        </View>
                                                        <View>
                                                            { item.active ? 
                                                            <Text style={{ color: colors.text, ...FONTS.h3 }} >Active</Text>
                                                            : <Text style={{ color: colors.text, ...FONTS.body4 }} >{format(new Date(item.created_on), "MMM dd, yyyy")}</Text>
                                                             }
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                                                        <Text style={{ marginLeft: SIZES.base, color: colors.caption, ...FONTS.body3 }}>{item.contribution_reason.substring(0, 30) + '...'}</Text>
                                                    </View>
                                                    <View>
                                                    </View>
                                                </View>
                                                <Icon 
                                                    name="chevron-right"
                                                    color= {colors.caption}
                                                    size={30}
                                                />
                                            </View>
                                            
                                        </TouchableOpacity>
                                    )}
                                />
                                {/* <TouchableOpacity onPress={() => alert('FAB clicked')} style={styles.fab}>
                                    <Text style={styles.fabIcon}>+</Text>
                                </TouchableOpacity> */}
                                </View>
                            </View>
                        </View>
                    }
                    
                </SafeAreaView>
                }
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
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#03A9F4',
        borderRadius: 30,
        elevation: 8
      },
      fabIcon: {
        fontSize: 40,
        color: 'white'
      }
    });


  export default HomeScreen;