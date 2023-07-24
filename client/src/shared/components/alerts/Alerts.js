import React, { useContext, Fragment, useEffect, useState } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import AlertItem from "./AlertItem";
import { Box, Stack, Grid } from "@mui/joy";
import { form } from "../styles";
import AlertFilter from "./AlertFilter";
import AlertSort from "./AlertSort";

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { alerts, filtered, sorted, getAlerts } = alertContext;

  useEffect(() => {
    console.log("Alerts component is calling getAlerts");
    setTimeout(() => {
      getAlerts();
    }, 200);
    // eslint-disable-next-line
  }, []);

  if (alerts.length === 0) {
    return (
      <Box component="main" sx={form}>
        <AlertFilter />
        <AlertSort />
        <h4>
          It will feel safer if there are some alerts here. Please add an alert!
        </h4>
      </Box>
    );
  }
  return (
    <Box component="main" sx={form}>
      {/* <Stack direction="row" spacing={10}>
        <AlertFilter />
        <AlertSort />
      </Stack> */}

      <Grid container spacing={1}>
        <Grid item xs={8}>
          <AlertFilter />
        </Grid>
        <Grid item xs={4}>
          <AlertSort />
        </Grid>
      </Grid>
      {/* {filtered !== null ? (
        filtered.length > 0 ? (
          filtered.map((alert) => <AlertItem key={alert._id} alert={alert} />)
        ) : (
          <h4>We couldn't find any alert that matches your description</h4>
        )
      ) : (
        alerts.map((alert) => <AlertItem key={alert._id} alert={alert} />)
      )} */}

      {sorted !== null && sorted.length > 0 ? (
        <Fragment>
          {/* <h5>Rendering sorted</h5> */}
          {sorted.map((alert) => (
            <AlertItem key={alert._id} alert={alert} />
          ))}
        </Fragment>
      ) : sorted !== null && sorted.length === 0 ? (
        <Fragment>
          {/* <h5>Sorted is displayed, but there is no alerts</h5> */}
          <h4>We couldn't find any alerts that match your description</h4>
        </Fragment>
      ) : filtered !== null && filtered.length > 0 ? (
        <Fragment>
          {/* <h5>Rendering filtered</h5> */}
          {filtered.map((alert) => (
            <AlertItem key={alert._id} alert={alert} />
          ))}
        </Fragment>
      ) : filtered !== null && filtered.length === 0 ? (
        <Fragment>
          {/* <h5>Filtered is displayed, but there is no alerts</h5> */}
          <h4>We couldn't find any alerts that match your description</h4>
        </Fragment>
      ) : (
        <Fragment>
          {/* <h5>Both sorted and filtered are null, rendering alerts</h5> */}
          {alerts.map((alert) => (
            <AlertItem key={alert._id} alert={alert} />
          ))}
        </Fragment>
      )}
    </Box>
  );
};

export default Alerts;
