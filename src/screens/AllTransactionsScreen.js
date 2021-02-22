import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Animated, StatusBar, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
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

const AllTransactionsScreen = (props) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');

            try {
                const response = await DynastyAppApi.get('/api/v1/transactions/', {
                    headers: {'Authorization': userToken}
                })
                //console.log(response.data.data.transactions);
                setTransactions(response.data.data.transactions);
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
    }, [transactions.length, props.navigation]);

    const currencyFormat = (num) => {
        return 'Ksh.' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

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
                <Text style={{ color: colors.caption, ...FONTS.h2, marginVertical: 20 }}>Loading Transactions...</Text>
                </View>
            ) : (
            <View>
                <View style={{ paddingHorizontal: 0, marginTop: 0, marginBottom: 20, backgroundColor: colors.background }}>
                    <FlatList
                        data={transactions}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(transaction) => transaction.transaction_id}
                        onRefresh={() => fetchData()}
                        refreshing={isLoading}
                        renderItem={({item}) => (
                            <View
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
                            >
                                
                                <View style={{ marginLeft: 0, flexDirection: 'row', flex: 1 }}>
                                    <View>
                                        <Image 
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 25,
                                                marginRight: SIZES.base,
                                                marginLeft: 0
                                            }}
                                            source={{uri: item.image_url}}
                                        /> 
                                    </View>
                                    <View style={{ marginLeft: 0, flexDirection: 'column', justifyContent: 'space-between', flex: 1 , backgroundColor: colors.background }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                            <View>
                                                <Text style={{ marginLeft: SIZES.base, color: colors.text, ...FONTS.h3 }}>{item.username}
                                                { item.role === 'admin'
                                                ? <Icon name={'check-decagram'} size={16} color={'#008fff'} style={{marginRight:30}}/>
                                                : item.role === 'superadmin'
                                                ? <Icon name={'shield-check'} size={16} color={'blue'} style={{marginRight:30}}/>
                                                : null }
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: colors.text, ...FONTS.body4 }} >{format(new Date(item.time_date), "MMM dd, yyyy")}</Text>
                                            </View> 
                                        </View>
                                        <View style={{ flexDirection: 'column'}} >
                                            <Text style={{ marginLeft: SIZES.base, color: colors.caption, ...FONTS.body3 }}>{currencyFormat(item.amount)} - ({item.transaction_id})</Text>
                                            <Text style={{ marginLeft: SIZES.base, color: colors.caption, ...FONTS.body3 }}>Event: {item.event_name}</Text>
                                        </View>
                                    </View>
                                </View>
                                
                            </View>
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


  export default AllTransactionsScreen;