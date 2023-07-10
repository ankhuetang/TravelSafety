// TODO: Style the form a bit: Add some top margin, and align the form with the alert cards
// NO NEED TO CHANGE

import React, { useContext, useRef, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";

const AlertFilter = () => {
  const alertContext = useContext(AlertContext);
  const { filterAlerts, clearFilter, filtered } = alertContext;
  const text = useRef("");

  useEffect(() => {
    if (filtered === null) {
      text.current.value = "";
    }
  });

  const onChange = (e) => {
    if (text.current.value !== "") {
      filterAlerts(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        ref={text}
        type="text"
        placeholder="Filter Alerts ..."
        onChange={onChange}
      />
    </form>
  );
};

export default AlertFilter;
