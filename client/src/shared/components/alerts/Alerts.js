// CHANGE THIS!!!
import React, { useContext, Fragment, useEffect } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import AlertItem from "./AlertItem";

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
      <div style={{ marginRight: "100px" }}>
        <h4>
          It will feel safer if there are some alerts here. Please add an alert!
        </h4>
      </div>
    );
  }

  // if (filtered !== null) {
  //   console.log("filtered is not null: ", filtered);
  //   return (
  //     <Fragment>
  //       {filtered.map((alert) => (
  //         <AlertItem key={alert._id} alert={alert} />
  //       ))}
  //     </Fragment>
  //   );
  // } else {
  //   console.log("filtered is null, alerts are: ", alerts);
  //   return (
  //     <Fragment>
  //       {alerts.map((alert) => (
  //         <AlertItem key={alert._id} alert={alert} />
  //       ))}
  //     </Fragment>
  //   );
  // }

  return (
    <Fragment>
      {filtered !== null
        ? filtered.map((alert) => <AlertItem key={alert._id} alert={alert} />)
        : alerts.map((alert) => <AlertItem key={alert._id} alert={alert} />)}
    </Fragment>
  );
  // return (
  //   <Fragment>
  //     {filtered !== null
  //       ? filtered.map((alert) => console.log(alert))
  //       : alerts.map((alert) => console.log(alert))}
  //   </Fragment>
  // );
};

export default Alerts;
