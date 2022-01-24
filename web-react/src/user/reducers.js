import { ADD_USER, LOG_USER_OUT } from './actions'

const initialUser = {
  username: '',
  email: '',
  isLoggedIn: false,
}

export const user = (state = initialUser, action) => {
  const { type, payload } = action

  switch (type) {
    case ADD_USER: {
      const { username, email } = payload
      const currentUser = {
        username,
        email,
        isLoggedIn: true,
      }
      state = currentUser
      return state
    }
    case LOG_USER_OUT: {
      const currentUser = {
        username: '',
        email: '',
        isLoggedIn: false,
      }
      state = currentUser
      return state
    }
    default:
      return state
  }
}
