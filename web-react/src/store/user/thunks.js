import { addUser } from './actions';
import graphQLClient from '../../appolo-client';
import { FETCH_USER, REGISTER_USER } from './queries';

export const registerUser =
  ({ username, email, password }) =>
  async (dispatch) => {
    try {
      const input = [
        {
          username,
          email,
          password
        }
      ];

      const where = {
        username
      };

      graphQLClient
        .query({
          query: FETCH_USER,
          variables: { where }
        })
        .then((result) => {
          const {
            data: { users }
          } = result;
          if (users.length > 0) {
            const message = 'User already Exists';
            console.error(message);
          } else {
            graphQLClient
              .mutate({
                mutation: REGISTER_USER,
                variables: { input },
                update: (_cache, result) => {
                  const {
                    data: {
                      createUsers: {
                        users: [user]
                      }
                    }
                  } = result;
                  dispatch(addUser(user));
                }
              })
              .catch(() => {
                const message = 'An error occured while registering the user.';
                console.error(message);
              });
          }
        })
        .catch(() => {
          const message = 'An error occured while fetching for the registration user.';
          console.error(message);
        });
    } catch (e) {
      const message = 'An error occured while registering the user.';
      console.error(message);
    }
  };

export const loginUser =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      const fetchInput = {
        where: {
          username,
          password
        }
      };

      graphQLClient
        .query({
          query: FETCH_USER,
          variables: { fetchInput }
        })
        .then((result) => {
          const {
            data: { users }
          } = result;
          if (users.length > 0) {
            const [user] = users;
            dispatch(addUser(user));
          } else {
            const message = `Failed to login user!.`;
            console.error(message);
          }
        })
        .catch(() => {
          const message = 'An error occured while logging in the user.';
          console.error(message);
        });
    } catch (e) {
      const message = 'An error occured while logging in the user.';
      console.error(message);
    }
  };
