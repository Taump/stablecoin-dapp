import { ADD_AA_NOTIFICATION } from "../types/notifications";

const initialState = {
  notifications: [],
  fullNotifications: [],
  notificationsLoaded: false
};

export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
