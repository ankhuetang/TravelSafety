// NO NEED TO CHANGE
import React, { useReducer } from "react";
import { v4 as uuid } from "uuid";
import alertReducer from "./AlertReducer";
import alertContext from "./AlertContext";
import { ADD_ALERT, FILTER_ALERTS, CLEAR_FILTER } from "../types";

const AlertState = (props) => {
  const initialState = {
    alerts: [],
    filtered: null,
  };

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // TODO
  // Add alert - later on will be making request to back end
  // axios.post('api/map/subscription')
  // post params: FormData, userID
  const addAlert = (alert) => {
    console.log("addAlert called");
    alert.id = uuid();
    dispatch({ type: ADD_ALERT, payload: alert });
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
