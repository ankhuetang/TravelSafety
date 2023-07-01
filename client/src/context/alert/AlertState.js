import React, { useReducer } from "react";
import alertReducer from "./AlertReducer";
import alertContext from "./AlertContext";
import {
  GET_ALERTS,
  ADD_ALERT,
  FILTER_ALERTS,
  CLEAR_ALERTS,
  CLEAR_FILTER,
  ALERT_ERROR,
} from "../types";

const AlertState = (props) => {
  const initialState = {
    alerts: null,
    filtered: null,
    error: null,
  };

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Get alerts
  const getAlerts = async () => {
    try {
      const res = await axios.get("/api/contacts"); // Sua lai dung endpoint
      dispatch({
        type: GET_ALERTS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ALERT_ERROR,
        payload: error.response.msg,
      });
    }
  };

  // Add alert - later on will be making request to back end
  const addAlert = async (alert) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/alerts", alert, config);
      dispatch({ type: ADD_ALERT, payload: res.data });
    } catch (error) {
      dispatch({ type: ALERT_ERROR, payload: error.response.msg });
    }
  };

  // Clear alerts
  const clearAlerts = (id) => {
    dispatch({ type: CLEAR_ALERTS });
  };

  // Filter alerts
  const filterAlerts = (text) => {
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
        error: state.error,
        addAlert,
        filterAlerts,
        clearFilter,
        getAlerts,
        clearAlerts,
      }}
    >
      {props.children}
    </alertContext.Provider>
  );
};

export default AlertState;
