import React, { useReducer } from "react";
import { v4 as uuid } from "uuid";
import warningContext from "./WarningContext";
import warningReducer from "./WarningReducer";
import { SET_WARNING, REMOVE_WARNING } from "../types";

const WarningState = (props) => {
  const initialState = [];

  const [state, dispatch] = useReducer(warningReducer, initialState);

  // Set warning
  const setWarning = (msg, type, timeout = 5000) => {
    const id = uuid();
    dispatch({ type: SET_WARNING, payload: { msg, type, id } });

    setTimeout(() => dispatch({ type: REMOVE_WARNING, payload: id }), timeout);
  };

  return (
    <warningContext.Provider
      value={{
        warnings: state,
        setWarning,
      }}
    >
      {props.children}
    </warningContext.Provider>
  );
};

export default WarningState;
