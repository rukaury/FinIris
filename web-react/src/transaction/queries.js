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
      account
      type
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
        account
        date
        title
        is_debited
        category
        type
        transaction_id
      }
    }
  }
`
