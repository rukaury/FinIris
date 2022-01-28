import {
  ADD_TRANSACTIONS,
  LOAD_TRANSACTIONS_FAILURE,
  LOAD_TRANSACTIONS_IN_PROGRESS,
  LOAD_TRANSACTIONS_SUCCESS,
  ADD_TRANSACTIONS_AGGREGATE,
} from './actions'

const initialState = {
  isLoading: false,
  transactionsAggregate: {},
  data: [],
}

export const transactions = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case ADD_TRANSACTIONS: {
      const { transactions } = payload
      return {
        ...state,
        data: state.data.concat(transactions),
      }
    }
    case ADD_TRANSACTIONS_AGGREGATE: {
      const { transactionsAggregate } = payload
      return {
        ...state,
        transactionsAggregate: transactionsAggregate,
      }
    }
    case LOAD_TRANSACTIONS_SUCCESS: {
      const { transactions } = payload
      return {
        isLoading: false,
        data: transactions,
      }
    }
    case LOAD_TRANSACTIONS_IN_PROGRESS:
      return {
        ...state,
        isLoading: true,
      }
    case LOAD_TRANSACTIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}
