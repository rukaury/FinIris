import { gql } from '@apollo/client'

/*********************************************
 *
 * QUERIES
 *
 **********************************************/

export const FETCH_USER = gql`
  query fetchUser($username: String!) {
    fetchUser(username: $username) {
      username
      email
    }
  }
`

export const LOG_USER_IN = gql`
  query loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      username
      email
    }
  }
`

/*********************************************
 *
 * MUTATIONS
 *
 **********************************************/

export const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $password: String!
    $email: String!
  ) {
    registerUser(username: $username, password: $password, email: $email) {
      username
      email
    }
  }
`
