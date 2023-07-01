import React, { useReducer } from "react";
import { v4 as uuid } from "uuid";
import alertReducer from "./AlertReducer";
import alertContext from "./AlertContext";
import { ADD_ALERT, FILTER_ALERTS, CLEAR_FILTER } from "../types";

const AlertState = (props) => {
  const initialState = {
    alerts: [
      // { id: 1, location: "Hanoi", radius: 1, duration: 1 },
      // { id: 2, location: "China", radius: 2, duration: 2 },
      // { id: 3, location: "USA", radius: 3, duration: 3 },
    ],
    filtered: null,
  };

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Add alert - later on will be making request to back end
  const addAlert = (alert) => {
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
