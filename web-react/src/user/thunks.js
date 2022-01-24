import { addUser } from './actions'
import graphQLClient from '../appolo-client'
import { FETCH_USER, REGISTER_USER, LOG_USER_IN } from './queries'

export const registerUser = ({ username, email, password }) => async (
  dispatch
) => {
  try {
    graphQLClient
      .query({
        query: FETCH_USER,
        variables: { username },
      })
      .then((result) => {
        const {
          data: { fetchUser },
        } = result
        if (fetchUser) {
          const message = 'User already Exists'
          console.error(message)
        } else {
          graphQLClient
            .mutate({
              mutation: REGISTER_USER,
              variables: { username, email, password },
              update: (_cache, result) => {
                const {
                  data: { registerUser },
                } = result
                dispatch(addUser(registerUser))
              },
            })
            .catch(() => {
              const message = 'An error occured while registering the user.'
              console.error(message)
            })
        }
      })
      .catch(() => {
        const message =
          'An error occured while fetching for the registration user.'
        console.error(message)
      })
  } catch (e) {
    const message = 'An error occured while registering the user.'
    console.error(message)
  }
}

export const loginUser = ({ username, password }) => async (dispatch) => {
  try {
    graphQLClient
      .query({
        query: LOG_USER_IN,
        variables: { username, password },
      })
      .then((result) => {
        const {
          data: { loginUser },
        } = result
        if (loginUser) {
          dispatch(addUser(loginUser))
        } else {
          const message = `Failed to login user!.`
          console.error(message)
        }
      })
      .catch(() => {
        const message = 'An error occured while logging in the user.'
        console.error(message)
      })
  } catch (e) {
    const message = 'An error occured while logging in the user.'
    console.error(message)
  }
}
