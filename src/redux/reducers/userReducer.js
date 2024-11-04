import { createReducer } from "@reduxjs/toolkit";
import { setLogging, setPermission } from "../actions/actions"

const initialState = {
  isLogging: false,
  permission: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLogging, (state, action) => {
      state.isLogging = action.payload;
    })
    .addCase(setPermission, (state, action) => {
      state.permission = action.payload;
    });
});

export default userReducer;
