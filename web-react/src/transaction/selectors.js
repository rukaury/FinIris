export const getTransactions = (state) => state.transactions.data
export const getTransactionsAggregate = (state) =>
  state.transactions.transactionsAggregate
export const getTransactionsLoading = (state) => state.transactions.isLoading
export const getTotalSpent = (state) => state.transactions.totalSpent
export const getIncome = (state) => state.transactions.income
