// NO NEED TO CHANGE
import React, { useReducer } from "react";
// import { v4 as uuid } from "uuid";
import alertReducer from "./AlertReducer";
import alertContext from "./AlertContext";
import {
  GET_ALERTS,
  ADD_ALERT,
  FILTER_ALERTS,
  CLEAR_FILTER,
  ALERT_ERROR,
  CLEAR_ALERTS,
} from "../types";
import axios from "axios";

const AlertState = (props) => {
  const initialState = {
    alerts: [],
    filtered: null,
    error: null,
  };

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Get alerts
  const getAlerts = async () => {
    console.log("getAlerts called");
    try {
      const res = await axios.get("http://localhost:8000/api/map/profile");
      // console.log("res.data is: ", res.data);
      const { Subscription } = res.data;
      // console.log(Subscription);
      dispatch({ type: GET_ALERTS, payload: Subscription });
    } catch (error) {
      console.log("There is an error!");
      console.log(error);
      dispatch({ type: ALERT_ERROR, payload: error.response.msg }); // Change this!!!
    }
  };

  // Add alert - later on will be making request to back end
  // axios.post('api/map/subscription')
  // post params: FormData, userID
  const addAlert = async (alert) => {
    console.log("addAlert called with alert: ", alert);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:8000/api/map/subscription",
        alert,
        config
      );
      // console.log("res is: ", res);
      // WIP code
      // const user_id = await axios.post("http://localhost:8000/api/user/data");
      // console.log("user_id is: ", user_id);
      const obj = {
        _id: res.data.Subscription._id,
        address: res.data.Subscription.address,
        duration: res.data.Subscription.duration,
        radius: res.data.Subscription.radius,
      };
      dispatch({ type: ADD_ALERT, payload: obj });
    } catch (error) {
      console.log("There is an error!");
      console.log(error);
      dispatch({ type: ALERT_ERROR, payload: error.response.msg }); // Change this!!!
    }
  };
  // Clear alerts
  const clearAlerts = (id) => {
    dispatch({ type: CLEAR_ALERTS });
  };

  // Filter alerts
  const filterAlerts = (text) => {
    console.log("filterAlerts called with text:", text);
    dispatch({ type: FILTER_ALERTS, payload: text });
  };
  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <alertContext.Provider
      value={{
        alerts: state.alerts,
        filtered: state.filtered,
        getAlerts,
        addAlert,
        clearAlerts,
        filterAlerts,
        clearFilter,
      }}
    >
      {props.children}
    </alertContext.Provider>
  );
};

export default AlertState;
