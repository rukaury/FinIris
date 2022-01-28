import React, { useState, useEffect } from 'react';
import HorizontalLinearStepper from '../components/HorizontalLinearStepper';
import { makeStyles, Typography } from '@material-ui/core';
import { bankInstitutions } from '../transaction/enums';
import { bankAccounts } from '../transaction/enums';
import { 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button 
} from '@material-ui/core';

import { 
    connectTransactionData,
    extractData, 
    extractFileData
} from '../transaction/helper';

import { extractMerchantData, removeExistingMerchants } from '../merchant/helper';
import { connect } from 'react-redux';
import { loadTransactions, createTransactions } from '../transaction/thunks';
import { getTransactions, getTransactionsLoading } from '../transaction/selectors';
import { getMerchants, getMerchantsLoading } from '../merchant/selectors';
import { loadMerchants, createMerchants } from '../merchant/thunks';
import { getUsername } from '../user/selectors';
import { removeExistingTransactions } from '../transaction/helper';
import UnsavedData from '../components/UnsavedData';

const getInstitutions = () => Object.values(bankInstitutions).map(({ name }) => name);
const getAccounts = () => Object.keys(bankAccounts);

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    input: {
        display: 'none',
    },
    dashboardButton: {
        marginBlock: theme.spacing(2)
    }
}));

const SelectOption = ({ label, options, selectedValue, handleChange}) => {
    const classes = useStyles();
    return (
        <FormControl className={classes.formControl}>
            <InputLabel id={`select-${label.replace(" ", "-")}-label`}>{label}</InputLabel>
            <Select
                labelId={`select-${label.replace(" ", "-")}-label`}
                id={`select-${label.replace(" ", "-")}`}
                value={selectedValue}
                onChange={handleChange}
            >
            {
                options.map((option, index) => <MenuItem key={`select-menu-${index}`} value={option}>{option}</MenuItem>)
            }
            </Select>
        </FormControl>
    ) 
}

const UploadButton = ({ handleUpload }) => {
    const classes = useStyles();

    return (
        <div>
            <input
                accept=".csv"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleUpload}
            />
            <label htmlFor="contained-button-file">
                <Button 
                    variant="contained" 
                    color="primary" 
                    component="span"
                >
                Click to Upload
                </Button>
            </label>
        </div>
    );
}

const uploadMerchants = ({ 
    handleAddMerchants, 
    filteredMerchants, 
    unsavedMerchants
}) => {
    return new Promise((resolve) => {
        const maxInput = filteredMerchants.length >= 5 ? 5 : filteredMerchants.length;
    
        if(filteredMerchants.length === 0){
            return resolve(unsavedMerchants);
        }

        if(filteredMerchants.length >= maxInput){
            handleAddMerchants(filteredMerchants.slice(0, maxInput))
            .then(() => {
                return resolve(uploadMerchants({ 
                    handleAddMerchants, 
                    filteredMerchants: filteredMerchants.slice(maxInput),
                    unsavedMerchants
                }))
            })
            .catch(() => {
                return resolve(uploadMerchants({ 
                    handleAddMerchants, 
                    filteredMerchants: filteredMerchants.slice(maxInput),
                    unsavedMerchants: unsavedMerchants.concat(filteredMerchants.slice(0, maxInput))
                }))
            })
        }
    })    
}

const uploadTransactions = ({ 
    handleAddTransactions, 
    newTransactions, 
    unsavedTransactions,
    completed = false
}) => {
    return new Promise((resolve) => {
        const maxInput = newTransactions.length >= 5 ? 5 : newTransactions.length;
    
        if(newTransactions.length === 0){
            return resolve({ unsavedTransactions, completed: true});
        }

        if(newTransactions.length >= maxInput){
            handleAddTransactions(newTransactions.slice(0, maxInput))
            .then(() => {
                return resolve(uploadTransactions({ 
                    handleAddTransactions, 
                    newTransactions: newTransactions.slice(maxInput),
                    unsavedTransactions,
                    completed
                }))
            })
            .catch(() => {
                return resolve(uploadTransactions({ 
                    handleAddTransactions, 
                    newTransactions: newTransactions.slice(maxInput),
                    unsavedTransactions: unsavedTransactions.concat(newTransactions.slice(0, maxInput)),
                    completed
                }))
            })
        }
    })    
}

