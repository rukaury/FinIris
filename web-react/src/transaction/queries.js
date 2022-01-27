import { gql } from '@apollo/client'

/*********************************************
 *
 * QUERIES
 *
 **********************************************/

export const FETCH_TRANSACTIONS = gql`
  query fetchTransactions($where: TransactionWhere) {
    transactions(where: $where) {
      transaction_id
      title
      type
      is_debited
      category
      amount
      userConnection {
        edges {
          date
          account
        }
      }
    }
  }
`

/*********************************************
 *
 * MUTATIONS
 *
 **********************************************/

export const CREATE_TRANSACTIONS = gql`
  mutation createTransactions($input: [TransactionCreateInput!]!) {
    createTransactions(input: $input) {
      transactions {
        title
        is_debited
        category
        type
        amount
        transaction_id
      }
    }
  }
`
