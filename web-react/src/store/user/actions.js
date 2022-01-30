export const ADD_USER = 'ADD_USER';
export const addUser = ({ username, email }) => ({
  type: ADD_USER,
  payload: { username, email }
});

export const LOG_USER_OUT = 'LOG_USER_OUT';
export const logUserOut = () => ({
  type: LOG_USER_OUT
});
