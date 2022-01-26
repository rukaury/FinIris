export const ADD_MERCHANTS = 'ADD_MERCHANT'
export const addMerchants = (merchants) => ({
  type: ADD_MERCHANTS,
  payload: { merchants },
})

export const LOAD_MERCHANTS_IN_PROGRESS = 'LOAD_MERCHANTS_IN_PROGRESS'
export const loadMerchantsInProgress = () => ({
  type: LOAD_MERCHANTS_IN_PROGRESS,
})

export const LOAD_MERCHANTS_SUCCESS = 'LOAD_MERCHANTS_SUCCESS'
export const loadMerchantsSuccess = (merchants) => ({
  type: LOAD_MERCHANTS_SUCCESS,
  payload: { merchants },
})

export const LOAD_MERCHANTS_FAILURE = 'LOAD_MERCHANTS_FAILURE'
export const loadMerchantsFailure = () => ({
  type: LOAD_MERCHANTS_FAILURE,
})
