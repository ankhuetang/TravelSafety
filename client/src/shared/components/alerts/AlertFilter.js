// TODO: Style the form a bit: Add some top margin, and align the form with the alert cards

import React, { useContext, useRef, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";

const AlertFilter = () => {
  const alertContext = useContext(AlertContext);
  const { filterAlerts, clearFilter, filtered, clearSort } = alertContext;
  const text = useRef("");

  useEffect(() => {
    if (filtered === null) {
      // console.log("filtered is null, setting text to empty");
      text.current.value = "";
    }
  });

  const onChange = (e) => {
    // console.log("AlertFilter triggered onChange");
    // console.log("Filter value:", e.target.value);
    // console.log("Current text:", text.current.value);
    text.current.value = e.target.value;
    if (text.current.value !== "") {
      // WIP code
      clearSort();
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
