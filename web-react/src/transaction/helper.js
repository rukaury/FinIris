import { transactionTypes, bankAccounts } from './enums'
import xlsx from 'xlsx'

export const doesTransactionExist = (
  transactions,
  { date, title, amount, is_debited, account }
) => {
  if (transactions.length > 0) {
    const existing = transactions.filter(
      (transaction) =>
        Date(transaction.date) === Date(date) &&
        transaction.title === title &&
        transaction.amount === amount &&
        transaction.account === account &&
        transaction.is_debited === is_debited
    )

    if (existing.length > 0) {
      return true
    }
  }

  return false
}

export const removeExistingTransactions = (
  newTransactions,
  existingTransactions
) => {
  return newTransactions.filter(
    ({ date, title, amount, is_debited, account }) =>
      !doesTransactionExist(existingTransactions, {
        date,
        title,
        amount,
        is_debited,
        account,
      })
  )
}

export const connectTransactionData = (username, transactions) => {
  return transactions.map((transaction) => ({
    ...transaction,
    user: {
      connect: {
        where: {
          username: username,
        },
      },
    },
    merchant: {
      connect: {
        where: {
          name: transaction?.merchant?.name || '',
          AND: {
            merchant_id: transaction?.merchant?.merchant_id || '',
          },
        },
      },
    },
  }))
}

export const isCreditAccount = (searchAccount) => {
  const account = Object.keys(bankAccounts).filter((key) =>
    key.toLowerCase().includes('credit')
  )
  return account && searchAccount
    ? account[0].toLowerCase() === searchAccount.toLowerCase()
    : false
}

const validateTransactionDate = (date) => {
  return Date.parse(date)
}

const validateTransactionAmount = (amount) => {
  const floatRegex = new RegExp('[+-]?([0-9]*[.])?[0-9]+')
  return floatRegex.test(amount)
}

const cleanTitle = (title, text) => {
  // Remove the extracetd transaction type
  return title.replace(text, '').replace('-', '').trim()
}

const extractTransactionData = (title, isCreditAccount) => {
  if (!isCreditAccount) {
    const typeArray = Object.values(transactionTypes).filter(({ value }) =>
      title.toLowerCase().includes(value.toLowerCase())
    )
    const type = typeArray.length > 0 ? typeArray[0]?.id : ''

    if (typeArray.length > 0) {
      const newTitle = cleanTitle(title, typeArray[0].value)
      const titleArray = typeArray[0].transactions.filter((value) =>
        newTitle.toLowerCase().includes(value.toLowerCase())
      )

      if (titleArray.length > 0) {
        return {
          cleanData: {
            type,
            title: titleArray[0],
          },
          title: cleanTitle(newTitle, titleArray[0]),
        }
      }

      return {
        cleanData: {
          type,
          title: newTitle,
        },
        title: newTitle,
      }
    }

    return {
      cleanData: {
        title,
      },
      title,
    }
  }

  const type = Object.keys(transactionTypes).filter((key) =>
    key.toLowerCase().includes('pointofsale')
  )

  return {
    cleanData: {
      type: type ? type[0] : null,
      title: 'CREDIT CARD PURCHASE',
    },
    title,
  }
}

const extractMerchantData = (text) => {
  const merchantIdRegex = /(#(\w+){1,})?/gi // eslint-disable-line
  const merchantRegex = /([a-zA-Z])()\w+/gi // eslint-disable-line
  const merchantLocationRegex = /\w+, ([a-zA-Z]){2}/gi // eslint-disable-line
  const merchantLocation = text.match(merchantLocationRegex)?.join('') || null
  const [city, province] = merchantLocation
    ? merchantLocation.split(', ')
    : ['', '']
  const newText = merchantLocation ? cleanTitle(text, merchantLocation) : text
  const merchant_id =
    newText.match(merchantIdRegex)?.join('').replace('#', '') || ''
  const name = newText.match(merchantRegex)?.join(' ') || ''
  return {
    merchant_id,
    name,
    location: {
      create: {
        city,
        province,
      },
    },
  }
}

export const extractData = (extractedData, isCreditAccount) => {
  const invalidData = extractedData.filter((data) => {
    const [date] = data
    const transactionTitle = String(data[1])
    const amount = data[2] ? data[2] : data[3]

    return (
      (date && !validateTransactionDate(date)) ||
      !transactionTitle ||
      (amount && !validateTransactionAmount(amount))
    )
  })

  const reducer = (previousArray, currentArray) =>
    previousArray.concat(currentArray)
  const ignoredData = Object.values(transactionTypes)
    .map(({ ignore }) => ignore)
    .reduce(reducer)

  const filteredData = extractedData.filter((data) => {
    const [date] = data
    const transactionTitle = String(data[1])
    const amount = data[2] ? data[2] : data[3]

    return (
      date &&
      validateTransactionDate(date) &&
      transactionTitle &&
      !ignoredData.some((ignoreValue) =>
        transactionTitle.toLowerCase().includes(ignoreValue.toLowerCase())
      ) &&
      amount &&
      validateTransactionAmount(amount)
    )
  })

  const validData = filteredData.map((data) => {
    const [date] = data
    const transactionTitle = String(data[1])
    const amount = data[2] ? data[2] : data[3]
    const is_debited = data[2] ? true : false
    const { title, cleanData } = extractTransactionData(
      transactionTitle,
      isCreditAccount
    )

    if (title) {
      return {
        date,
        amount: parseFloat(amount),
        is_debited,
        merchant: extractMerchantData(title),
        ...cleanData,
      }
    }

    return {
      date,
      amount: parseFloat(amount),
      is_debited,
      merchant: null,
      ...cleanData,
    }
  })

  return {
    validData,
    invalidData,
  }
}

export const extractFileData = (file) => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException('An exception occured while parsing file.'))
    }

    reader.onload = function () {
      const workbook = xlsx.read(reader.result, {
        type: 'binary',
      })

      const sheet = workbook.SheetNames[0]
      const rows = xlsx.utils.sheet_to_row_object_array(
        workbook.Sheets[sheet],
        { defval: '', header: 1, raw: false }
      )

      resolve(rows)
    }

    reader.readAsText(file)
  })
}
