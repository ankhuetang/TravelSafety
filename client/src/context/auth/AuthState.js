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
      const res = await axios.get("api/auth"); // Sua lai cho dung endpoint
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
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("api/users", formData, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      setTimeout(() => {
        loadUser();
      }, "100");
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg });
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
      const res = await axios.post("api/auth", formData, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      setTimeout(() => {
        loadUser();
      }, 1000);
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.msg });
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
