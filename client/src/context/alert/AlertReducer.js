import {
  ADD_ALERT,
  FILTER_ALERTS,
  CLEAR_FILTER,
  ALERT_ERROR,
  GET_ALERTS,
  CLEAR_ALERTS,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_ALERTS:
      return {
        ...state,
        alerts: action.payload,
        loading: false,
      };
    case ADD_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
        loading: false,
      };
    case CLEAR_ALERTS:
      return {
        ...state,
        alerts: null,
        filtered: null,
        error: null,
        current: null,
      };
    case FILTER_ALERTS:
      return {
        ...state,
        filtered: state.alerts.filter((alert) => {
          const regex = new RegExp(`${action.payload}`, "gi");
          return alert.location.match(regex);
        }),
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null,
      };
    case ALERT_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
