// NO NEED TO CHANGE
import { SET_WARNING, REMOVE_WARNING } from "../types";

export default (state, action) => {
  switch (action.type) {
    case SET_WARNING:
      return [...state, action.payload];
    case REMOVE_WARNING:
      return state.filter((alert) => alert.id !== action.payload);
    default:
      return state;
  }
};
