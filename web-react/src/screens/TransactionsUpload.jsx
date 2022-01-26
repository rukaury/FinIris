import React, { useState, useEffect } from 'react';
import HorizontalLinearStepper from '../components/HorizontalLinearStepper';
import { makeStyles } from '@material-ui/core';
import { bankInstitutions } from '../transaction/enums';
import { bankAccounts } from '../transaction/enums';
import { 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button 
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
    connectTransactionData,
    extractData, 
    extractFileData,
    isCreditAccount 
} from '../transaction/helper';

import { extractMerchantData, removeExistingMerchants } from '../merchant/helper';
import { connect } from 'react-redux';
import { loadTransactions, createTransactions } from '../transaction/thunks';
import { getTransactions, getTransactionsLoading } from '../transaction/selectors';
import { getMerchants, getMerchantsLoading } from '../merchant/selectors';
import { loadMerchants, createMerchants } from '../merchant/thunks';
import { getUsername } from '../user/selectors';

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
                options.map((option, index) => <MenuItem key={`select-menu-${index}`} value={option.toLowerCase()}>{option}</MenuItem>)
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
    const [bank, setBank] = useState("");
    const [account, setAccount] = useState("");
    const [isCredit, setCredit] = useState(false);
    const [invalidData, setInvalidData] = useState([]);
    const [validData, setValidData] = useState([]);
    //const [message, setMessage] = useState("");

    useEffect(() => {
        startLoadingTransactions(username)
        startLoadingMerchants(username)
    }, [])

    useEffect(() => {
        setCredit(isCreditAccount(account))
    }, [account])

    useEffect(() => {
        if(validData.length > 0){
            const newMerchants = extractMerchantData(validData);
            const filteredMerchants = removeExistingMerchants(newMerchants, merchants);
            const filteredTransactions = removeExistingMerchants(validData, transactions);
            const newTransactions = connectTransactionData(username, filteredTransactions);

            handleAddMerchants(filteredMerchants)
            .then(message => {
                console.log(message);
                handleAddTransactions(newTransactions)
                .then(message => console.log(message))
                .catch(message => console.log(message))
            })
            .catch(message => console.log(message))            
        }
    }, [validData])

    useEffect(() => {
        if(invalidData.length > 0){
            console.log(invalidData);
        }
    }, [invalidData])


    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const handleAccountChange = (event) => {
        setAccount(event.target.value);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        extractFileData(file)
        .then((result) => {
            const { validData, invalidData } = extractData(result, isCredit);
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
    const content = (
        <>
            <HorizontalLinearStepper steps={steps} />
            {
                false &&
                <Alert severity="warning">{}</Alert>
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
