import React, { useReducer } from "react";
import { v4 as uuid } from "uuid";
import alertReducer from "./AlertReducer";
import alertContext from "./AlertContext";
import {
  GET_ALERTS,
  ADD_ALERT,
  FILTER_ALERTS,
  CLEAR_FILTER,
  ALERT_ERROR,
  CLEAR_ALERTS,
  SORT_ALERTS,
  CLEAR_SORT,
} from "../types";
import axios from "axios";

const AlertState = (props) => {
  const initialState = {
    alerts: [
      // { id: 1, location: "Hanoi", radius: 1, duration: 1 },
      // { id: 2, location: "China", radius: 2, duration: 2 },
      // { id: 3, location: "USA", radius: 3, duration: 3 },
    ],
    filtered: null,
    error: null,
    sorted: null,
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
      console.log("Get alerts raised error:", error);
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
      const obj = {
        _id: res.data.Subscription._id,
        address: res.data.Subscription.address,
        duration: res.data.Subscription.duration,
        radius: res.data.Subscription.radius,
        coordinate: res.data.Subscription.coordinate,
        createAt: res.data.Subscription.createAt,
      };
      console.log("object sending to reducer:", obj);
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
  // Sort alerts
  const sortAlerts = (alerts) => {
    dispatch({ type: SORT_ALERTS, payload: alerts });
  };
  // Clear sort
  const clearSort = () => {
    dispatch({ type: CLEAR_SORT });
  };

  return (
    <alertContext.Provider
      value={{
        alerts: state.alerts,
        filtered: state.filtered,
        sorted: state.sorted,
        getAlerts,
        addAlert,
        filterAlerts,
        clearFilter,
        sortAlerts,
        clearSort,
      }}
    >
      {props.children}
    </alertContext.Provider>
  );
};

export default AlertState;
