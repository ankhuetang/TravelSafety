import React, { useContext, Fragment, useEffect, useState } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import AlertItem from "./AlertItem";
import { Box, Grid } from "@mui/joy";
import { form } from "../styles";
import AlertFilter from "./AlertFilter";
import AlertSort from "./AlertSort";
import rascalGif from "../../../assets/rascal-nothing-to-see-here.gif";
import noResultGif from "../../../assets/no-results.gif";

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
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <AlertFilter />
          </Grid>
          <Grid item xs={4}>
            <AlertSort />
          </Grid>
        </Grid>
        <img src={rascalGif} alt="No alerts" />
      </Box>
    );
  }
  return (
    <Box component="main" sx={form}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <AlertFilter />
        </Grid>
        <Grid item xs={4}>
          <AlertSort />
        </Grid>
      </Grid>

      {sorted !== null && sorted.length > 0 ? (
        <Fragment>
          {sorted.map((alert) => (
            <AlertItem key={alert._id} alert={alert} />
          ))}
        </Fragment>
      ) : sorted !== null && sorted.length === 0 ? (
        <Fragment>
          <img src={noResultGif} alt="No match" />
        </Fragment>
      ) : filtered !== null && filtered.length > 0 ? (
        <Fragment>
          {filtered.map((alert) => (
            <AlertItem key={alert._id} alert={alert} />
          ))}
        </Fragment>
      ) : filtered !== null && filtered.length === 0 ? (
        <Fragment>
          <img src={noResultGif} alt="No match" />
        </Fragment>
      ) : (
        <Fragment>
          {alerts.map((alert) => (
            <AlertItem key={alert._id} alert={alert} />
          ))}
        </Fragment>
      )}
    </Box>
  );
};

export default Alerts;
