const doesMerchantExist = (merchants, { name, merchantId }) => {
  if (merchants.length > 0) {
    const existing = merchants.filter(
      (merchant) =>
        (merchant.name === name && merchant.merchantId === merchantId) || merchant.name === name
    );
    if (existing.length > 0) {
      return true;
    }
  }

  return false;
};

export const extractMerchantData = (data) => {
  if (data.length > 0) {
    return data.map(({ merchant }) => merchant);
  }
  return [];
};

export const removeExistingMerchants = (newMerchants, existingMerchants) => {
  const uniqueMerchants = newMerchants.filter(
    (merchant, index, self) =>
      self.findIndex((m) => m.name === merchant.name && m.merchantId === merchant.merchantId) ===
        index || !merchant.name
  );

  return uniqueMerchants.filter(
    ({ name, merchantId }) => !doesMerchantExist(existingMerchants, { name, merchantId })
  );
};
