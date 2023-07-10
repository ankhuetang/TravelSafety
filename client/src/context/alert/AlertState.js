// NO NEED TO CHANGE
import React, { useReducer } from "react";
// import { v4 as uuid } from "uuid";
import alertReducer from "./AlertReducer";
import alertContext from "./AlertContext";
import { ADD_ALERT, FILTER_ALERTS, CLEAR_FILTER, ALERT_ERROR } from "../types";
import axios from "axios";

const AlertState = (props) => {
  const initialState = {
    alerts: [],
    filtered: null,
    error: null,
  };

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // TODO
  // Add alert - later on will be making request to back end
  // axios.post('api/map/subscription')
  // post params: FormData, userID
  const addAlert = async (alert) => {
    console.log("addAlert called");
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/subscription", alert, config);
      console.log("res is: ", res);
      dispatch({ type: ADD_ALERT, payload: res.data });
    } catch (error) {
      console.log("There is an error!");
      console.log(error);
      dispatch({ type: ALERT_ERROR, payload: error.response.msg });
    }
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
        addAlert,
        filterAlerts,
        clearFilter,
      }}
    >
      {props.children}
    </alertContext.Provider>
  );
};

export default AlertState;