function TransactionsUpload({
    username, 
    transactions, 
    transactionsLoading,
    merchants,
    merchantsLoading, 
    startLoadingTransactions,
    startLoadingMerchants,
    handleAddMerchants,
    handleAddTransactions
}) {
    const classes = useStyles();
    const [bank, setBank] = useState("");
    const [account, setAccount] = useState("");
    const [invalidData, setInvalidData] = useState([]);
    const [validData, setValidData] = useState([]);
    const [unsavedMerchants, setUnsavedMerchants] = useState([]);
    const [unsavedTransactions, setUnsavedTransactions] = useState([]);
    const [completed, setCompleted] = useState(true);

    useEffect(() => {
        startLoadingTransactions(username)
        startLoadingMerchants(username)
    }, [])

    useEffect(() => {
        if(validData.length > 0){
            const newMerchants = extractMerchantData(validData);
            const filteredMerchants = removeExistingMerchants(newMerchants, merchants);
            const filteredTransactions = removeExistingTransactions(validData, transactions);
            const newTransactions = connectTransactionData(username, filteredTransactions);
            uploadMerchants({handleAddMerchants, filteredMerchants, unsavedMerchants: []})
            .then(unsavedMerchants => setUnsavedMerchants(unsavedMerchants))
            uploadTransactions({handleAddTransactions, newTransactions, unsavedTransactions: []})
            .then(({ unsavedTransactions, completed }) => {
                setUnsavedTransactions(unsavedTransactions);
                setCompleted(completed)
            })
        }
    }, [validData])

    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const handleAccountChange = (event) => {
        setAccount(event.target.value);
    };

    const handleFileUpload = (event) => {
        setCompleted(false);
        const file = event.target.files[0];
        extractFileData(file)
        .then((result) => {
            const { validData, invalidData } = extractData(result, account);
            setValidData(validData);
            setInvalidData(invalidData);
        })    
    }

    const steps = [
        {
            label: "Select your banking institution",
            content: <SelectOption 
                label='Bank Institution'
                options={getInstitutions()}
                selectedValue={bank}
                handleChange={handleBankChange}
                />
        },
        {
            label: "Select the account type",
            content: <SelectOption 
                label='Account type'
                options={getAccounts()}
                selectedValue={account}
                handleChange={handleAccountChange}
                />
        },
        {
            label: "Upload CSV file",
            content: <UploadButton handleUpload={handleFileUpload}/>
        }
    ]

    const dataLoadingMessage = <div>Loading data...</div>

    const merchantsHeaders = [
        "Merchant Id",
        "Merchant Name",
        "Merchant City",
        "Mrchant Province"
    ]

    const transactionsHeaders = [
        "Date",
        "Title",
        "Amount",
        "type",
        "Merchant Name"
    ]

    const invalidDataHeaders = [
        "Date",
        "Title",
        "Debit Amount",
        "Credit Amount",
        "Card Number"
    ]

    const content = (
        <>
            {
                !completed || (validData.length === 0 && invalidData.length === 0) &&
                <HorizontalLinearStepper steps={steps} /> 
            }

            {
                unsavedTransactions.length > 0 &&
                <UnsavedData 
                headers={transactionsHeaders} 
                rows={
                    unsavedTransactions.map(({ 
                        title, 
                        type, 
                        amount, 
                        user: { connect: { edge: { date } } },
                        merchant: { connect: { where: {node: { name } } } }
                    }) => [date, title, amount, type, name])
                }
                />
            }

            {
                unsavedMerchants.length > 0 &&
                <UnsavedData 
                headers={merchantsHeaders} 
                rows={
                    unsavedMerchants.map(({ 
                        merchant_id, 
                        name, 
                        loaction: { create: { node: { city, province } } }
                    }) => [merchant_id, name, city, province])
                }
                />
            }

            {
                invalidData.length > 0 &&
                <>
                    <h3>Invalid Data</h3>
                    <p>Transaction date or amount is invalid!</p>
                    <UnsavedData 
                    headers={invalidDataHeaders} 
                    rows={invalidData}
                    />
                </>
            }

            {
                completed &&
                <Button className={classes.dashboardButton} href="/" variant="contained" color="primary">Go to Dashboard!</Button> 
            }

            {
                !completed &&
                <Typography>Uploading data...</Typography> 
            }
        </>
    ) 

    return transactionsLoading || merchantsLoading ? dataLoadingMessage : content;
};

const mapStateToProps = state =>({
    transactionsLoading: getTransactionsLoading(state),
    transactions: getTransactions(state),
    merchants: getMerchants(state),
    merchantsLoading: getMerchantsLoading(state),
    username: getUsername(state)
})
  
const mapDispatchToProps = dispatch => ({
    startLoadingTransactions: username => dispatch(loadTransactions(username)),
    startLoadingMerchants: username => dispatch(loadMerchants(username)),
    handleAddMerchants: filteredMerchants => dispatch(createMerchants(filteredMerchants)),
    handleAddTransactions: newTransactions => dispatch(createTransactions(newTransactions))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(TransactionsUpload);
