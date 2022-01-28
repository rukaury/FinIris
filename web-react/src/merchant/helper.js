const doesMerchantExist = (merchants, { name, merchant_id }) => {
  if (merchants.length > 0) {
    const existing = merchants.filter(
      (merchant) =>
        (merchant.name === name && merchant.merchant_id === merchant_id) ||
        merchant.name === name
    )
    if (existing.length > 0) {
      return true
    }
  }

  return false
}

export const extractMerchantData = (data) => {
  if (data.length > 0) {
    return data.map(({ merchant }) => merchant)
  }
}

export const removeExistingMerchants = (newMerchants, existingMerchants) => {
  const uniqueMerchants = newMerchants.filter(
    (merchant, index, self) =>
      self.findIndex(
        (m) =>
          m.name === merchant.name && m.merchant_id === merchant.merchant_id
      ) === index || !merchant.name
  )

  return uniqueMerchants.filter(
    ({ name, merchant_id }) =>
      !doesMerchantExist(existingMerchants, { name, merchant_id })
  )
}
