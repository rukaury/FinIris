import {
  ADD_MERCHANTS,
  LOAD_MERCHANTS_FAILURE,
  LOAD_MERCHANTS_IN_PROGRESS,
  LOAD_MERCHANTS_SUCCESS
} from './actions';

const initialState = {
  isLoading: false,
  data: []
};

export const merchants = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_MERCHANTS: {
      const { merchants } = payload;
      return {
        ...state,
        data: state.data.concat(merchants)
      };
    }
    case LOAD_MERCHANTS_SUCCESS: {
      const { merchants } = payload;
      return {
        isLoading: false,
        data: merchants
      };
    }
    case LOAD_MERCHANTS_IN_PROGRESS:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_MERCHANTS_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};
