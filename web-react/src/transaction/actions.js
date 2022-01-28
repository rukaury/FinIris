export const ADD_TRANSACTIONS = 'ADD_TRANSACTION'
export const addTransactions = (transactions) => ({
  type: ADD_TRANSACTIONS,
  payload: { transactions },
})

export const ADD_TRANSACTIONS_AGGREGATE = 'ADD_TRANSACTIONS_AGGREGATE'
export const addTransactionsAggregate = (transactionsAggregate) => ({
  type: ADD_TRANSACTIONS_AGGREGATE,
  payload: { transactionsAggregate },
})

export const LOAD_TRANSACTIONS_IN_PROGRESS = 'LOAD_TRANSACTIONS_IN_PROGRESS'
export const loadTransactionsInProgress = () => ({
  type: LOAD_TRANSACTIONS_IN_PROGRESS,
})

export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS'
export const loadTransactionsSuccess = (transactions) => ({
  type: LOAD_TRANSACTIONS_SUCCESS,
  payload: { transactions },
})

export const LOAD_TRANSACTIONS_FAILURE = 'LOAD_TRANSACTIONS_FAILURE'
export const loadTransactionsFailure = () => ({
  type: LOAD_TRANSACTIONS_FAILURE,
})
