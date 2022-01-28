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
    transactionsAggregate {
      count
      amount {
        max
        min
        average
        sum
      }
    }
  }
`

export const FETCH_TRANSACTION_AGGREGATE = gql`
  query transactionsAggregate($where: TransactionWhere) {
    transactionsAggregate(where: $where) {
      count
      amount {
        max
        min
        average
        sum
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
