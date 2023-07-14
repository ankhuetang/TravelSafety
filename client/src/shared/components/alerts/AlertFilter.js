import React, { useContext, useRef, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import { Input } from "@mui/joy";
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
