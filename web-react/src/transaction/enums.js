export const bankInstitutions = {
  Cibc: {
    id: 'cibc',
    name: 'Canadian Imperial Bank of Commerce - cibc',
  },
}

export const bankAccounts = {
  Debit: {
    id: 'Debit',
  },
  Savings: {
    id: 'Savings',
  },
  Credit: {
    id: 'Credit',
  },
}

export const transactionTypes = {
  BranchTransaction: {
    id: 'BranchTransaction',
    value: 'Branch Transaction',
    transactions: ['EFT DEBIT REVERSAL', 'DEPOSIT IBB'],
    ignore: [],
  },
  ElectronicFundsTransfer: {
    id: 'ElectronicFundsTransfer',
    value: 'Electronic Funds Transfer',
    transactions: [
      'NETWORK TRANSACTION FEE',
      'PREAUTHORIZED DEBIT',
      'DEPOSIT',
      'PAY',
      'CREDIT MEMO',
    ],
    ignore: [],
  },
  InternetBanking: {
    id: 'InternetBanking',
    value: 'Internet Banking',
    transactions: ['E-TRANSFER', 'ETRANSFER', 'INTERNET BILL PAY'],
    ignore: ['INTERNET TRANSFER'],
  },
  PointOfSale: {
    id: 'PointOfSale',
    value: 'Point of Sale',
    transactions: [
      'Interac RETAIL PURCHASE',
      'Visa Debit INTL VISA DEB RETAIL PURCHASE',
      'Visa Debit VISA DEBIT RETAIL PURCHASE',
      'Visa Debit INT VISA DEB PURCHASE REVERSAL',
    ],
    ignore: ['PAYMENT THANK YOU', 'PAIEMEN T MERCI', 'PAIEMENT MERCI'],
  },
  AutomatedBankingMachine: {
    id: 'AutomatedBankingMachine',
    value: 'Automated Banking Machine',
    transactions: [
      'INTL ATM WITHDRAWAL* INTL ATM TRANSACTION*SCD',
      'ATM WITHDRAWAL',
      'INSTANT TELLER WITHDRAWAL',
    ],
    ignore: ['ATM TRANSFER'],
  },
}
