import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, TextInput, Clipboard, StatusBar, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import DynastyAppApi from '../../api/DynastyAppApi';
import { format, isMatch } from "date-fns";
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
import matchAll from 'string.prototype.matchall';

const DetailsScreen = (props) => {
    const [contributions, setContributions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [canContribute, setCanContribute] = useState(false);
    //const [copiedText, setCopiedText] = useState('')
    const [timeDate, setTimeDate] = useState('')
    const [amount, setAmount] = useState('')
    const [eventName, setEventName] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [mpesaMessage, setMpesaMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            let userToken = await AsyncStorage.getItem('userToken');

            try {
            const response = await DynastyAppApi.get('/api/v1/transactionsPerMember', {
                headers: {'Authorization': userToken}
            })
            setContributions(response.data.data.transactions);
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
        const unsubscribe = props.navigation.addListener('focus', () => {
            fetchData();
          });
        return unsubscribe
    }, [contributions.length, props.navigation]);

    /* const fetchCopiedText = async () => {
        const text = await Clipboard.getString()
        setCopiedText(text)
      } */
    
    const transactionSequence = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        
        try {
            const response = await DynastyAppApi.get('/api/v1/activeevents/', {
                headers: {'Authorization': userToken}
            })
                console.log(response.data.data.events[0])
            if(response.data.data.events.length !== 1) {
                setLoading(false)
                setCanContribute(false)
                console.log('Contact Admin to activate an event!')
                setModalVisible(true)
                return;
            }
            setCanContribute(true);
            setEventName(response.data.data.events[0].event_name)
            setModalVisible(true)
          } catch (err) {
              console.log(err)
              alert('error here')
          }
    }

    const newTransaction = async (mpesaMessage) => {
        console.log('working')
        //console.log(mpesaMessage)
        const transactionCode = mpesaMessage.split(" ")[0];
        //console.log(transactionCode)
        const transactionAmountwithKsh = mpesaMessage.split(" ")[2];
        const transactionAmountwith00 = transactionAmountwithKsh.replace("Ksh", '');
        const transactionAmount = transactionAmountwith00.replace(".00", '');
        //console.log(transactionAmount)
        
        const regexp = /\d{1,2}\/\d{1,2}\/\d{2,4}/g;
        const array = [... matchAll(mpesaMessage, regexp)];
        const dateWithDash = array[0][0].replace(/[/]/g, '-');
        const datewithFullYear = dateWithDash.substring(0, (dateWithDash.length-2)) + "20" + dateWithDash.substring((dateWithDash.length-2), dateWithDash.length)
        var [mm, dd, yyyy] = datewithFullYear.split("-");
        const dateRearranged = `${yyyy}-${dd}-${mm}`;

        const regext = /\d{1,2}\:\d{1,2}\s{1}/g;
        const array2 = [... matchAll(mpesaMessage, regext)];
        const spacedTime = array2[0][0] + ':00';
        const time = spacedTime.replace(/\s/g, '')

        const dateAndTime = dateRearranged + ' ' + time

        setLoading(true)
            
                let userToken = await AsyncStorage.getItem('userToken');

                const bodyParameters =
                {
                    transaction_id: transactionCode,
                    event_name: eventName,
                    amount: transactionAmount,
                    time_date: dateAndTime
                };
                //console.log(`config2:${headers}`)
            try{
                await DynastyAppApi.post('/api/v1//transactions/new/',
                bodyParameters,    
                {headers: {'Authorization': userToken},
                })
                setLoading(false)
                setModalVisible(!modalVisible)
                fetchData();
            } catch (err) {
                setLoading(false)
                console.log(err)
                alert("Something went wrong or Transaction already exists! Retry")
            }
    };

    const { colors } = useTheme();

    var contributionsSum = contributions.reduce(function(prev, curr) {
        return prev + curr.amount;
    }, 0);

    const currencyFormat = (num) => {
        return 'Ksh.' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

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
    //console.log(contributions)

    return (
      <View style={{ flex: 1, backgroundColor: colors.background, marginBottom: 0 }}>
            {isLoading ? (
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column',alignItems: 'center', padding: 10, backgroundColor: colors.background }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                            <Text style={{ color: colors.title, ...FONTS.h3 }}>Loading your Contributions...</Text>
                          </View>
                ) : (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ 
                    paddingHorizontal:SIZES.padding, 
                    paddingVertical: SIZES.base, 
                    backgroundColor: colors.background 
                }}
            >
                <View 
                    style={{ 
                        flexDirection: 'column', 
                        paddingHorizontal: 0,
                        paddingVertical: SIZES.padding,
                        backgroundColor: colors.background,
                        ...styles.shadow
                }}>
                  <View>    
                    <View
                        style={{
                            borderBottomColor: 'lightgray', 
                            borderBottomWidth: 3,
                        }}
                    >
                    <Text style={{ color: colors.title, ...FONTS.h2 }}>My Contributions Summary:</Text>
                        <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5, paddingTop: 10, }} >My Total Contributions: {currencyFormat(contributionsSum)}</Text>
                        <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 15 }} >Number of transactions: {contributions.length}</Text>
                    </View>
                </View> 

                {errorMessage ? <Text>{errorMessage}</Text> : null}

                {isLoading ? <ActivityIndicator /> : 
                <View contentContainerStyle={{ paddingBottom: 0 }}>
                    {
                        <View>
                            <View style={{ paddingHorizontal: 0, marginTop: 0, marginBottom: 20, backgroundColor: colors.background }}>
                                <FlatList
                                    data={contributions}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(contribution) => contribution.transaction_id}
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
                                            
                                            <View style={{ marginLeft: 0, flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                                
                                                <Icon 
                                                    name={'account-cash'}   
                                                    size={26} color={'gray'} 
                                                    style={{
                                                        padding: 5,
                                                        borderRadius: 25,
                                                        marginRight:0,
                                                        marginLeft: 0
                                                    }}
                                                />
                                                <View style={{ marginLeft: 0, flexDirection: 'column', justifyContent: 'space-between', flex: 1 , backgroundColor: colors.background }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                                        <View>
                                                            <Text style={{ marginLeft: SIZES.base, color: colors.text, ...FONTS.h3 }}>{item.event_name}
                                                            { item.active ? 
                                                                <Text style={{ color: colors.caption, ...FONTS.h3 }} >  (Active)</Text>
                                                                : <Text style={{ color: colors.caption, ...FONTS.h3 }} >  (Closed!)</Text>
                                                            }
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: colors.text, ...FONTS.body3 }} >{currencyFormat(item.amount)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                                                        <Text style={{ marginLeft: SIZES.base, color: colors.caption, ...FONTS.body3 }}>{format(new Date(item.time_date), "MMM dd, yyyy")}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    }

                    <View>
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ paddingHorizontal:0, paddingVertical: SIZES.padding, marginTop: SIZES.padding, backgroundColor: colors.background }}>
                                    <View 
                                        style={{ 
                                            flexDirection: 'row', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: SIZES.padding,
                                            marginVertical: 20,
                                            backgroundColor: colors.background,
                                            ...styles.shadow
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ height: 50, width: 50, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center'}}>
                                                <Icon name={'note-plus-outline'} size={26} color={'gray'} style={{marginRight:10}}/>
                                            </View>
                                            <View>
                                                <Text style={{ color: colors.text, ...FONTS.h2 }}>Register your Transaction</Text>
                                            </View>
                                        </View>
                                        
                                    </View>

                                    <View style={{ paddingHorizontal: SIZES.padding, paddingBottom: 10, }}>
                                        <Text style={{ color: colors.title, ...FONTS.h3, marginBottom: 5, paddingTop: 10, }} >Contributing towards:-</Text>
                                        { canContribute 
                                        ? <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5 }} >{eventName}</Text>
                                        : <Text style={{ color: colors.danger, ...FONTS.h2, marginBottom: 5 }} >*Contact Admin To Activate An Event!*</Text>
                                        }
                                        {/*{ canContribute ?
                                         <TouchableOpacity 
                                            onPress={() => fetchCopiedText()}
                                            style={styles.saveButton}    
                                        >
                                            <Text style={styles.saveText}>Paste copied message</Text>
                                        </TouchableOpacity>
                                        : null} */}
                                    </View>

                                    { canContribute ?
                                    <TextInput 
                                        style={{
                                            flexWrap: 'wrap',
                                            margin: 5,
                                            borderColor: COLORS.black,
                                            borderWidth: 1,
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
                                        placeholder="Paste Mpesa message here..."
                                        placeholderTextColor= {colors.caption}
                                        multiline={true}
                                        numberOfLines={4}
                                        //defaultValue={copiedText}
                                        onChangeText={(value) => setMpesaMessage(value)}
                                    />
                                    : null}

                                    <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-around' }}>
                                        <TouchableOpacity
                                            style={styles.saveButton}
                                            underlayColor='#fff'
                                            onPress={() => {
                                                setModalVisible(!modalVisible);
                                            }}>
                                            <Text style={styles.saveText}>Cancel</Text>
                                        </TouchableOpacity>

                                        { canContribute ?
                                        <TouchableOpacity
                                            style={styles.saveButton}
                                            onPress={() => {newTransaction(mpesaMessage)}} 
                                            underlayColor='#fff'>
                                            <Text style={styles.saveText}>Save</Text>
                                        </TouchableOpacity>
                                        : null}
                                    </View>
                                </View>
                            </View>
                            </View>
                        </Modal>
                    </View>
                    </View>
                </View>
                }
                </View>
                
            </ScrollView>
            )} 
            <TouchableOpacity onPress={() => transactionSequence()} style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
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
    },
    preference: {
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
      },
      modalView: {
        margin: 5,
        backgroundColor: '#009387',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 43.84,
        elevation: 15,
      },
      openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
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
        marginHorizontal: 30,
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
        paddingLeft : 30,
        paddingRight : 30
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
  });

  export default DetailsScreen;