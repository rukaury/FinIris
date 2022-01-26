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
      location {
        city
        province
        country
        address
        address_id
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
        location {
          city
          province
          country
          address
          address_id
        }
      }
    }
  }
`
