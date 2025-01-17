import axios from 'axios';
import {setAlert} from './alert'
import{
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

import url from '../backendurl';
//load user
export const loadUser=()=>async dispatch=>{
if(localStorage.token){
    setAuthToken(localStorage.token);
}

try{
    const res=await axios.get(url + 'api/auth');
    dispatch({
        type:USER_LOADED,
        payload:res.data
    });
}
catch(err){
    dispatch({
        type:AUTH_ERROR
    })
}
}
export const register=(
    username,email,password
)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }

    console.log(username);
    const body=JSON.stringify({username,email,password});
    try{
        console.log(body);
        const res=await axios.post(url + 'api/users',username,config);
        dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
        });
        dispatch(setAlert('Registration successful', 'danger'));
        dispatch(loadUser());
    }
    catch(err){
        if(err.response && err.response.data){
        const errors=err.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        }
dispatch({
    type:REGISTER_FAIL
});
    }
}
};

//login
export const login=(
    email,password
)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    
    const body=JSON.stringify({email,password});
    try{
        console.log(body);
        const res=await axios.post(url + 'api/auth',body,config);
        dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    }
    catch(err){
        const errors=err.response.data.errors;
        if(errors){
            console.log(errors);
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        }
dispatch({
    type:LOGIN_FAIL
});
    }
};

// Logout
export const logout = () => ({ type: LOGOUT });