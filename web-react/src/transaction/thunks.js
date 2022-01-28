import graphQlClient from '../appolo-client'
import {
  loadTransactionsFailure,
  loadTransactionsInProgress,
  loadTransactionsSuccess,
  addTransactions,
  addTransactionsAggregate,
  addTotalSpent,
  addIncome,
} from './actions'
import {
  FETCH_TRANSACTIONS,
  CREATE_TRANSACTIONS,
  FETCH_TRANSACTION_AGGREGATE,
} from './queries'

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

export const loadTotalSpent = () => async (dispatch) => {
  try {
    const where = {
      is_debited: true,
    }

    graphQlClient
      .query({
        query: FETCH_TRANSACTION_AGGREGATE,
        variables: { where },
      })
      .then((result) => {
        const {
          data: {
            transactionsAggregate: {
              amount: { sum },
            },
          },
        } = result
        dispatch(addTotalSpent(sum))
      })
      .catch(() => {
        const message = 'An error occured while getting the total spent.'
        console.log(message)
      })
  } catch (e) {
    const message = 'An error occured while getting the total spent.'
    console.log(message)
  }
}

export const loadIncome = () => async (dispatch) => {
  try {
    const where = {
      is_debited: false,
    }

    graphQlClient
      .query({
        query: FETCH_TRANSACTION_AGGREGATE,
        variables: { where },
      })
      .then((result) => {
        const {
          data: {
            transactionsAggregate: {
              amount: { sum },
            },
          },
        } = result
        dispatch(addIncome(sum))
      })
      .catch(() => {
        const message = 'An error occured while getting the total spent.'
        console.log(message)
      })
  } catch (e) {
    const message = 'An error occured while getting the total spent.'
    console.log(message)
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
