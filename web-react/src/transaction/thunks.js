import graphQlClient from '../appolo-client'
import {
  loadTransactionsFailure,
  loadTransactionsInProgress,
  loadTransactionsSuccess,
  addTransactions,
  addTransactionsAggregate,
} from './actions'
import { FETCH_TRANSACTIONS, CREATE_TRANSACTIONS } from './queries'

export const loadTransactions = (username) => async (dispatch) => {
  try {
    const where = {
      user: {
        username: username,
      },
    }

    dispatch(loadTransactionsInProgress())
    graphQlClient
      .query({
        query: FETCH_TRANSACTIONS,
        variables: { where },
      })
      .then((result) => {
        const {
          data: { transactions, transactionsAggregate },
        } = result
        dispatch(loadTransactionsSuccess(transactions))
        dispatch(addTransactionsAggregate(transactionsAggregate))
      })
      .catch(() => dispatch(loadTransactionsFailure()))
  } catch (e) {
    dispatch(loadTransactionsFailure())
  }
}

export const createTransactions = (newTransactions) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      const input = newTransactions

      graphQlClient
        .mutate({
          mutation: CREATE_TRANSACTIONS,
          variables: { input },
          update: (_cache, result) => {
            const {
              data: { createTransactions },
            } = result
            const message = 'Successfully added merchants.'
            dispatch(addTransactions(createTransactions))
            resolve(message)
          },
        })
        .catch(() => {
          const message = 'An error occured while adding transactions.'
          reject(message)
        })
    } catch (e) {
      const message = 'An error occured while adding transactions.'
      reject(message)
    }
  })
}
