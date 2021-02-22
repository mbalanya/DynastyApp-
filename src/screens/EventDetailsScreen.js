import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, StatusBar, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator, Alert, TouchableHighlight, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import { color } from 'react-native-reanimated';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import DynastyAppApi from '../../api/DynastyAppApi';
import { format } from "date-fns";
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const EventDetailsScreen = (props) => {
    const eventDetails = props.route.params.item;
    const [transaction, setTransaction] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [userToken, setUserToken] = useState({});
    const [isActive, setIsActive] = useState(eventDetails.active);
    const [modalVisible, setModalVisible] = useState(false);
    const [contributionReason, setContributionReason] = useState(eventDetails.contribution_reason);
    const [eventName, setEventName] = useState(eventDetails.event_name);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            let tokenResponse = await AsyncStorage.getItem('userToken');

            try {
            const response = await DynastyAppApi.get(`/api/v1/events/${eventDetails.event_id}/transactions`, {
                headers: {'Authorization': tokenResponse}
            })
            setTransaction(response.data.data.transaction);
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
    }, [transaction.length]);

    const toggleSwitch = async () => {
        let tokenResponse = await AsyncStorage.getItem('userToken');
        //console.log(tokenResponse)
        //setIsActive(previousState => !previousState);
        try {
            const config = {
                headers: { 'Authorization': tokenResponse }
            };
        
            const bodyParameters = {
            };

            try {
                const response = await DynastyAppApi.put(
                    `/api/v1/active/${eventDetails.event_id}/`, 
                    bodyParameters,
                    config
                )
                setIsActive(response.data.data.active[0].active);
                //console.log(response.data.data.active[0].active);
                
            } catch (err) {
                setLoading(false);
                console.log(err);
                alert('Error doing this opertaion, retry!');
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            alert('Error doing this opertaion, retry!');
        }
    }

    const editEvent = async () => {
        setLoading(true);

        let userToken = await AsyncStorage.getItem('userToken');
        
        try {
          const config = {
              headers: { 'Authorization': userToken }
          };
          
          const bodyParameters = {
            event_name: eventName,
            contribution_reason: contributionReason
          };
          
          try {
            const response = await DynastyAppApi.put(
              `/api/v1/events/${eventDetails.event_id}/`,
              bodyParameters,
              config
            )
            console.log(response.data.data.member_update[0])
            //setProfile(response.data.data.image[0])
              //DrawerContent
              props.navigation.navigate('Home');
              setModalVisible(!modalVisible);
              setLoading(false);
            
          } catch (err) {
            setModalVisible(!modalVisible);
            setLoading(false);
              console.log(err)
              alert('Error saving, event must be active to edit. Retry!');
  
          }
        } catch (err) {
            setModalVisible(!modalVisible);
          setLoading(false);
          console.log(err);
          alert('Error doing this opertaion, retry!');
  
        }
      }

    const { colors } = useTheme();

    const theme = useTheme();

    var transactionsSum = transaction.reduce(function(prev, curr) {
        return prev + curr.amount;
    }, 0);

    const currencyFormat = (num) => {
        return 'Ksh.' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    // configure flatlist animation
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })


    return (
      <View style={{ flex: 1, backgroundColor: colors.background, marginBottom: 0 }}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column',alignItems: 'center', padding: 10, backgroundColor: colors.background }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                    <Text style={{ color: colors.caption, ...FONTS.h3 }}>Loading {eventDetails.event_name} Transactions...</Text>
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
                        flex: 1,
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        flexDirection: 'column', 
                        paddingHorizontal: 0,
                        paddingVertical: SIZES.padding,
                        //borderBottomColor: 'red',
                        //borderBottomWidth: 3,
                        ...styles.shadow
                }}>
                    <View>
                        <Text style={{ color: colors.text, ...FONTS.h2 }}>{eventDetails.event_name} Contributions
                        { isActive ? 
                            <Text style={{ color: colors.caption, ...FONTS.h3 }} >  (Active)</Text>
                            : <Text style={{ color: colors.caption, ...FONTS.h3 }} >  (Closed!)</Text>
                        }
                        </Text>
                    </View>
                    <View 
                        style={{ 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: colors.background
                    }}>
                        <View>
                            <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5 }} >All Members</Text>
                            
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background }}>
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
                                <Text style={{ color: colors.text, ...FONTS.h3 }} >{format(new Date(eventDetails.created_on), "MMM dd, yyyy")}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5, paddingBottom: 10, borderBottomColor: 'lightgray', borderBottomWidth: 2 }} >{eventDetails.contribution_reason}</Text>
                        <Text style={{ color: colors.text, ...FONTS.h3 }}>{eventDetails.event_name} Contributions Summary:</Text>
                        <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5, paddingTop: 10, }} >Contributions for this event: {currencyFormat(transactionsSum)}</Text>
                        <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5 }} >Number of contributors: {transaction.length}</Text>
                    </View>
                    { userToken.role === "admin" || userToken.role === "superadmin"
                    ?
                    <View style={{ flexDirection: 'row', borderTopColor: 'lightgray', borderTopWidth: 2, alignItems: 'center', justifyContent: 'space-between', paddingTop: 15 }}>
                        <TouchableOpacity onPress={() => toggleSwitch()}>
                            <View style={[styles.preference, { flexDirection: 'row', alignItems: 'center' }]}>
                                <Text style={{color: colors.caption, ...FONTS.h3, marginBottom: 5, paddingTop: 10,}}>Activate this Event: </Text>
                                <View pointerEvents="none">
                                    <Switch value={isActive} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.preference} 
                            onPress={() => {
                                setModalVisible(true);
                                }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: colors.caption, ...FONTS.h3, marginBottom: 5, paddingTop: 10, }} >Edit this Event: </Text>
                                <Icon name={'file-document-edit-outline'} size={20} color={'gray'} style={{marginRight:30}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    : null }
                </View> 

                {errorMessage ? <Text>{errorMessage}</Text> : null}

                {isLoading ? <ActivityIndicator /> : 
                <View contentContainerStyle={{ flex: 3, paddingBottom: 0 }}>
                    {
                        <View>
                            <View style={{ paddingHorizontal: 0, marginTop: 0, marginBottom: 20, backgroundColor: colors.background }}>
                                <FlatList
                                    data={transaction}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(trans) => trans.transaction_id}
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
                                            onPress={() => {}}
                                        >
                                            
                                            <View style={{ marginLeft: 0, flexDirection: 'row', flex: 1 }}>
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
                                                <View style={{ marginLeft: 0, flexDirection: 'column', justifyContent: 'space-between', flex: 1 , backgroundColor: colors.background }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                                        <View>
                                                            <Text style={{ marginLeft: SIZES.base, color: colors.text, ...FONTS.h3 }}>{item.username}</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: colors.text, ...FONTS.body3 }} >{currencyFormat(item.amount)}</Text>
                                                        </View>
                                                        {/* <View>
                                                            <Text style={{ color: COLORS.primary, ...FONTS.body4 }} >{format(new Date(item.time_date), "MMM dd, yyyy")}</Text>
                                                        </View> */}
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
                </View>
                }
            </ScrollView>
            
            )}
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
                                        <Icon name={'file-document-edit-outline'} size={26} color={'gray'} style={{marginRight:30}}/>
                                    </View>
                                    <View>
                                        <Text style={{ color: colors.text, ...FONTS.h2 }}>Edit this Event</Text>
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
                                defaultValue={eventDetails.event_name}
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
                                defaultValue={eventDetails.contribution_reason}
                                onChangeText={(contributionReason) => setContributionReason(contributionReason)}
                            />

                            <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    underlayColor='#fff'
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                    <Text style={styles.saveText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => {editEvent()}} 
                                    underlayColor='#fff'>
                                    <Text style={styles.saveText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    </View>
                </Modal>
            </View>
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


  export default EventDetailsScreen;