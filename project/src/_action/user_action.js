//client/src/_actions/user_action.js

import Axios from 'axios';
import {
    AUTH_USER,
    LOGIN_USER,
    REGISTER_USER,
    OAUTH_LINE
} from './types'

export function loginUser(dataTosubmit) {

    const request = Axios.post('/api/users/login', dataTosubmit)        //서버에 리퀘스트 날리고 
        .then(response => response.data)                     //받은 데이터를 request에 저장

        return {                    //Action 했으니까 이제 Reducer로 보냄
            type: LOGIN_USER,
            payload: request
        }    
}

export function registerUser(dataTosubmit) {

    const request = Axios.post('/api/users/register', dataTosubmit)        //서버에 리퀘스트 날리고 
        .then(response => response.data)                     //받은 데이터를 request에 저장

        return {                    //Action 했으니까 이제 Reducer로 보냄
            type: REGISTER_USER,
            payload: request
        }    
}

export function auth() {

    const request = Axios.get('/api/users/auth')        //서버에 리퀘스트 날리고 
        .then(response => response.data)                     //받은 데이터를 request에 저장

        return {                    //Action 했으니까 이제 Reducer로 보냄
            type: AUTH_USER,
            payload: request
        }    
}

export function oAuthLine() {

    const request = Axios.post('/api/users/oauth/line')        //서버에 리퀘스트 날리고 
        .then(response => response.data)                     //받은 데이터를 request에 저장

        return {                    //Action 했으니까 이제 Reducer로 보냄
            type: OAUTH_LINE,
            payload: request
        }    
}

