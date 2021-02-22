import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default axios.create({
    baseURL: "https://dynastyapi.herokuapp.com"
});

