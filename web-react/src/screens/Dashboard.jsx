import React, { useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux';
import { 
  loadTransactions,
  loadIncome, 
  loadTotalSpent 
} from '../transaction/thunks';
import { 
  getTransactions, 
  getTransactionsLoading ,
  getIncome,
  getTotalSpent
} from '../transaction/selectors';
import { getMerchants, getMerchantsLoading } from '../merchant/selectors';
import { loadMerchants } from '../merchant/thunks';
import { getUsername } from '../user/selectors';
import SummaryCard from '../components/dashboard/SummaryCard';

const fixedFloat = (value) => parseFloat(value).toFixed(2);

const Dashboard = ({ 
  username, 
  transactions, 
  transactionsLoading,
  merchantsLoading,
  merchants,
  startLoadingTransactions,
  startLoadingIncome,
  startLoadingTotalSpent,
  startLoadingMerchants,
  income,
  totalSpent
}) => {

  useEffect(() => {
    startLoadingTransactions(username)
  }, [])

  useEffect(() => {
    if(transactions.length > 0){
      startLoadingIncome()
      startLoadingTotalSpent()
      startLoadingMerchants(username)
    }
  }, [transactions])

  const theme = useTheme()
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    }
  }))
  const classes = useStyles(theme)
  const transactionsLoadingMessage = <div>Loading transactions...</div>
  const content = (
    <Grid container spacing={4}>
      {/* No data available */}
      {
        transactions.length === 0 &&
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography>No Data available.</Typography>
          </Paper>
        </Grid>
      }
      {
        !(transactions.length === 0) &&
        <>
          <Grid item xs={12} md={3}>
            <SummaryCard title='Transactions' data={transactions.length} color="#F7D8BA"/>
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard title='Merchants' data={merchants.length} color="#D9DCFC"/>
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard title='Total Spent' data={totalSpent} color="#D9FCEF"/>
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard title='Income' data={income} color="#E1FCD9"/>
          </Grid>
        </>
      }
    </Grid>
  )

  return transactionsLoading || merchantsLoading ? transactionsLoadingMessage : content;
}

const mapStateToProps = state =>({
  transactionsLoading: getTransactionsLoading(state),
  transactions: getTransactions(state),
  merchantsLoading: getMerchantsLoading(state),
  merchants: getMerchants(state),
  username: getUsername(state),
  totalSpent: fixedFloat(getTotalSpent(state)),
  income: fixedFloat(getIncome(state))
})

const mapDispatchToProps = dispatch => ({
  startLoadingTransactions: username => dispatch(loadTransactions(username)),
  startLoadingMerchants: username => dispatch(loadMerchants(username)),
  startLoadingTotalSpent: () => dispatch(loadTotalSpent()),
  startLoadingIncome: () => dispatch(loadIncome())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
