import { gql } from '@apollo/client';

/** *******************************************
 *
 * QUERIES
 *
 ********************************************* */

export const FETCH_USER = gql`
  query fetchUser($where: UserWhere) {
    users(where: $where) {
      username
      email
    }
  }
`;

export const LOG_USER_IN = gql`
  query loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      username
      email
    }
  }
`;

/** *******************************************
 *
 * MUTATIONS
 *
 ********************************************* */

export const REGISTER_USER = gql`
  mutation registerUser($input: [UserCreateInput!]!) {
    createUsers(input: $input) {
      users {
        username
        email
      }
    }
  }
`;
