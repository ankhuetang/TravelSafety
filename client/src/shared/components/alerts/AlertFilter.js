import React, { useContext, useRef, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import { Input } from "@mui/joy";
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
    <Input
      ref={text}
      type="text"
      placeholder="Filter Alerts..."
      onChange={onChange}
      variant="solid"
      color="primary"
    />
  );
};

export default AlertFilter;
