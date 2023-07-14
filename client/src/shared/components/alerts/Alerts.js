// CHANGE THIS!!!
import React, { useContext, Fragment, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import AlertItem from "./AlertItem";
import { Box } from "@mui/joy";
import { form } from "../styles";
import AlertFilter from "./AlertFilter";

const Alerts = () => {
  const alertContext = useContext(AlertContext);

  const { alerts, filtered, loading, getAlerts } = alertContext;

  useEffect(() => {
    console.log("calling getAlerts");
    setTimeout(() => {
      getAlerts();
    }, 200);
    // eslint-disable-next-line
  }, []);

  if (alerts.length === 0) {
    return (
      <Box component="main" sx={form}>
        <AlertFilter />
        <h4>
          It will feel safer if there are some alerts here. Please add an alert!
        </h4>
      </Box>
    );
  }
  return (
    <Box component="main" sx={form}>
      <AlertFilter />
      {filtered !== null
        ? filtered.map((alert) => <AlertItem key={alert._id} alert={alert} />)
        : alerts.map((alert) => <AlertItem key={alert._id} alert={alert} />)}
    </Box>
  );
};

export default Alerts;
