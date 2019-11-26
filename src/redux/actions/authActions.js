import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/auth/create-user", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
};
// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/auth/login", userData)
    .then(res => {
      // Save to localStorage
// Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("token", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      // Set current user
      dispatch(setCurrentUser(token));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Set logged in user
export const setCurrentUser = token => {
  return {
    type: SET_CURRENT_USER,
    payload: token
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("token");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};