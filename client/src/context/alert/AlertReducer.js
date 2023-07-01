import { ADD_ALERT, FILTER_ALERTS, CLEAR_FILTER } from "../types";

export default (state, action) => {
  switch (action.type) {
    case ADD_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
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
    default:
      return state;
  }
};
