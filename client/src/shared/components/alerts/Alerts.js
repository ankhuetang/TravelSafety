import React, { useContext, Fragment, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import AlertItem from "./AlertItem";

const Alerts = () => {
  const alertContext = useContext(AlertContext);

  const { alerts, filtered, getAlerts, loading } = alertContext;

  useEffect(() => {
    console.log("calling getAlerts");
    setTimeout(() => {
      getAlerts();
    }, 200);
    // eslint-disable-next-line
  }, []);

  if (alerts !== null) {
    return (
      <h4>
        It will feel safer if there are some alerts here. Please add an alert!
      </h4>
    );
  }

  return (
    <Fragment>
      {filtered !== null
        ? filtered.map((alert) => <AlertItem key={alert.id} alert={alert} />)
        : alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)}
    </Fragment>
  );
};

export default Alerts;
