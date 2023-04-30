const axios = require("axios");
require("dotenv").config();

export const isBrowser = () => typeof window !== "undefined";
export const getToken = () => {
  if (isBrowser() && window.localStorage.getItem("token")) {
    return window.localStorage.getItem("token");
  }
  return null;
};

export const getUser = () => {
  if (isBrowser() && window.localStorage.getItem("user")) {
    return JSON.parse(window.localStorage.getItem("user"));
  }
  return null;
};

export const getUserData = async token => {
  try {
    if (token !== null && token !== "") {
      const response = await axios.post(
        `http://localhost:5000/api/v1/users/get-all`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        }
      );
      await window.localStorage.setItem("user", JSON.stringify(response.data.data));
      return response.data.data;
    }
    return null;
  } catch (e) {
    await window.localStorage.clear();
    console.log("Hubo un error:", e);
    return null;
  }
};

export const handleLogin = async ( username, password ) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/users/login`, 
      {
          email: username,
          password
      });
      await window.localStorage.setItem("token", response.data.data.token);
      if (response.data.data.token !== null) {
        const user = await getUserData(response.data.data.token);
        await window.localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      alert("Password o usuario invalido");
      console.log(error);
      return false;
    }
  };


export const logout = async() => {
  try{
    await localStorage.removeItem('user');
    await localStorage.removeItem('token');
    await localStorage.removeItem('productos');
    return true
  }catch(err){
    console.log('Error: ', err)
    return false
  }
};

export const accessCheck = () => {
  try{
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    if(token && username){
      return true
    }else{
      return false
    }
  }catch(err){
    console.log('Error: ', err)
    return false
  }
};
