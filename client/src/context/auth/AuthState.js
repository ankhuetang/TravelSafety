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

  // Load user
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
      console.log("loadUser function raised an error:", error);
      const { msg } = error.response.data;
      console.log(msg);
      dispatch({ type: AUTH_ERROR, payload: msg });
    }
  };

  // Register user
  const register = async (formData) => {
    console.log("register function called");
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
      console.log("register function raised an error:", err);
      if (
        /Invalid inputs passed, please check your data./.test(err.response.data)
      ) {
        dispatch({
          type: REGISTER_FAIL,
          payload: "Invalid inputs passed, please check your data.",
        });
      } else if (/Cannot access DB./.test(err.response.data)) {
        dispatch({ type: REGISTER_FAIL, payload: "Cannot access DB." });
      } else if (
        /Email exists already, please login instead./.test(err.response.data)
      ) {
        dispatch({
          type: REGISTER_FAIL,
          payload: "Email exists already, please login instead.",
        });
      } else if (
        /Could not hash password, my bad, not your fault/.test(
          err.response.data
        )
      ) {
        dispatch({
          type: REGISTER_FAIL,
          payload: "Could not hash password, my bad, not your fault",
        });
      } else if (/Failed to save your data to DB/.test(err.response.data)) {
        dispatch({
          type: REGISTER_FAIL,
          payload: "Failed to save your data to DB",
        });
      } else if (/Failed to sign token/.test(err.response.data)) {
        dispatch({ type: REGISTER_FAIL, payload: "Failed to sign token" });
      }
    }
  };

  // Login user
  const login = async (formData) => {
    console.log("login function called");
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
      console.log("login function raised an error:", err.response);
      if (/Email does not exist/.test(err.response.data)) {
        dispatch({ type: LOGIN_FAIL, payload: "Email does not exist" });
      } else if (
        /Logging in failed, please try again later./.test(err.response.data)
      ) {
        dispatch({
          type: LOGIN_FAIL,
          payload: "Logging in failed, please try again later.",
        });
      } else if (
        /Could not log you in, please check your credentials and try again./.test(
          err.response.data
        )
      ) {
        dispatch({
          type: LOGIN_FAIL,
          payload:
            "Could not log you in, please check your credentials and try again.",
        });
      } else if (/Password not correct/.test(err.response.data)) {
        dispatch({ type: LOGIN_FAIL, payload: "Password not correct" });
      } else if (/Failed to sign token/.test(err.response.data)) {
        dispatch({ type: LOGIN_FAIL, payload: "Failed to sign token" });
      }
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT, payload: null });
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
