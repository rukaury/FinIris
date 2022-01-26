import graphQlClient from '../appolo-client'
import {
  loadMerchantsFailure,
  loadMerchantsInProgress,
  loadMerchantsSuccess,
  addMerchants,
} from './actions'
import { FETCH_MERCHANTS, CREATE_MERCHANTS } from './queries'

export const loadMerchants = (username) => async (dispatch) => {
  try {
    const fetchInput = {
      where: {
        transactions: {
          user: {
            username: username,
          },
        },
      },
    }

    dispatch(loadMerchantsInProgress())
    graphQlClient
      .query({
        query: FETCH_MERCHANTS,
        variables: { fetchInput },
      })
      .then((result) => {
        const {
          data: { merchants },
        } = result
        dispatch(loadMerchantsSuccess(merchants))
      })
      .catch(() => dispatch(loadMerchantsFailure()))
  } catch (e) {
    dispatch(loadMerchantsFailure())
  }
}

export const createMerchants = (filteredMerchants) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      const input = filteredMerchants

      graphQlClient
        .mutate({
          mutation: CREATE_MERCHANTS,
          variables: { input },
          update: (_cache, result) => {
            const {
              data: { createMerchants },
            } = result
            const message = 'Successfully added merchants.'
            dispatch(addMerchants(createMerchants))
            resolve(message)
          },
        })
        .catch((e) => {
          const message = 'An error occured while adding merchants.' + e
          reject(message)
        })
    } catch (e) {
      const message = 'An error occured while adding merchants.' + e
      reject(message)
    }
  })
}
