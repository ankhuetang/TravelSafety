// NO NEED TO CHANGE
import {
  ADD_ALERT,
  FILTER_ALERTS,
  CLEAR_FILTER,
  ALERT_ERROR,
  GET_ALERTS,
  CLEAR_ALERTS,
  SORT_ALERTS,
  CLEAR_SORT,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case ADD_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    case FILTER_ALERTS:
      console.log("FILTER_ALERTS reducer called");
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
    case SORT_ALERTS:
      return {
        ...state,
        sorted: action.payload,
      };
    case CLEAR_SORT:
      return {
        ...state,
        sorted: null,
      };
    default:
      return state;
  }
};
