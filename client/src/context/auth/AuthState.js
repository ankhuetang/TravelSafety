// CHANGE THIS!!!
import React, { useReducer } from "react";
import authContext from "./AuthContext";
import authReducer from "./AuthReducer";
import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";
import setAuthToken from "../../utils/setAuthToken";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    error: null,
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user - Minh chua co endpoint nay o backend
  const loadUser = async () => {
    // localStorage.token DOESN'T EXIST!!!
    if (localStorage.getItem("token") !== null) {
      setAuthToken(localStorage.getItem("token"));
    }
    try {
      const res = await axios.get("http://localhost:8000/api/user/data");
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  };

  // Register user
  const register = async (formData) => {
    // console.log("register function called");
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/signup",
        formData,
        config
      );
      // console.log("Success! res is", res);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      setTimeout(() => {
        loadUser();
      }, "100");
    } catch (err) {
      // console.log("there is an error!", err);
      // console.log("error content:", err);
      dispatch({ type: REGISTER_FAIL, payload: err.message });
    }
  };

  // Login user
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/login",
        formData,
        config
      );
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      setTimeout(() => {
        loadUser();
      }, 1000);
    } catch (err) {
      // console.log("there is an error!", err);
      // console.log("error content:", err);
      dispatch({ type: LOGIN_FAIL, payload: err.message });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({
      type: CLEAR_ERRORS,
    });
  };

  return (
    <authContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        loadUser,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthState;
