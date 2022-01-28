import { gql } from '@apollo/client'

/*********************************************
 *
 * QUERIES
 *
 **********************************************/

export const FETCH_MERCHANTS = gql`
  query fetchMerchants($where: MerchantWhere) {
    merchants(where: $where) {
      merchant_id
      name
      city {
        name
      }
      province {
        name
        code
      }
    }
  }
`

/*********************************************
 *
 * MUTATIONS
 *
 **********************************************/

export const CREATE_MERCHANTS = gql`
  mutation createMerchants($input: [MerchantCreateInput!]!) {
    createMerchants(input: $input) {
      merchants {
        merchant_id
        name
        transactions {
          transaction_id
        }
        city {
          name
        }
        province {
          name
          code
        }
      }
    }
  }
`
